const express = require("express");
const {
    newChat,
    messageToChat,
    allMessages,
    deleteChat,
    allChats
} = require("../controllers/chat.controller");
const router = express.Router();

router.post("/chats", newChat);
router.post("/chats/:id/messages", messageToChat);
router.get("/chats/:id/messages", allMessages);
router.delete("/chats/:id", deleteChat);
router.get("/chats", allChats);

module.exports = router;