# Clean Architecture
layer - слои
responsibility - у каждого своя зона ответственности

- domain - entity - с чем мы работаем? С какой сущностью (типы и схемы)

- repository - persistent layer - только хранение - чтение, запись в БД

- service - business logic - if else

- controller - обработка информации

router -> controller -> service -> repository 