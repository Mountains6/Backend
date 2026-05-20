"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleUserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
class DrizzleUserRepository {
    async findByEmail(email) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user ?? null;
    }
    async findById(id) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user ?? null;
    }
    async create(email, password) {
        const [user] = await db_1.db
            .insert(schema_1.users)
            .values({ email, password })
            .returning();
        return user;
    }
}
exports.DrizzleUserRepository = DrizzleUserRepository;
//# sourceMappingURL=user.repository.js.map