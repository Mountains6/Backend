"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../lib/errors");
const hash_1 = require("../../lib/hash");
const jwt_1 = require("../../lib/jwt");
const user_mapper_1 = __importDefault(require("./user.mapper"));
class UserService {
    constructor(repo) {
        this.repo = repo;
    }
    async register(dto) {
        // if (!email || !password) {
        //   throw new Error("Email and password required");
        // }
        const { email, password } = dto;
        const existing = await this.repo.findByEmail(email);
        if (existing) {
            throw new errors_1.UserAlreadyExistsError();
        }
        const hashed = await (0, hash_1.hashPassword)(password);
        const user = await this.repo.create(email, hashed);
        const response = (0, user_mapper_1.default)(user);
        return response;
    }
    async login(dto) {
        const { email, password } = dto;
        {
            const user = await this.repo.findByEmail(email);
            if (!user) {
                throw new errors_1.InvalidCredentialsError();
            }
            const valid = await (0, hash_1.comparePassword)(password, user.password);
            if (!valid) {
                throw new errors_1.InvalidCredentialsError();
            }
            const token = (0, jwt_1.signedToken)({ userId: user.id });
            const response = { user: (0, user_mapper_1.default)(user), token };
            return response;
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map