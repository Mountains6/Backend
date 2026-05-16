export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserRepository {
  findAll(): Promise<User[]>;
  create(
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ): Promise<User>;
}
