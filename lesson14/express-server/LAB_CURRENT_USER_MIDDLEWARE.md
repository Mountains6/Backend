# Лабораторная работа: Current User Middleware

## Тема

Добавление middleware, который определяет текущего пользователя по JWT-токену и сохраняет его в `req.currentUser`.

## Идея лабораторной

В реальном backend-приложении после login пользователь получает access token. Затем frontend отправляет этот токен в каждом защищённом запросе.

Например:

```http
GET /users/me
Authorization: Bearer jwt-token
```

Backend должен:

1. Прочитать токен из заголовка `Authorization`.
2. Проверить, что токен настоящий и не истёк.
3. Достать из токена `userId`.
4. Найти пользователя в базе данных.
5. Положить безопасные данные пользователя в `req.currentUser`.
6. Передать запрос дальше в controller.

Такую задачу удобно вынести в отдельный middleware, чтобы не повторять одну и ту же проверку в каждом controller.

## Цель работы

Научиться:

1. Создавать middleware для авторизованных запросов.
2. Работать с заголовком `Authorization`.
3. Использовать формат `Bearer token`.
4. Проверять JWT-токен.
5. Доставать пользователя из базы по `userId`.
6. Расширять тип `Express.Request` в TypeScript.
7. Использовать `req.currentUser` внутри controller.
8. Проверять защищённый endpoint через `curl`.

## Что должно получиться

После выполнения лабораторной работы появится endpoint:

```http
GET /users/me
```

Он будет возвращать текущего авторизованного пользователя:

```json
{
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  }
}
```

В ответе не должно быть поля `password`.

Если токена нет, токен неправильный или пользователь из токена не найден, сервер должен вернуть статус `401`.

Примеры ошибок:

```json
{
  "error": "Authorization header required"
}
```

```json
{
  "error": "Bearer token required"
}
```

```json
{
  "error": "Invalid or expired token"
}
```

## Маршрут запроса

После выполнения работы запрос будет проходить такой путь:

```text
Client
  |
  | GET /users/me
  | Authorization: Bearer jwt-token
  v
Express router
  |
  v
createCurrentUserMiddleware(repo)
  |
  | 1. Проверяет заголовок Authorization
  | 2. Проверяет JWT
  | 3. Достаёт userId
  | 4. Ищет пользователя в базе
  | 5. Записывает req.currentUser
  v
UserController.currentUser
  |
  v
JSON response
```

Главная идея: controller не должен сам проверять токен. Controller должен получить уже подготовленный `req.currentUser`.

## Перед началом

Запустите проект:

```bash
docker compose up --build
```

Откройте второй терминал и проверьте health endpoint:

```bash
curl http://localhost:3000/helth
```

Ожидаемый ответ:

```json
{
  "status": "ok"
}
```

Примените миграции:

```bash
docker compose exec app npm run db:migrate:container
```

Эта команда создаёт таблицы `users` и `todos` внутри Postgres-контейнера.

Если миграции не применить, `POST /users/register` вернёт ошибку SQL-запроса к таблице `users`, потому что таблицы ещё нет в базе.

## Шаг 1. Разбираем текущий login

В проекте уже есть регистрация и login:

```http
POST /users/register
POST /users/login
```

При успешном login сервер возвращает пользователя и токен:

```json
{
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  },
  "token": "jwt-token"
}
```

Откройте файл:

```text
src/modules/users/user.service.ts
```

Найдите строку:

```ts
const token = signedToken({ userId: user.id });
```

Что означает этот код:

1. После проверки email и password сервис создаёт JWT.
2. В payload токена записывается объект `{ userId: user.id }`.
3. Позже мы сможем проверить токен и достать из него `userId`.
4. По этому `userId` middleware найдёт пользователя в базе.

Важно понимать: сам JWT не должен хранить пароль или другие чувствительные данные. В токене достаточно хранить идентификатор пользователя.

### Мини-проверка

После login скопируйте токен и посмотрите на него визуально. JWT состоит из трёх частей, разделённых точками:

```text
header.payload.signature
```

