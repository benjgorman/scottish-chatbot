import express from "express";
import { parseMessage } from "../middleware/parseMessage.js";
import { handleMessage } from "../controllers/chatController.js";
import {handleDeterministicChat} from "../controllers/deterministicChatController.js";
import {handleThink} from "../controllers/thinkController.js";

const router = express.Router();

//legacy endpoint for backward compatibility
router.post("/legacy-chat", parseMessage, handleMessage);

//advanced route determinstic scripting engine
router.post("/chat", parseMessage, handleDeterministicChat);

//LLM fallback
router.post("/think", parseMessage, handleThink);

router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


export default router;