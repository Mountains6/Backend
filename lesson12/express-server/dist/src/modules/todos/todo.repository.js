"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleRepository = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
class DrizzleRepository {
    async findAll() {
        return await db_1.db.select().from(schema_1.todos);
    }
    async create(title) {
        const newTodo = {
            title,
            done: false,
        };
        const [todo] = await db_1.db.insert(schema_1.todos).values(newTodo).returning();
        return todo;
    }
}
exports.DrizzleRepository = DrizzleRepository;
//# sourceMappingURL=todo.repository.js.map