import { User, UserRepository } from "./user.entity";
export declare class DrizzleUserRepository implements UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(email: string, password: string): Promise<User>;
}
//# sourceMappingURL=user.repository.d.ts.map