Пример:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.signature
```

Middleware будет проверять именно подпись и payload этого токена.

## Шаг 2. Добавляем поиск пользователя по id

Current User Middleware должен найти пользователя в базе данных. Сейчас repository умеет искать пользователя по email, потому что это нужно для login. Для middleware нужен поиск по `id`.

Откройте файл:

```text
src/modules/users/user.entity.ts
```

Найдите интерфейс `UserRepository` и добавьте метод `findById`:

```ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(email: string, password: string): Promise<User>;
}
```

Разбор:

```ts
findById(id: string): Promise<User | null>;
```

1. Метод принимает `id` пользователя.
2. Возвращает `Promise`, потому что работа с базой асинхронная.
3. Возвращает `User`, если пользователь найден.
4. Возвращает `null`, если пользователя с таким id нет.

Почему нужен `null`:

Токен может быть старым. Например, пользователь был удалён из базы, но у клиента остался старый JWT. В таком случае middleware должен вернуть `401`, а не пропустить запрос дальше.

Теперь откройте файл:

```text
src/modules/users/user.repository.ts
```

Добавьте реализацию метода в класс `DrizzleUserRepository`:

```ts
async findById(id: string): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}
```

Разбор строки:

```ts
const [user] = await db.select().from(users).where(eq(users.id, id));
```

1. `db.select()` начинает SQL-запрос `SELECT`.
2. `.from(users)` указывает таблицу `users`.
3. `.where(eq(users.id, id))` добавляет условие `WHERE users.id = id`.
4. Drizzle возвращает массив пользователей.
5. Через `[user]` мы берём первый элемент массива.

Разбор строки:

```ts
return user ?? null;
```

Если пользователь найден, возвращаем его. Если массив пустой и `user` равен `undefined`, возвращаем `null`.

Полный класс:

```ts
export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  }

  async create(email: string, password: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ email, password })
      .returning();
    return user;
  }
}
```

### Проверка шага

Запустите:

```bash
npm run build
```

Если TypeScript ругается, проверьте:

1. Метод `findById` добавлен в интерфейс `UserRepository`.
2. Метод `findById` реализован в `DrizzleUserRepository`.
3. В `user.repository.ts` уже импортирован `eq` из `drizzle-orm`.

## Шаг 3. Расширяем тип Express Request

В JavaScript можно просто написать:

```ts
req.currentUser = user;
```

Но в TypeScript так делать нельзя без описания типа. Express из коробки знает поля `req.body`, `req.params`, `req.headers`, но не знает наше новое поле `currentUser`.

Поэтому нужно расширить тип `Express.Request`.

Создайте папку:

```text
src/types
```

Создайте файл:

```text
src/types/express.ts
```

Добавьте код:

```ts
import { UserResponseDto } from "../modules/users/user.response.dto";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserResponseDto;
    }
  }
}

export {};
```

Разбор:

```ts
import { UserResponseDto } from "../modules/users/user.response.dto";
```

Мы используем `UserResponseDto`, потому что это безопасный тип пользователя для ответа клиенту. В нём нет `password`.

```ts
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserResponseDto;
    }
  }
}
```

Этот блок говорит TypeScript: "у Express Request может быть дополнительное поле `currentUser`".

Почему стоит знак `?`:

```ts
currentUser?: UserResponseDto;
```

Поле необязательное, потому что не каждый запрос проходит через auth middleware.

Например:

1. `POST /users/register` не имеет текущего пользователя.
2. `POST /users/login` не имеет текущего пользователя.
3. `GET /users/me` должен иметь текущего пользователя после middleware.

```ts
export {};
```

Эта строка делает файл TypeScript-модулем. Без неё `declare global` может работать нестабильно.

Теперь откройте файл:

```text
src/app.ts
```

Добавьте импорт в самое начало:

```ts
import "./types/express";
```

Зачем нужен этот импорт:

1. `npm run build` обычно видит файлы из `tsconfig.json`.
2. `ts-node-dev` в Docker часто компилирует только файлы, которые реально импортированы.
3. Если не импортировать `./types/express`, dev-сервер может не увидеть расширение `Request`.
4. Тогда появится ошибка: `Property 'currentUser' does not exist on type Request`.

### Проверка шага

Пока можно просто запустить:

```bash
npm run build
```

Если ошибки нет, тип подключён корректно.

Если ошибка появляется только при `docker compose up --build`, проверьте, что в `src/app.ts` импорт стоит именно в начале файла:

```ts
import "./types/express";
```

## Шаг 4. Создаём Current User Middleware

Теперь создадим middleware, который будет выполнять всю auth-проверку.

Создайте файл:

```text
src/middleware/current-user.middleware.ts
```

Добавьте код:

```ts
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { verifyToken } from "../lib/jwt";
import { UserRepository } from "../modules/users/user.entity";
import toUserResponse from "../modules/users/user.mapper";

