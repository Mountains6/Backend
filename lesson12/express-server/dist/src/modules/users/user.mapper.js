"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = toUserResponse;
function toUserResponse(user) {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
}
//# sourceMappingURL=user.mapper.js.map