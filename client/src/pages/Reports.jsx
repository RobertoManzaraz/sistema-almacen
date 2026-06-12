import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import { fmt } from "../utils/helpers";

const Reports = ({ sales, refresh }) => {
    const [filter, setFilter] = useState("");
    const filtered = useMemo(() => sales.filter((s) => !filter || s.date.startsWith(filter)), [sales, filter]);
    const totalRev = filtered.reduce((a, s) => a + s.total, 0);
    const avgTicket = filtered.length ? totalRev / filtered.length : 0;

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Reportes de Ventas</h2>
                    <p className="text-zinc-500 text-xs font-semibold mt-0.5">
                        {filtered.length} ventas {filter ? "en la fecha seleccionada" : "en total"}
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <input 
                        type="date" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-zinc-800 rounded-xl px-4 py-2 bg-zinc-900 text-zinc-100 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm font-semibold transition-all shadow-sm [color-scheme:dark]" 
                    />
                    {filter && (
                        <button 
                            onClick={() => setFilter("")} 
                            className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-450 hover:bg-zinc-900 transition-colors"
                        >
                            ✕ Limpiar
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Ventas", value: filtered.length, color: "bg-zinc-900/50 border-zinc-850 border-l-2 border-l-red-500 text-zinc-100" },
                    { label: "Ingresos", value: fmt(totalRev), color: "bg-zinc-900/50 border-zinc-850 border-l-2 border-l-emerald-500 text-zinc-100" },
                    { label: "Ticket Promedio", value: fmt(avgTicket), color: "bg-zinc-900/50 border-zinc-850 border-l-2 border-l-amber-500 text-zinc-100" },
                ].map((c) => (
                    <div key={c.label} className={`rounded-2xl border p-5 shadow-lg ${c.color}`}>
                        <p className="text-xxs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">{c.label}</p>
                        <p className="text-2xl font-extrabold tracking-tight">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 rounded-2xl shadow-xl border border-zinc-850/80 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-850 bg-zinc-950/20">
                    <h3 className="font-bold text-zinc-200 text-sm">Historial de Transacciones</h3>
                    {sales.length > 0 && (
                        <button
                            onClick={() => { if (confirm("¿Eliminar todo el historial de ventas?")) refresh([]); }}
                            className="text-xxs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
                        >
                            Limpiar historial
                        </button>
                    )}
                </div>
                {filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mx-auto mb-4 border border-zinc-850 text-zinc-600">
                            <Icon n="chart" cls="w-5 h-5" />
                        </div>
                        <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">No hay ventas {filter ? "en esta fecha" : "registradas"}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-850">
                        {[...filtered].reverse().map((s) => (
                            <details key={s.id} className="group">
                                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-zinc-950/30 transition-colors list-none select-none">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-950/40 border border-emerald-900/20 rounded-lg flex items-center justify-center shrink-0">
                                            <Icon n="check" cls="w-4 h-4 text-emerald-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-zinc-200 text-sm">Venta #{s.id}</p>
                                            <p className="text-xxs text-zinc-500 font-semibold mt-0.5">
                                                {new Date(s.date).toLocaleString("es-ES")} · {s.items.length} producto{s.items.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-extrabold text-emerald-400 text-base">{fmt(s.total)}</span>
                                </summary>
                                <div className="px-5 pb-5 pt-3 bg-zinc-950/40 border-t border-zinc-850/50">
                                    <table className="w-full text-xs text-zinc-300">
                                        <thead>
                                            <tr className="text-zinc-500 uppercase text-xxs tracking-wider border-b border-zinc-850/50">
                                                <th className="text-left pb-2 font-bold">Producto</th>
                                                <th className="text-center pb-2 font-bold w-16">Cant.</th>
                                                <th className="text-right pb-2 font-bold w-24">P. Unit.</th>
                                                <th className="text-right pb-2 font-bold w-28">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-850/30">
                                            {s.items.map((i, idx) => (
                                                <tr key={idx} className="hover:bg-zinc-900/20">
                                                    <td className="py-2.5 font-medium">{i.name}</td>
                                                    <td className="text-center py-2.5 font-bold text-zinc-450">{i.qty}</td>
                                                    <td className="text-right py-2.5 font-semibold text-zinc-450">{fmt(i.price)}</td>
                                                    <td className="text-right py-2.5 font-bold text-zinc-200">{fmt(i.price * i.qty)}</td>
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