type AccessTokenPayload = JwtPayload & {
  userId?: string;
};

export const createCurrentUserMiddleware =
  (repo: UserRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header required" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Bearer token required" });
    }

    try {
      const payload = verifyToken(token);
      const userId =
        typeof payload === "string"
          ? undefined
          : (payload as AccessTokenPayload).userId;

      if (typeof userId !== "string") {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const user = await repo.findById(userId);

      if (!user) {
        return res.status(401).json({ error: "User from token not found" });
      }

      req.currentUser = toUserResponse(user);
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
```

### Подробный разбор middleware

Импорты:

```ts
import { NextFunction, Request, Response } from "express";
```

Нам нужны типы Express:

1. `Request` - входящий HTTP-запрос.
2. `Response` - HTTP-ответ.
3. `NextFunction` - функция `next`, которая передаёт запрос следующему обработчику.

```ts
import { JwtPayload } from "jsonwebtoken";
```

`verifyToken` может вернуть payload JWT. Этот payload описывается типом `JwtPayload`.

```ts
import { verifyToken } from "../lib/jwt";
```

В проекте уже есть helper для проверки токена. Мы переиспользуем существующую функцию, а не пишем `jwt.verify` прямо в middleware.

```ts
import { UserRepository } from "../modules/users/user.entity";
import toUserResponse from "../modules/users/user.mapper";
```

`UserRepository` нужен, чтобы найти пользователя в базе.

`toUserResponse` нужен, чтобы не положить в `req.currentUser` пароль.

Тип payload:

```ts
type AccessTokenPayload = JwtPayload & {
  userId?: string;
};
```

Стандартный `JwtPayload` не знает, что в нашем токене есть `userId`. Поэтому мы создаём свой тип, который говорит: payload может содержать `userId`.

Почему `userId` необязательный:

Токен может быть неправильный или создан другим кодом. Нельзя слепо доверять payload. Поэтому middleware ниже проверяет:

```ts
if (typeof userId !== "string") {
  return res.status(401).json({ error: "Invalid token payload" });
}
```

Фабрика middleware:

```ts
export const createCurrentUserMiddleware =
  (repo: UserRepository) =>
  async (req: Request, res: Response, next: NextFunction) => {
```

Это не обычный middleware, а функция, которая создаёт middleware.

Почему так:

1. Middleware должен ходить в базу.
2. Для базы нужен repository.
3. Repository создаётся в container.
4. Поэтому мы передаём `repo` внутрь middleware через параметр.

То есть:

```ts
createCurrentUserMiddleware(repo)
```

возвращает настоящий Express middleware:

```ts
async (req, res, next) => {}
```

Чтение заголовка:

```ts
const authHeader = req.headers.authorization;
```

Express приводит HTTP-заголовки к нижнему регистру. Поэтому `Authorization` читается как `authorization`.

Проверка наличия заголовка:

```ts
if (!authHeader) {
  return res.status(401).json({ error: "Authorization header required" });
}
```

Если заголовка нет, продолжать нельзя. Мы сразу возвращаем `401`.

Разбор формата:

```ts
const [scheme, token] = authHeader.split(" ");
```

Ожидаемый формат:

```text
Bearer jwt-token
```

После `split(" ")` получится:

```ts
scheme === "Bearer";
token === "jwt-token";
```

Проверка формата:

```ts
if (scheme !== "Bearer" || !token) {
  return res.status(401).json({ error: "Bearer token required" });
}
```

Если пользователь передал просто `qwerty`, middleware вернёт ошибку.

Проверка JWT:

```ts
const payload = verifyToken(token);
```

Если токен неправильный, истёк или подписан другим `JWT_SECRET`, `verifyToken` выбросит ошибку. Поэтому этот код находится внутри `try/catch`.

Получение `userId`:

```ts
const userId =
  typeof payload === "string"
    ? undefined
    : (payload as AccessTokenPayload).userId;
```

`jsonwebtoken` может вернуть payload как строку или объект. В нашем проекте payload должен быть объектом. Поэтому:

1. Если payload строка, ставим `undefined`.
2. Если payload объект, пробуем достать `userId`.

Проверка `userId`:

```ts
if (typeof userId !== "string") {
  return res.status(401).json({ error: "Invalid token payload" });
}
```

Так мы защищаемся от токенов без `userId`.

Поиск пользователя:

```ts
const user = await repo.findById(userId);
```

Даже если токен валидный, пользователь может отсутствовать в базе. Например, его удалили.

Проверка пользователя:

```ts
if (!user) {
  return res.status(401).json({ error: "User from token not found" });
}
```

Если пользователя нет, запрос не должен пройти дальше.

Запись текущего пользователя:

```ts
req.currentUser = toUserResponse(user);
```

Мы кладём в `req.currentUser` не весь объект `user`, а результат `toUserResponse(user)`.

Это важно, потому что в объекте `user` есть поле `password`.

Передача запроса дальше:

```ts
next();
```

Если `next()` не вызвать, Express не перейдёт к controller, и запрос зависнет.

Обработка ошибок:

```ts
catch {
  return res.status(401).json({ error: "Invalid or expired token" });
}
```

Сюда попадут ошибки проверки JWT. Например:

1. Токен повреждён.
2. Токен истёк.
3. Токен подписан другим `JWT_SECRET`.

### Проверка шага

Запустите:

```bash
npm run build
```

Если TypeScript ругается на `req.currentUser`, вернитесь к шагу 3.

## Шаг 5. Добавляем controller для текущего пользователя

Теперь нужен controller, который вернёт пользователя из `req.currentUser`.

Откройте файл:

```text
src/modules/users/user.controller.ts
```

Внутрь класса `UserController` добавьте метод:

```ts
currentUser = async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ user: req.currentUser });
};
```

Разбор:

```ts
if (!req.currentUser) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

