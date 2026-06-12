import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import { fmt, today, isLow } from "../utils/helpers";

const Dashboard = ({ products, sales, setActive }) => {
    const lowItems = products.filter(isLow);
    const todaySales = sales.filter((s) => s.date.startsWith(today()));
    const todayRevenue = todaySales.reduce((a, s) => a + s.total, 0);
    const totalRevenue = sales.reduce((a, s) => a + s.total, 0);

    const cards = [
        { label: "Total Productos", value: products.length, sub: `${products.filter((p) => p.stock > 0).length} con stock disponible`, icon: "box", iconCls: "text-red-500 bg-red-950/30 border border-red-900/20", mod: "inventory" },
        { label: "Ventas del Día", value: fmt(todayRevenue), sub: `${todaySales.length} transacciones hoy`, icon: "cart", iconCls: "text-emerald-400 bg-emerald-950/30 border border-emerald-900/20", mod: "reports" },
        { label: "Alertas de Stock", value: lowItems.length, sub: "Productos críticos", icon: "alert", iconCls: "text-rose-400 bg-rose-950/30 border border-rose-900/20", mod: "inventory" },
        { label: "Ingresos Totales", value: fmt(totalRevenue), sub: `${sales.length} ventas registradas`, icon: "chart", iconCls: "text-red-400 bg-red-950/30 border border-red-900/20", mod: "reports" },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Dashboard</h2>
                <p className="text-zinc-550 text-xs font-bold mt-1">
                    {new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((c) => (
                    <button
                        key={c.label}
                        onClick={() => setActive(c.mod)}
                        className="bg-zinc-900 rounded-xl p-5 border border-zinc-850/80 shadow-md text-left hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between h-32"
                    >
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{c.label}</span>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.iconCls}`}>
                                <Icon n={c.icon} cls="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-zinc-100 tracking-tight leading-none">{c.value}</div>
                            <div className="text-xs text-zinc-450 mt-1.5 font-medium">{c.sub}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-850">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-850 bg-zinc-950/30 rounded-t-xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-red-950/30 border border-red-900/20 rounded-lg flex items-center justify-center">
                                <Icon n="alert" cls="w-3.5 h-3.5 text-red-500" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-200">Alertas de Stock Bajo</h3>
                        </div>
                        {lowItems.length > 0 && <Badge color="red">{lowItems.length}</Badge>}
                    </div>
                    {lowItems.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-zinc-650 text-3xl mb-1.5">✓</p>
                            <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Todo el stock en orden</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-850">
                            {lowItems.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-950/20 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-200">{p.name}</p>
                                        <p className="text-xs text-zinc-550 font-semibold">{p.category} · Mín: {p.minStock}</p>
                                    </div>
                                    <Badge color={p.stock === 0 ? "red" : "orange"}>
                                        {p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Sales */}
                <div className="bg-zinc-900 rounded-xl border border-zinc-850">
                    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-850 bg-zinc-950/30 rounded-t-xl">
                        <div className="w-7 h-7 bg-emerald-950/30 border border-emerald-900/20 rounded-lg flex items-center justify-center">
                            <Icon n="cart" cls="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-bold text-zinc-200">Ventas Recientes</h3>
                    </div>
                    {sales.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">No hay ventas registradas</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-850">
                            {[...sales].reverse().slice(0, 5).map((s) => (
                                <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-950/20 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-200">Venta #{s.id}</p>
                                        <p className="text-xs text-zinc-550 font-semibold">{new Date(s.date).toLocaleString("es-ES")}</p>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">{fmt(s.total)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
