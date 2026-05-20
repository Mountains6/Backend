"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCurrentUserMiddleware = void 0;
const jwt_1 = require("../lib/jwt");
const user_mapper_1 = __importDefault(require("../modules/users/user.mapper"));
const createCurrentUserMiddleware = (repo) => async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Bearer token required" });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        const userId = typeof payload === "string"
            ? undefined
            : payload.userId;
        if (typeof userId !== "string") {
            return res.status(401).json({ error: "Invalid token payload" });
        }
        const user = await repo.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "User from token not found" });
        }
        req.currentUser = (0, user_mapper_1.default)(user);
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.createCurrentUserMiddleware = createCurrentUserMiddleware;
//# sourceMappingURL=current-user.middleware.js.map