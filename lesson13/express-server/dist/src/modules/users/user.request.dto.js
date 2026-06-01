"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDto = exports.registerDto = void 0;
const zod_1 = require("zod");
exports.registerDto = zod_1.z.object({
    email: zod_1.z.email("Email is not valid"),
    password: zod_1.z.string().trim().min(8, "Min length is 8 symbols"),
});
exports.loginDto = zod_1.z.object({
    email: zod_1.z.email("Email is not valid"),
    password: zod_1.z.string().trim().min(8, "Min length is 8 symbols"),
});
//# sourceMappingURL=user.request.dto.js.map