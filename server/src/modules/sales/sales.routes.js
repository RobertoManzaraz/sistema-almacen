import { Router } from "express";
import { getSales, createSale } from "./sales.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getSales);
router.post("/", authMiddleware, createSale);

export default router;
