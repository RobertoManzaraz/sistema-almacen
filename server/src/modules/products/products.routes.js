import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "./products.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);
router.post("/", authMiddleware, roleMiddleware(["admin", "encargado"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "encargado"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

export default router;
