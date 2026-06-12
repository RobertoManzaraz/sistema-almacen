import { Router } from "express";
import { getUsers, createUser, updateUser, deleteUser } from "./users.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]), getUsers);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createUser);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

export default router;
