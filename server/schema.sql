-- ============================================================
-- WMS Pro — Esquema de base de datos PostgreSQL
-- ============================================================

-- Usuarios del sistema
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120)        NOT NULL,
    email       VARCHAR(180) UNIQUE NOT NULL,
    password    TEXT                NOT NULL,
    role        VARCHAR(30)         NOT NULL DEFAULT 'cajero',
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Productos / Inventario
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200)        NOT NULL,
    category    VARCHAR(80)         NOT NULL,
    cost_price  NUMERIC(10,2)       NOT NULL DEFAULT 0,
    sale_price  NUMERIC(10,2)       NOT NULL DEFAULT 0,
    stock       INTEGER             NOT NULL DEFAULT 0,
    min_stock   INTEGER             NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(200)        NOT NULL,
    contact     VARCHAR(150)        NOT NULL,
    phone       VARCHAR(50),
    email       VARCHAR(180),
    category    VARCHAR(80),
    address     TEXT,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Sesiones de caja
CREATE TABLE IF NOT EXISTS cash_sessions (
    id              SERIAL PRIMARY KEY,
    opening_amount  NUMERIC(10,2)   NOT NULL,
    closing_amount  NUMERIC(10,2),
    opened_by       INTEGER REFERENCES users(id),
    closed_by       INTEGER REFERENCES users(id),
    opened_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    closed_at       TIMESTAMPTZ
);

-- Encabezado de ventas
CREATE TABLE IF NOT EXISTS sales (
    id          SERIAL PRIMARY KEY,
    total       NUMERIC(10,2)   NOT NULL DEFAULT 0,
    created_by  INTEGER REFERENCES users(id),
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Líneas de venta
CREATE TABLE IF NOT EXISTS sale_items (
    id          SERIAL PRIMARY KEY,
    sale_id     INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    qty         INTEGER NOT NULL,
    unit_price  NUMERIC(10,2) NOT NULL
);

-- Usuario administrador 
INSERT INTO users (name, email, password, role)
VALUES (
    'Administrador',
    'admin@wms.com',
    '$2b$10$hOtsQbgSkG59PexqBzjm4Ow8D91UAWqKgafwDoeMv/P1.NO2hxkX.',
    'admin'
) ON CONFLICT (email) DO NOTHING;
