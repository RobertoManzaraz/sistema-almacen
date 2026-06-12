import { useState } from "react";
import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Inp } from "../components/ui/Forms";
import { api } from "../utils/api";

const emptySup = { id: "", name: "", contact: "", phone: "", email: "", category: "", address: "" };

const Suppliers = ({ suppliers, refresh, toast }) => {
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptySup);
    const [delId, setDelId] = useState(null);
    const [search, setSearch] = useState("");

    const filtered = suppliers.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.contact.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setForm({ ...emptySup }); setModal("add"); };
    const openEdit = (s) => { setForm({ ...s }); setModal("edit"); };
    const f = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const save = async () => {
        if (!form.name || !form.contact) return toast("Nombre y contacto son obligatorios", "error");

        try {
            if (modal === "add") {
                await api.post("/suppliers", form);
                toast("Proveedor agregado", "success");
            } else {
                await api.put(`/suppliers/${form.id}`, form);
                toast("Proveedor actualizado", "success");
            }
            refresh();
            setModal(null);
        } catch (err) {
            toast("Error al guardar proveedor", "error");
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`/suppliers/${id}`);
            refresh();
            setDelId(null);
            toast("Proveedor eliminado", "success");
        } catch (err) {
            toast("Error al eliminar proveedor", "error");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Proveedores</h2>
                    <p className="text-zinc-500 text-xs font-semibold mt-0.5">{suppliers.length} proveedores registrados</p>
                </div>
                <button 
                    onClick={openAdd} 
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-sm premium-glow-red"
                >
                    <Icon n="plus" cls="w-4 h-4 text-red-200" />Nuevo Proveedor
                </button>
            </div>

            <div className="relative mb-6">
                <Icon n="search" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Buscar proveedor por nombre o contacto..."
                    className="w-full pl-11 pr-4 py-3 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 placeholder-zinc-600 transition-all font-medium" 
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.length === 0 && (
                    <p className="col-span-3 text-center py-16 text-zinc-550 font-semibold">No se encontraron proveedores</p>
                )}
                {filtered.map((s) => (
                    <div 
                        key={s.id} 
                        className="bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-zinc-150 text-base leading-snug">{s.name}</h3>
                                    {s.category && <Badge color="indigo">{s.category}</Badge>}
                                </div>
                                <div className="flex gap-1.5">
                                    <button 
                                        onClick={() => openEdit(s)} 
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                                    >
                                        <Icon n="edit" cls="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setDelId(s.id)} 
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-950/20 hover:text-red-350 transition-colors"
                                    >
                                        <Icon n="trash" cls="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs text-zinc-450 border-t border-zinc-850/60 pt-3">
                                <p className="flex items-center gap-2">
                                    <span className="font-bold text-zinc-550 uppercase tracking-wider w-16">Contacto:</span>
                                    <span className="text-zinc-200 font-semibold">{s.contact}</span>
                                </p>
                                {s.phone && (
                                    <p className="flex items-center gap-2">
                                        <span className="font-bold text-zinc-550 uppercase tracking-wider w-16">Tel:</span>
                                        <span className="text-zinc-300 font-semibold">{s.phone}</span>
                                    </p>
                                )}
                                {s.email && (
                                    <p className="flex items-center gap-2">
                                        <span className="font-bold text-zinc-550 uppercase tracking-wider w-16">Email:</span>
                                        <span className="text-zinc-350 font-semibold">{s.email}</span>
                                    </p>
                                )}
                                {s.address && (
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-zinc-550 uppercase tracking-wider w-16 shrink-0 pt-0.5">Dir:</span>
                                        <span className="text-zinc-350 font-semibold leading-relaxed">{s.address}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === "add" ? "➕ Nuevo Proveedor" : "✏️ Editar Proveedor"} onClose={() => setModal(null)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Inp label="Empresa / Nombre" value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="Nombre del proveedor" />
                        </div>
                        <Inp label="Persona de Contacto" value={form.contact} onChange={(e) => f("contact", e.target.value)} placeholder="Nombre del contacto" />
                        <Inp label="Categoría" value={form.category} onChange={(e) => f("category", e.target.value)} placeholder="Ej: Electrónica" />
                        <Inp label="Teléfono" value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="555-0000" />
                        <Inp label="Email" type="email" value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="correo@empresa.com" />
                        <div className="col-span-2">
                            <Inp label="Dirección" value={form.address} onChange={(e) => f("address", e.target.value)} placeholder="Dirección completa" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-850">
                        <button 
                            onClick={() => setModal(null)} 
                            className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={save} 
                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 premium-glow-red transition-colors"
                        >
                            Guardar Proveedor
                        </button>
                    </div>
                </Modal>
            )}

            {delId && (
                <Modal title="Confirmar Eliminación" onClose={() => setDelId(null)}>
                    <p className="text-zinc-400 text-sm mb-6">¿Estás seguro de eliminar este proveedor del directorio? Esta acción no se puede deshacer.</p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setDelId(null)} 
                            className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => remove(delId)} 
                            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 premium-glow-red transition-colors"
                        >
                            Sí, eliminar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Suppliers;
