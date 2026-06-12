import { Router } from "express";
import { getCashSessions, openCash, closeCash } from "./cash.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getCashSessions);
router.post("/open", authMiddleware, roleMiddleware(["admin", "cajero"]), openCash);
router.put("/close/:id", authMiddleware, roleMiddleware(["admin", "cajero"]), closeCash);

export default router;
