"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = exports.UserAlreadyExistsError = void 0;
class UserAlreadyExistsError extends Error {
    constructor() {
        super("User already exists");
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class InvalidCredentialsError extends Error {
    constructor() {
        super("Invalid credentials");
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
//# sourceMappingURL=errors.js.map