# Самостоятельная работа
- Создайте просто сервер на express + ts, в котором будет две сущности users и products (shop-express-server)
- Напишите необходимые routes для каждой сущности
- Создайте коллекции в Postman для проверки работы сервера
- Сущности имеют следующие поля

## Users
  - id
  - name        
  - email        
  - password    
  - role       // "user" | "admin"
  - createdAt
         
## Products
  - id
  - title
  - description
  - price
  - stock
  - category  // придумайте ограниченное количество возможных категорий
  - createdAt