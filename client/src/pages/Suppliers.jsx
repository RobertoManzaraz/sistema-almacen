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
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Proveedores</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{suppliers.length} proveedores registrados</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
                    <Icon n="plus" cls="w-4 h-4" />Nuevo Proveedor
                </button>
            </div>

            <div className="relative mb-6">
                <Icon n="search" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar proveedor..."
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.length === 0 && <p className="col-span-3 text-center py-16 text-gray-400">No se encontraron proveedores</p>}
                {filtered.map((s) => (
                    <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-base leading-tight">{s.name}</h3>
                                {s.category && <Badge color="indigo">{s.category}</Badge>}
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-lg text-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Icon n="edit" cls="w-4 h-4" /></button>
                                <button onClick={() => setDelId(s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"><Icon n="trash" cls="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="space-y-1.5 text-sm text-gray-500">
                            <p><span className="font-semibold text-gray-700">Contacto: </span>{s.contact}</p>
                            {s.phone && <p><span className="font-semibold text-gray-700">Tel: </span>{s.phone}</p>}
                            {s.email && <p><span className="font-semibold text-gray-700">Email: </span>{s.email}</p>}
                            {s.address && <p><span className="font-semibold text-gray-700">Dir: </span>{s.address}</p>}
                        </div>
                    </div>
                ))}
            </div>

            {modal && (
                <Modal title={modal === "add" ? "➕ Nuevo Proveedor" : "✏️ Editar Proveedor"} onClose={() => setModal(null)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><Inp label="Empresa / Nombre" value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="Nombre del proveedor" /></div>
                        <Inp label="Persona de Contacto" value={form.contact} onChange={(e) => f("contact", e.target.value)} placeholder="Nombre" />
                        <Inp label="Categoría" value={form.category} onChange={(e) => f("category", e.target.value)} placeholder="Ej: Electrónica" />
                        <Inp label="Teléfono" value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="555-0000" />
                        <Inp label="Email" type="email" value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="correo@empresa.com" />
                        <div className="col-span-2"><Inp label="Dirección" value={form.address} onChange={(e) => f("address", e.target.value)} placeholder="Dirección completa" /></div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button onClick={() => setModal(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
                        <button onClick={save} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Guardar</button>
                    </div>
                </Modal>
            )}
            {delId && (
                <Modal title="Confirmar Eliminación" onClose={() => setDelId(null)}>
                    <p className="text-gray-600 mb-6">¿Eliminar este proveedor del directorio?</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDelId(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm">Cancelar</button>
                        <button onClick={() => remove(delId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Eliminar</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Suppliers;
