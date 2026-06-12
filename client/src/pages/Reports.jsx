import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import { fmt } from "../utils/helpers";

const Reports = ({ sales, refresh }) => {
    const [filter, setFilter] = useState("");
    const filtered = useMemo(() => sales.filter((s) => !filter || s.date.startsWith(filter)), [sales, filter]);
    const totalRev = filtered.reduce((a, s) => a + s.total, 0);
    const avgTicket = filtered.length ? totalRev / filtered.length : 0;

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Reportes de Ventas</h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {filtered.length} ventas {filter ? "en la fecha seleccionada" : "en total"}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <input type="date" value={filter} onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    {filter && <button onClick={() => setFilter("")} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">✕ Limpiar</button>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Ventas", value: filtered.length, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
                    { label: "Ingresos", value: fmt(totalRev), color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                    { label: "Ticket Promedio", value: fmt(avgTicket), color: "bg-violet-50 text-violet-700 border-violet-100" },
                ].map((c) => (
                    <div key={c.label} className={`rounded-2xl border p-5 ${c.color}`}>
                        <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">{c.label}</p>
                        <p className="text-2xl font-extrabold">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <h3 className="font-bold text-gray-800">Historial de Transacciones</h3>
                    {sales.length > 0 && (
                        <button
                            onClick={() => { if (confirm("¿Eliminar todo el historial de ventas?")) setSales([]); }}
                            className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                        >
                            Limpiar historial
                        </button>
                    )}
                </div>
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <Icon n="chart" cls="w-12 h-12 mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400">No hay ventas {filter ? "en esta fecha" : "registradas"}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {[...filtered].reverse().map((s) => (
                            <details key={s.id} className="group">
                                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none select-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                            <Icon n="check" cls="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">Venta #{s.id}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(s.date).toLocaleString("es-ES")} · {s.items.length} producto{s.items.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-extrabold text-emerald-600 text-lg">{fmt(s.total)}</span>
                                </summary>
                                <div className="px-5 pb-4 bg-gray-50">
                                    <table className="w-full text-xs text-gray-600">
                                        <thead>
                                            <tr className="text-gray-400 uppercase text-xs">
                                                <th className="text-left py-2 font-bold">Producto</th>
                                                <th className="text-center py-2 font-bold">Cant.</th>
                                                <th className="text-right py-2 font-bold">P. Unit.</th>
                                                <th className="text-right py-2 font-bold">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {s.items.map((i, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-1.5">{i.name}</td>
                                                    <td className="text-center">{i.qty}</td>
                                                    <td className="text-right">{fmt(i.price)}</td>
                                                    <td className="text-right font-bold">{fmt(i.price * i.qty)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
