"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = require("express");
const current_user_middleware_1 = require("../../middleware/current-user.middleware");
function createUserRouter(controller, repo) {
    const router = (0, express_1.Router)();
    router.post("/register", controller.register);
    router.post("/login", controller.login);
    router.get("/me", (0, current_user_middleware_1.createCurrentUserMiddleware)(repo), controller.currentUser);
    return router;
}
//# sourceMappingURL=user.router.js.map