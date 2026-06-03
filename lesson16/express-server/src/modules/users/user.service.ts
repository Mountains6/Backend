import { comparePassword, hashPassword } from "../../lib/hash";
import { signedToken } from "../../lib/jwt";
import { UserRepository } from "./user.entity";
import toUserResponse from "./user.mapper";
import { LoginDto, RegisterDto } from "./user.request.dto";
import { LoginResponseDto, UserResponseDto } from "./user.response.dto";

export default class UserService {
  constructor(private readonly repo: UserRepository) {}

  async register(dto: RegisterDto) {
    // if (!email || !password) {
    //   throw new Error("Email and password required");
    // }
    const { email, password } = dto;
    const existing = await this.repo.findByEmail(email);

    if (existing) {
      throw new Error("User already exists");
    }

    const hashed = await hashPassword(password);

    const user = await this.repo.create(email, hashed);

    const response: UserResponseDto = toUserResponse(user);
    return response;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = signedToken({ userId: user.id });

    const response: LoginResponseDto = {user: toUserResponse(user), token}
    return response;
  }
}
