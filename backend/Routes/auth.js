const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/join-club", authenticateToken, authController.joinClub);
authRouter.post("/become-admin", authenticateToken, authController.becomeAdmin);

module.exports = authRouter;