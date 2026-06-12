export const SEED_PRODUCTS = [
    { id: "P001", name: "Laptop HP 15", category: "Electrónica", costPrice: 750, salePrice: 1200, stock: 5, minStock: 3 },
    { id: "P002", name: "Mouse Inalámbrico Logitech", category: "Periféricos", costPrice: 18, salePrice: 38, stock: 2, minStock: 5 },
    { id: "P003", name: "Teclado Mecánico RGB", category: "Periféricos", costPrice: 45, salePrice: 95, stock: 8, minStock: 4 },
    { id: "P004", name: 'Monitor Samsung 24"', category: "Monitores", costPrice: 220, salePrice: 380, stock: 1, minStock: 2 },
    { id: "P005", name: "Auriculares Sony BT", category: "Audio", costPrice: 35, salePrice: 70, stock: 15, minStock: 5 },
    { id: "P006", name: "Webcam HD 1080p", category: "Periféricos", costPrice: 28, salePrice: 60, stock: 3, minStock: 4 },
    { id: "P007", name: "Cable HDMI 2m", category: "Cables", costPrice: 5, salePrice: 15, stock: 30, minStock: 10 },
    { id: "P008", name: "Hub USB 4 puertos", category: "Accesorios", costPrice: 12, salePrice: 28, stock: 0, minStock: 3 },
];

export const SEED_SUPPLIERS = [
    { id: "S001", name: "TechDistrib S.A.", contact: "Juan Pérez", phone: "555-1234", email: "juan@techdistrib.com", category: "Electrónica", address: "Av. Tecnología 123" },
    { id: "S002", name: "PeriphWorld", contact: "María García", phone: "555-5678", email: "maria@periphworld.com", category: "Periféricos", address: "Calle Principal 456" },
    { id: "S003", name: "AudioMax Distribuidora", contact: "Carlos López", phone: "555-9012", email: "carlos@audiomax.com", category: "Audio", address: "Plaza Central 789" },
];

export const SEED_SALES = [
    { id: "V001", date: new Date(Date.now() - 86400000 * 2).toISOString(), items: [{ productId: "P001", name: "Laptop HP 15", qty: 1, price: 1200 }], total: 1200 },
    { id: "V002", date: new Date(Date.now() - 3600000 * 5).toISOString(), items: [{ productId: "P005", name: "Auriculares Sony BT", qty: 2, price: 70 }, { productId: "P007", name: "Cable HDMI 2m", qty: 3, price: 15 }], total: 185 },
    { id: "V003", date: new Date(Date.now() - 1800000).toISOString(), items: [{ productId: "P003", name: "Teclado Mecánico RGB", qty: 1, price: 95 }], total: 95 },
];
