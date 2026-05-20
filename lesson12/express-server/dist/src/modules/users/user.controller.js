"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_request_dto_1 = require("./user.request.dto");
class UserController {
    constructor(service) {
        this.service = service;
        this.register = async (req, res, next) => {
            try {
                const data = user_request_dto_1.registerDto.parse(req.body);
                const result = await this.service.register(data);
                res.status(201).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const data = user_request_dto_1.loginDto.parse(req.body);
                const result = await this.service.login(data);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.currentUser = async (req, res) => {
            if (!req.currentUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            res.status(200).json({ user: req.currentUser });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map