import { db } from "../../db";
import { users } from "../../db/schema";
import { User, UserRepository, UserRole } from "./user.entity";

export class DrizzleRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async create(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User> {
    const newUser = {
      name,
      email,
      password,
      role,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }
}
