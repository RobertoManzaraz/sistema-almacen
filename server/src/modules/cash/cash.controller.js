import { pool } from "../../config/db.js";

export const getCashSessions = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM cash_sessions ORDER BY opened_at DESC"
    );
    res.json(result.rows);
};

export const openCash = async (req, res) => {
    const { opening_amount } = req.body;
    if (opening_amount == null)
        return res.status(400).json({ message: "El monto de apertura es requerido" });

    const open = await pool.query(
        "SELECT id FROM cash_sessions WHERE closed_at IS NULL"
    );
    if (open.rows.length)
        return res.status(400).json({ message: "Ya existe una caja abierta" });

    const result = await pool.query(
        "INSERT INTO cash_sessions (opening_amount, opened_by) VALUES ($1, $2) RETURNING *",
        [opening_amount, req.user.id]
    );
    res.status(201).json(result.rows[0]);
};

export const closeCash = async (req, res) => {
    const { id } = req.params;
    const { closing_amount } = req.body;
    if (closing_amount == null)
        return res.status(400).json({ message: "El monto de cierre es requerido" });

    const result = await pool.query(
        "UPDATE cash_sessions SET closing_amount=$1, closed_at=NOW(), closed_by=$2 WHERE id=$3 AND closed_at IS NULL RETURNING *",
        [closing_amount, req.user.id, id]
    );
    if (!result.rows.length)
        return res.status(404).json({ message: "Sesión no encontrada o ya cerrada" });
    res.json(result.rows[0]);
};
