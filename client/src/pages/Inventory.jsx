import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Inp, Sel } from "../components/ui/Forms";
import { fmt, genId, isLow, CATS } from "../utils/helpers";
import { api } from "../utils/api";

const emptyProd = { id: "", name: "", category: "", costPrice: "", salePrice: "", stock: "", minStock: "" };

const Inventory = ({ products, refresh, toast }) => {
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyProd);
    const [delId, setDelId] = useState(null);

    const filtered = useMemo(() =>
        products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        ), [products, search]);

    const openAdd = () => { setForm({ ...emptyProd, id: genId("P") }); setModal("add"); };
    const openEdit = (p) => { setForm({ ...p }); setModal("edit"); };
    const f = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const save = async () => {
        const { id, name, category, costPrice, salePrice, stock, minStock } = form;
        if (!name || !category || costPrice === "" || salePrice === "" || stock === "" || minStock === "")
            return toast("Completa todos los campos", "error");

        const prodData = {
            name,
            category,
            cost_price: +costPrice,
            sale_price: +salePrice,
            stock: +stock,
            min_stock: +minStock
        };

        try {
            if (modal === "add") {
                await api.post("/products", prodData);
                toast("Producto agregado correctamente", "success");
            } else {
                await api.put(`/products/${id}`, prodData);
                toast("Producto actualizado", "success");
            }
            refresh();
            setModal(null);
        } catch (err) {
            toast("Error al guardar el producto", "error");
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            refresh();
            setDelId(null);
            toast("Producto eliminado", "success");
        } catch (err) {
            toast("Error al eliminar el producto", "error");
        }
    };

    const exportCSV = () => {
        const csv = "ID,Nombre,Categoría,Precio Costo,Precio Venta,Stock,Stock Mínimo\n" +
            products.map((p) => `${p.id},"${p.name}",${p.category},${p.costPrice},${p.salePrice},${p.stock},${p.minStock}`).join("\n");
        const a = Object.assign(document.createElement("a"), {
            href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
            download: "inventario.csv",
        });
        a.click();
        toast("Inventario exportado como inventario.csv", "success");
    };    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Inventario</h2>
                    <p className="text-zinc-500 text-xs font-semibold mt-0.5">{products.length} productos · {products.filter(isLow).length} alertas</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-900/50 transition-colors shadow-sm">
                        <Icon n="download" cls="w-4 h-4 text-zinc-500" />Exportar CSV
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm premium-glow-red">
                        <Icon n="plus" cls="w-4 h-4 text-red-200" />Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="relative mb-4">
                <Icon n="search" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, ID o categoría..."
                    className="w-full pl-11 pr-4 py-2.5 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 placeholder-zinc-600 transition-all font-medium" />
            </div>

            <div className="bg-zinc-900 rounded-xl shadow-md border border-zinc-850/80 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-950/30">
                            {["ID", "Producto", "Categoría", "P. Costo", "P. Venta", "Stock", "Mín.", "Acciones"].map((h) => (
                                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-zinc-450 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-16 text-zinc-500 font-semibold">No se encontraron productos</td></tr>
                        )}
                        {filtered.map((p) => (
                            <tr key={p.id} className={`hover:bg-zinc-950/20 transition-colors ${isLow(p) ? "bg-red-950/10 hover:bg-red-950/15" : ""}`}>
                                <td className="px-5 py-3.5 font-mono text-xs text-zinc-500">{p.id}</td>
                                <td className="px-5 py-3.5">
                                    <span className="font-semibold text-zinc-200">{p.name}</span>
                                    {isLow(p) && <span className="ml-2"><Badge color={p.stock === 0 ? "red" : "orange"}>{p.stock === 0 ? "Agotado" : "Bajo"}</Badge></span>}
                                </td>
                                <td className="px-5 py-3.5"><Badge color="indigo">{p.category}</Badge></td>
                                <td className="px-5 py-3.5 text-right text-zinc-450 font-medium">{fmt(p.costPrice)}</td>
                                <td className="px-5 py-3.5 text-right font-bold text-zinc-200">{fmt(p.salePrice)}</td>
                                <td className="px-5 py-3.5 text-center">
                                    <span className={`inline-block font-bold px-2.5 py-0.5 rounded-lg text-xs ${p.stock === 0 ? "bg-red-950/30 text-red-400 border border-red-900/20" : isLow(p) ? "bg-amber-950/30 text-amber-400 border border-amber-900/20" : "bg-emerald-950/30 text-emerald-450 border border-emerald-900/20"}`}>{p.stock}</span>
                                </td>
                                <td className="px-5 py-3.5 text-center text-zinc-400 font-semibold">{p.minStock}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center justify-center gap-1">
                                        <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-450 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"><Icon n="edit" cls="w-4 h-4" /></button>
                                        <button onClick={() => setDelId(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-450 hover:text-red-300 hover:bg-red-950/30 transition-colors"><Icon n="trash" cls="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <Modal title={modal === "add" ? "➕ Nuevo Producto" : "✏️ Editar Producto"} onClose={() => setModal(null)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div><Inp label="ID del Producto" value={form.id} disabled /></div>
                        <Sel label="Categoría" value={form.category} onChange={(e) => f("category", e.target.value)}>
                            <option value="">Seleccionar...</option>
                            {CATS.map((c) => <option key={c}>{c}</option>)}
                        </Sel>
                        <div className="col-span-2"><Inp label="Nombre del Producto" value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="Ej: Laptop HP 15" /></div>
                        <Inp label="Precio Costo ($)" type="number" value={form.costPrice} onChange={(e) => f("costPrice", e.target.value)} min="0" />
                        <Inp label="Precio Venta ($)" type="number" value={form.salePrice} onChange={(e) => f("salePrice", e.target.value)} min="0" />
                        <Inp label="Stock Actual" type="number" value={form.stock} onChange={(e) => f("stock", e.target.value)} min="0" />
                        <Inp label="Stock Mínimo" type="number" value={form.minStock} onChange={(e) => f("minStock", e.target.value)} min="0" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-850">
                        <button onClick={() => setModal(null)} className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors">Cancelar</button>
                        <button onClick={save} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 premium-glow-red transition-colors">Guardar Producto</button>
                    </div>
                </Modal>
            )}
            {delId && (
                <Modal title="Confirmar Eliminación" onClose={() => setDelId(null)}>
                    <p className="text-zinc-400 text-sm mb-6">¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDelId(null)} className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors">Cancelar</button>
                        <button onClick={() => remove(delId)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 premium-glow-red transition-colors">Sí, eliminar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Inventory;
