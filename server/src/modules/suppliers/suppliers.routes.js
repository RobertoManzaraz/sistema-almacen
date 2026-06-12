import { Router } from "express";
import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "./suppliers.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getSuppliers);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createSupplier);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateSupplier);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteSupplier);

export default router;
