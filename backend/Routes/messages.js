const {Router} = require("express");
const messageRouter = Router(); 
const messageController = require("../controllers/messageController");
const { authenticateToken, requireMembership, requireAdmin } = require("../middleware/auth");

messageRouter.post("/", authenticateToken, messageController.createMessage);
messageRouter.get("/", authenticateToken, messageController.getMessages);
messageRouter.delete("/:id", authenticateToken, requireAdmin, messageController.deleteMessage);

module.exports = messageRouter;