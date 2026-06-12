import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    if (!user.rows.length)
        return res.status(400).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(
        password,
        user.rows[0].password
    );

    if (!valid)
        return res.status(400).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
        { id: user.rows[0].id, role: user.rows[0].role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({ token });
};
