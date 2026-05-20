"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserRouter = buildUserRouter;
const user_repository_1 = require("./user.repository");
const user_service_1 = __importDefault(require("./user.service"));
const user_controller_1 = require("./user.controller");
const user_router_1 = require("./user.router");
function buildUserRouter() {
    const repo = new user_repository_1.DrizzleUserRepository();
    const service = new user_service_1.default(repo);
    const controller = new user_controller_1.UserController(service);
    return (0, user_router_1.createUserRouter)(controller, repo);
}
//# sourceMappingURL=user.container.js.map