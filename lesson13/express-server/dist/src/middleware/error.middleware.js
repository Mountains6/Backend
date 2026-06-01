"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_1 = require("../lib/errors");
const zod_1 = __importStar(require("zod"));
function errorHandler(error, _req, res, _next) {
    // Domain Errors
    if (error instanceof errors_1.UserAlreadyExistsError) {
        return res.status(400).json({ error: error.message });
    }
    if (error instanceof errors_1.InvalidCredentialsError) {
        return res.status(400).json({ error: error.message });
    }
    // Zod errors (validations)
    if (error instanceof zod_1.ZodError) {
        return res
            .status(400)
            .json({ error: "Validation error", details: zod_1.default.treeifyError(error) });
    }
    // DB errors
    // fallback
    return res.status(500).json({ error: "Internal Server Error" });
}
//# sourceMappingURL=error.middleware.js.map