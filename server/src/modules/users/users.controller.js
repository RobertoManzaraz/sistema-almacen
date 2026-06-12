import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";

export const getUsers = async (req, res) => {
    const result = await pool.query(
        "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
};

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ message: "Todos los campos son requeridos" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
        [name, email, hashed, role]
    );
    res.status(201).json(result.rows[0]);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const result = await pool.query(
        "UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING id, name, email, role",
        [name, email, role, id]
    );
    if (!result.rows.length)
        return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result.rows[0]);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length)
        return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
};
