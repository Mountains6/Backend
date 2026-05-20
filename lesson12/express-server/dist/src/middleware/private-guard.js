"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateGuard = void 0;
const logger_1 = require("../lib/logger");
const privateGuard = (req, res, next) => {
    const token = req.headers.authorization;
    logger_1.logger.warn("Private Guard middleware - check");
    if (token !== "qwerty007") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
exports.privateGuard = privateGuard;
//# sourceMappingURL=private-guard.js.map