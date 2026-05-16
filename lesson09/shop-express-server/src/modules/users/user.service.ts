import { User, UserRepository, UserRole } from "./user.entity";

export class UserService {
  constructor(private readonly repo: UserRepository) {
    this.repo = repo;
  }

  getAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  create(name: string, email: string, password: string, role: UserRole) {
    if (!name) {
      throw new Error("Name is required");
    } else if (!email) {
      throw new Error("Email is required");
    } else if (!password) {
      throw new Error("Email is required");
    } else if (!role) {
      throw new Error("Role must be selected");
    }

    return this.repo.create(name, email, password, role);
  }
}