Это дополнительная защита. В нормальном сценарии controller запускается только после middleware, поэтому `req.currentUser` уже должен быть.

Но если кто-то случайно подключит route без middleware, controller не упадёт, а вернёт понятный `401`.

```ts
res.status(200).json({ user: req.currentUser });
```

Если пользователь есть, controller возвращает JSON с текущим пользователем.

Важно: controller не проверяет JWT и не ищет пользователя в базе. Всё это уже сделал middleware.

### Проверка шага

Запустите:

```bash
npm run build
```

Если build проходит, controller видит тип `req.currentUser`.

## Шаг 6. Подключаем middleware к route

Теперь нужно связать URL `/users/me` с middleware и controller.

Откройте файл:

```text
src/modules/users/user.router.ts
```

Добавьте импорты:

```ts
import { createCurrentUserMiddleware } from "../../middleware/current-user.middleware";
import { UserRepository } from "./user.entity";
```

Измените функцию `createUserRouter`, чтобы она принимала `repo`:

```ts
export function createUserRouter(
  controller: UserController,
  repo: UserRepository,
): Router {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/me", createCurrentUserMiddleware(repo), controller.currentUser);

  return router;
}
```

Разбор route:

```ts
router.get("/me", createCurrentUserMiddleware(repo), controller.currentUser);
```

Express выполнит обработчики слева направо:

1. Сначала `createCurrentUserMiddleware(repo)`.
2. Если токен валидный, middleware вызовет `next()`.
3. Потом выполнится `controller.currentUser`.

Если middleware вернул `401`, controller не выполнится.

### Почему `/me`, а не `/users/me`

В `src/app.ts` router подключён так:

```ts
app.use("/users", buildUserRouter());
```

Это значит, что путь из router добавляется после `/users`.

Поэтому:

```ts
router.get("/me", ...)
```

превращается в:

```http
GET /users/me
```

### Проверка шага

Запустите:

```bash
npm run build
```

Если TypeScript ругается, проверьте:

