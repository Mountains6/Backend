"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLogger = void 0;
const customLogger = (req, _res, next) => {
    const method = req.method;
    const url = req.url;
    console.log(`${method} - ${url}`);
    next();
};
exports.customLogger = customLogger;
//# sourceMappingURL=custom-logger.js.map