import { UserRepository } from "./user.entity";
import { LoginDto, RegisterDto } from "./user.request.dto";
import { LoginResponseDto, UserResponseDto } from "./user.response.dto";
export default class UserService {
    private readonly repo;
    constructor(repo: UserRepository);
    register(dto: RegisterDto): Promise<UserResponseDto>;
    login(dto: LoginDto): Promise<LoginResponseDto>;
}
//# sourceMappingURL=user.service.d.ts.map