1. `UserRepository` импортирован из `./user.entity`.
2. `createCurrentUserMiddleware` импортирован из `../../middleware/current-user.middleware`.
3. `createUserRouter` теперь принимает два аргумента: `controller` и `repo`.

## Шаг 7. Передаём repository из container

После изменения router нужно обновить container. Иначе `createUserRouter` будет ждать `repo`, но не получит его.

Откройте файл:

```text
src/modules/users/user.container.ts
```

Измените последнюю строку:

```ts
return createUserRouter(controller, repo);
```

Полная функция:

```ts
export function buildUserRouter(): Router {
  const repo = new DrizzleUserRepository();
  const service = new UserService(repo);
  const controller = new UserController(service);

  return createUserRouter(controller, repo);
}
```

Разбор:

```ts
const repo = new DrizzleUserRepository();
```

Создаём repository для работы с таблицей `users`.

```ts
const service = new UserService(repo);
```

Передаём repository в service, потому что service регистрирует и логинит пользователей.

```ts
const controller = new UserController(service);
```

Передаём service в controller.

```ts
return createUserRouter(controller, repo);
```

Передаём controller и repository в router.

Почему repository передаётся и в service, и в router:

1. Service использует repository для `register` и `login`.
2. Middleware использует repository для `GET /users/me`.
3. Middleware создаётся внутри router, поэтому router тоже должен получить repository.

Это пример dependency injection: зависимости создаются в одном месте и передаются туда, где нужны.

## Шаг 8. Добавляем script для миграций внутри Docker

Когда приложение запущено через Docker, внутри app-контейнера база доступна по адресу:

```text
db:5432
```

А с компьютера хоста база доступна по адресу:

```text
localhost:5433
```

Поэтому удобно иметь отдельный script для миграций внутри контейнера.

Откройте файл:

```text
package.json
```

Добавьте script:

```json
"db:migrate:container": "DATABASE_URL_DRIZZLE_KIT=$DATABASE_URL npx drizzle-kit migrate"
```

Фрагмент scripts должен выглядеть так:

```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "db:generate": "npx drizzle-kit generate",
  "db:migrate": "npx drizzle-kit migrate",
  "db:migrate:container": "DATABASE_URL_DRIZZLE_KIT=$DATABASE_URL npx drizzle-kit migrate",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Разбор:

```bash
DATABASE_URL_DRIZZLE_KIT=$DATABASE_URL
```

Мы временно говорим Drizzle использовать Docker-адрес базы из `DATABASE_URL`.

В `.env` он выглядит так:

```text
DATABASE_URL=postgresql://postgres:postgres@db:5432/mydb
```

Именно этот адрес работает внутри app-контейнера.

### Проверка шага

Когда Docker уже запущен, выполните:

```bash
docker compose exec app npm run db:migrate:container
```

Ожидаемый результат:

```text
migrations applied successfully!
```

Если миграции уже были применены раньше, Drizzle может просто завершиться без создания новых таблиц. Это нормально.

## Шаг 9. Финальная проверка TypeScript

Запустите:

```bash
npm run build
```

Ожидаемый результат: команда завершается без ошибок.

Если build не проходит, сначала исправьте TypeScript-ошибки и только потом переходите к HTTP-проверкам.

## Шаг 10. Проверяем через HTTP-запросы

Перед HTTP-проверками убедитесь, что:

1. `docker compose up --build` запущен.
2. `curl http://localhost:3000/helth` возвращает `{"status":"ok"}`.
3. Миграции выполнены:

```bash
docker compose exec app npm run db:migrate:container
```

### 10.1. Регистрируем пользователя

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"12345678"}'
```

Ожидаемый ответ:

```json
{
  "id": "user-id",
  "email": "student@example.com",
  "createdAt": "2026-05-20T08:00:00.000Z"
}
```

Важно: пароль должен быть минимум 8 символов. Поэтому используем `12345678`, а не `123456`.

Если пользователь уже существует, используйте другой email:

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student2@example.com","password":"12345678"}'
```

