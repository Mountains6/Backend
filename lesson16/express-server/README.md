# Передача токена

### Вариант 1 - через headers - Authorization
Req -> {email, password}
Res -> {token}  отдавали вместе с телом ответа
Полученный токен сохраняли в localStorage или in memory(в переменную)

Req -> "/me" (получение данных user) -> headers: {"Authorization": "Bearer 35lsdjfk"}
Res -> {email, id} (данные пользователя)

### Вариант 2 - через cookie
Req -> {email, password} 
Res -> headers: {Set-Cookie: "Bearer 35lsdjfk"}
Установили cookie access_token

Req -> "/me" (получение данных user) -> Cookie
Res -> {email, id} (данные пользователя)

# QA
По уровням тестирования:
unit test - проверяем работу отдельной функции или компонента
integration - проверка взаимодействия элементов/частей програмы
end to end - проверка конечного продукта

Test - проверка на соответствие ожидаемого результата (expected) и 
       действительного результата (actual)

По цели тестирования
smoke testing -  проверка основного функционала
regression testing - не сломался старый функционал после добавления нового
positive test - проверка работы программы при корректных данных
negative test - проверка работы программы при некорректных данных
black box - без доступа к коду
grey box - частичный доступ к коду
white box - полный доступ к коду

https://jestjs.io/
