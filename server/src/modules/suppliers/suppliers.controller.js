import { pool } from "../../config/db.js";

export const getSuppliers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM suppliers ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al obtener proveedores" });
    }
};

export const createSupplier = async (req, res) => {
    const { name, contact, phone, email, category, address } = req.body;
    if (!name || !contact)
        return res.status(400).json({ message: "Nombre y contacto son requeridos" });

    try {
        const result = await pool.query(
            "INSERT INTO suppliers (name, contact, phone, email, category, address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
            [name, contact, phone, email, category, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al crear proveedor" });
    }
};

export const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, contact, phone, email, category, address } = req.body;

    try {
        const result = await pool.query(
            "UPDATE suppliers SET name=$1, contact=$2, phone=$3, email=$4, category=$5, address=$6 WHERE id=$7 RETURNING *",
            [name, contact, phone, email, category, address, id]
        );
        if (!result.rows.length)
            return res.status(404).json({ message: "Proveedor no encontrado" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al actualizar proveedor" });
    }
};

export const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM suppliers WHERE id=$1 RETURNING id", [id]);
        if (!result.rows.length)
            return res.status(404).json({ message: "Proveedor no encontrado" });
        res.json({ message: "Proveedor eliminado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al eliminar proveedor" });
    }
};