### 10.2. Логинимся

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"12345678"}'
```

Ожидаемый ответ:

```json
{
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  },
  "token": "jwt-token"
}
```

Скопируйте значение `token`. Оно понадобится для следующего запроса.

### 10.3. Проверяем `/users/me` без токена

```bash
curl http://localhost:3000/users/me
```

Ожидаемый статус:

```http
401 Unauthorized
```

Ожидаемый ответ:

```json
{
  "error": "Authorization header required"
}
```

Что проверяем:

Middleware не должен пропускать запрос без заголовка `Authorization`.

### 10.4. Проверяем `/users/me` с неправильным форматом токена

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: qwerty"
```

Ожидаемый статус:

```http
401 Unauthorized
```

Ожидаемый ответ:

```json
{
  "error": "Bearer token required"
}
```

Что проверяем:

Middleware требует формат:

```http
Authorization: Bearer token
```

### 10.5. Проверяем `/users/me` с неправильным токеном

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer wrong-token"
```

Ожидаемый статус:

```http
401 Unauthorized
```

Ожидаемый ответ:

```json
{
  "error": "Invalid or expired token"
}
```

Что проверяем:

Middleware не должен пропускать повреждённый или поддельный JWT.

### 10.6. Проверяем `/users/me` с правильным токеном

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer jwt-token"
```

Вместо `jwt-token` вставьте токен из login.

Ожидаемый ответ:

```json
{
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  }
}
```

Что проверяем:

1. Middleware достал `userId` из JWT.
2. Middleware нашёл пользователя в базе.
3. Middleware записал `req.currentUser`.
4. Controller вернул `req.currentUser`.
5. В ответе нет `password`.

## Частые ошибки

### Ошибка: `Property 'currentUser' does not exist on type Request`

Причина: TypeScript не увидел расширение `Express.Request`.

Проверьте:

1. Есть файл `src/types/express.ts`.
2. В `src/app.ts` есть импорт `import "./types/express";`.
3. Импорт стоит до использования routers.
4. Вы перезапустили dev-сервер после добавления файла.

### Ошибка: `Failed query: select ... from "users"`

Причина: миграции не применены, таблицы `users` нет в базе.

Решение:

```bash
docker compose exec app npm run db:migrate:container
```

### Ошибка: `Min legth is 8 symbols`

Причина: пароль слишком короткий.

Решение: используйте пароль минимум 8 символов:

```json
{
  "email": "student@example.com",
  "password": "12345678"
}
```

### Ошибка: `User already exists`

Причина: пользователь с таким email уже зарегистрирован.

Решение: используйте другой email:

```json
{
  "email": "student2@example.com",
  "password": "12345678"
}
```

### Ошибка: `Invalid or expired token`

Возможные причины:

1. Токен скопирован не полностью.
2. В заголовке нет слова `Bearer`.
3. Токен истёк.
4. Сервер перезапущен с другим `JWT_SECRET`.
5. Токен был создан в другом проекте.

## Контрольные вопросы

1. Зачем нужен Current User Middleware?
2. Почему controller не должен сам проверять JWT?
3. Почему middleware должен вызывать `next()`?
4. Что произойдёт, если middleware вернёт `401` и не вызовет `next()`?
5. Почему `currentUser` в типе `Request` сделан необязательным?
6. Почему нельзя класть `password` в `req.currentUser`?
7. Чем отличается `401 Unauthorized` от `403 Forbidden`?
8. Почему используется формат `Authorization: Bearer token`?
9. Зачем middleware ищет пользователя в базе, если `userId` уже есть в токене?
10. Что произойдёт, если пользователь удалён из базы, но у клиента остался старый токен?
11. Почему `createCurrentUserMiddleware` принимает `repo` параметром?
12. Что такое dependency injection в контексте этой лабораторной?

## Самостоятельное задание

Добавьте endpoint:

```http
GET /users/profile
```

Он должен работать только с `createCurrentUserMiddleware` и возвращать:

```json
{
  "message": "Profile page",
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  }
}
```

Подсказка:

1. Добавьте метод `profile` в `UserController`.
2. В методе используйте `req.currentUser`.
3. Добавьте route `GET /profile` в `user.router.ts`.
4. Перед controller подключите `createCurrentUserMiddleware(repo)`.

Пример route:

```ts
router.get(
  "/profile",
  createCurrentUserMiddleware(repo),
  controller.profile,
);
```

