export const fmt = (n) => `$${Number(n).toFixed(2)}`;
export const genId = (p) => `${p}${Date.now().toString().slice(-6)}`;
export const today = () => new Date().toISOString().slice(0, 10);
export const isLow = (p) => p.stock <= p.minStock;
export const CATS = ["Electrónica", "Periféricos", "Monitores", "Audio", "Cables", "Accesorios", "Otro"];
