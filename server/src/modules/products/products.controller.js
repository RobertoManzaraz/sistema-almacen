import { pool } from "../../config/db.js";

export const getProducts = async (req, res) => {
    const result = await pool.query("SELECT * FROM products ORDER BY name ASC");
    res.json(result.rows);
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id=$1", [id]);
    if (!result.rows.length)
        return res.status(404).json({ message: "Producto no encontrado" });
    res.json(result.rows[0]);
};

export const createProduct = async (req, res) => {
    const { name, category, cost_price, sale_price, stock, min_stock } = req.body;
    if (!name || !category || cost_price == null || sale_price == null || stock == null || min_stock == null)
        return res.status(400).json({ message: "Todos los campos son requeridos" });

    const result = await pool.query(
        "INSERT INTO products (name, category, cost_price, sale_price, stock, min_stock) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [name, category, cost_price, sale_price, stock, min_stock]
    );
    res.status(201).json(result.rows[0]);
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, cost_price, sale_price, stock, min_stock } = req.body;
    const result = await pool.query(
        "UPDATE products SET name=$1, category=$2, cost_price=$3, sale_price=$4, stock=$5, min_stock=$6 WHERE id=$7 RETURNING *",
        [name, category, cost_price, sale_price, stock, min_stock, id]
    );
    if (!result.rows.length)
        return res.status(404).json({ message: "Producto no encontrado" });
    res.json(result.rows[0]);
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length)
        return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
};
