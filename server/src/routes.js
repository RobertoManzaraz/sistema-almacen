import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import productRoutes from "./modules/products/products.routes.js";
import salesRoutes from "./modules/sales/sales.routes.js";
import cashRoutes from "./modules/cash/cash.routes.js";
import supplierRoutes from "./modules/suppliers/suppliers.routes.js";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/sales", salesRoutes);
router.use("/cash", cashRoutes);
router.use("/suppliers", supplierRoutes);
