import { pool } from "../../config/db.js";

export const getSales = async (req, res) => {
    const result = await pool.query(
        `SELECT s.*,
            json_agg(
                json_build_object(
                    'product_id', si.product_id,
                    'name', p.name,
                    'qty', si.qty,
                    'unit_price', si.unit_price,
                    'subtotal', si.qty * si.unit_price
                )
            ) AS items
        FROM sales s
        JOIN sale_items si ON si.sale_id = s.id
        JOIN products p ON p.id = si.product_id
        GROUP BY s.id
        ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
};

export const createSale = async (req, res) => {
    const { items } = req.body; // [{ product_id, qty, unit_price }]
    if (!items || !items.length)
        return res.status(400).json({ message: "La venta debe tener al menos un producto" });

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const total = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
        const saleResult = await client.query(
            "INSERT INTO sales (total, created_by) VALUES ($1, $2) RETURNING *",
            [total, req.user.id]
        );
        const sale = saleResult.rows[0];
        for (const item of items) {
            await client.query(
                "INSERT INTO sale_items (sale_id, product_id, qty, unit_price) VALUES ($1,$2,$3,$4)",
                [sale.id, item.product_id, item.qty, item.unit_price]
            );
            await client.query(
                "UPDATE products SET stock = stock - $1 WHERE id = $2",
                [item.qty, item.product_id]
            );
        }
        await client.query("COMMIT");
        res.status(201).json({ ...sale, items });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ message: "Error al procesar la venta" });
    } finally {
        client.release();
    }
};