## Решение самостоятельного задания

Ниже готовое решение для endpoint:

```http
GET /users/profile
```

Этот endpoint будет использовать тот же `createCurrentUserMiddleware`, что и `/users/me`.

### Шаг 1. Добавляем метод `profile` в controller

Откройте файл:

```text
src/modules/users/user.controller.ts
```

Внутри класса `UserController` добавьте метод:

```ts
profile = async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({
    message: "Profile page",
    user: req.currentUser,
  });
};
```

Полный фрагмент с двумя protected controller-методами:

```ts
currentUser = async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({ user: req.currentUser });
};

profile = async (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(200).json({
    message: "Profile page",
    user: req.currentUser,
  });
};
```

Разбор:

1. `profile` использует `req.currentUser`, который подготовил middleware.
2. Если `req.currentUser` нет, возвращаем `401`.
3. Если пользователь есть, возвращаем сообщение и данные пользователя.
4. Пароль в ответ не попадёт, потому что middleware положил в `req.currentUser` результат `toUserResponse(user)`.

### Шаг 2. Добавляем route `GET /profile`

Откройте файл:

```text
src/modules/users/user.router.ts
```

Добавьте route:

```ts
router.get(
  "/profile",
  createCurrentUserMiddleware(repo),
  controller.profile,
);
```

Полная функция `createUserRouter`:

```ts
export function createUserRouter(
  controller: UserController,
  repo: UserRepository,
): Router {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/me", createCurrentUserMiddleware(repo), controller.currentUser);
  router.get(
    "/profile",
    createCurrentUserMiddleware(repo),
    controller.profile,
  );

  return router;
}
```

Почему endpoint будет называться `/users/profile`:

В `src/app.ts` user router подключён так:

```ts
app.use("/users", buildUserRouter());
```

Поэтому route:

```ts
router.get("/profile", ...)
```

становится полным URL:

```http
GET /users/profile
```

### Шаг 3. Проверяем TypeScript

Запустите:

```bash
npm run build
```

Ожидаемый результат: команда завершается без ошибок.

Если TypeScript ругается на `controller.profile`, проверьте, что метод `profile` добавлен внутрь класса `UserController`, а не за его пределами.

### Шаг 4. Проверяем endpoint без токена

```bash
curl http://localhost:3000/users/profile
```

Ожидаемый ответ:

```json
{
  "error": "Authorization header required"
}
```

Это значит, что middleware подключён и не пропускает неавторизованный запрос.

### Шаг 5. Проверяем endpoint с правильным токеном

Сначала выполните login:

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"12345678"}'
```

Скопируйте `token` из ответа.

Теперь отправьте запрос:

```bash
curl http://localhost:3000/users/profile \
  -H "Authorization: Bearer jwt-token"
```

Вместо `jwt-token` вставьте настоящий токен из login.

Ожидаемый ответ:

```json
{
  "message": "Profile page",
  "user": {
    "id": "user-id",
    "email": "student@example.com",
    "createdAt": "2026-05-20T08:00:00.000Z"
  }
}
```

Если вы получили такой ответ, самостоятельное задание выполнено.

## Критерии готовности

Лабораторная работа выполнена, если:

1. `npm run build` проходит без ошибок.
2. `docker compose up --build` запускает app и db.
3. Миграции применены без ошибок.
4. `POST /users/register` создаёт пользователя.
5. `POST /users/login` возвращает JWT.
6. `GET /users/me` без токена возвращает `401`.
7. `GET /users/me` с неправильным форматом токена возвращает `401`.
8. `GET /users/me` с неправильным токеном возвращает `401`.
9. `GET /users/me` с правильным токеном возвращает текущего пользователя.
10. В ответе `/users/me` нет поля `password`.
11. `register` и `login` продолжают работать без авторизации.

## Итог

В этой лабораторной работе мы добавили полноценный middleware для определения текущего пользователя.

Теперь приложение умеет не только выдавать JWT при login, но и использовать этот JWT для защищённых endpoints.

Главный результат:

```ts
req.currentUser = toUserResponse(user);
```

После этой строки любой следующий controller в цепочке может работать с текущим пользователем без повторной проверки токена.
