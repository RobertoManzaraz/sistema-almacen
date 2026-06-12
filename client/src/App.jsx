import { useState, useEffect } from "react";
import Icon from "./components/ui/Icon";
import Toast from "./components/ui/Toast";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { api } from "./utils/api";
import { isLow } from "./utils/helpers";

const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "inventory", label: "Inventario", icon: "box" },
    { id: "pos", label: "Punto de Venta", icon: "cart" },
    { id: "suppliers", label: "Proveedores", icon: "users" },
    { id: "reports", label: "Reportes", icon: "chart" },
];

export default function App() {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
    const [active, setActive] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [sales, setSales] = useState([]);
    const [cashSession, setCashSession] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "info") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3200);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuth(false);
        showToast("Sesión cerrada", "info");
    };

    const fetchCurrentSession = async () => {
        if (!isAuth) return;
        try {
            const sessions = await api.get("/cash");
            const open = sessions.find(s => !s.closed_at);
            setCashSession(open || null);
        } catch (err) {
            showToast("Error al cargar sesión de caja", "error");
        }
    };

    const fetchProducts = async () => {
        if (!isAuth) return;
        try {
            const data = await api.get("/products");
            // Map snake_case to camelCase
            const mapped = data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                costPrice: Number(p.cost_price),
                salePrice: Number(p.sale_price),
                stock: p.stock,
                minStock: p.min_stock
            }));
            setProducts(mapped);
        } catch (err) {
            if (err.status === 401) handleLogout();
            showToast("Error al cargar productos", "error");
        }
    };

    const fetchSales = async () => {
        if (!isAuth) return;
        try {
            const data = await api.get("/sales");
            // Map snake_case to camelCase
            const mapped = data.map(s => ({
                id: s.id,
                date: s.created_at,
                total: Number(s.total),
                items: s.items.map(i => ({
                    name: i.name,
                    qty: i.qty,
                    price: Number(i.unit_price)
                }))
            }));
            setSales(mapped);
        } catch (err) {
            if (err.status === 401) handleLogout();
            showToast("Error al cargar ventas", "error");
        }
    };

    const fetchSuppliers = async () => {
        if (!isAuth) return;
        try {
            const data = await api.get("/suppliers");
            setSuppliers(data);
        } catch (err) {
            if (err.status === 401) handleLogout();
            showToast("Error al cargar proveedores", "error");
        }
    };

    useEffect(() => {
        if (isAuth) {
            fetchProducts();
            fetchSales();
            fetchSuppliers();
            fetchCurrentSession();
        }
    }, [isAuth]);

    const lowCount = products.filter(isLow).length;

    if (!isAuth) return <Login onLogin={() => setIsAuth(true)} toast={showToast} />;

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden" style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "w-56" : "w-16"} bg-zinc-900 flex flex-col transition-all duration-300 shrink-0 overflow-hidden z-10 border-r border-zinc-850`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-zinc-850">
                    <div className="w-9 h-9 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                        <Icon n="box" cls="w-5 h-5 text-red-500" />
                    </div>
                    {sidebarOpen && (
                        <div>
                            <p className="text-zinc-100 font-extrabold text-sm tracking-tight leading-tight">WMS Pro</p>
                            <p className="text-zinc-550 text-xs font-bold uppercase tracking-wider">Almacén</p>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1">
                    {NAV.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all relative ${active === item.id
                                ? "bg-zinc-800/80 text-zinc-100 border border-zinc-750 border-l-2 border-l-red-600 shadow-sm"
                                : "text-zinc-450 hover:bg-zinc-800/30 hover:text-zinc-200"
                                }`}
                        >
                            <Icon n={item.icon} cls="w-5 h-5 shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                            {item.id === "inventory" && lowCount > 0 && (
                                <span className={`bg-red-650 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${sidebarOpen ? "ml-auto" : "absolute top-1 right-1 w-4 h-4 text-xs"}`}>
                                    {lowCount}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 text-zinc-450 hover:text-red-500 hover:bg-red-950/15 transition-all font-semibold rounded-xl mx-2 mb-2"
                >
                    <Icon n="logout" cls="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm">Cerrar Sesión</span>}
                </button>

                {/* Collapse */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-3 px-4 py-4 border-t border-zinc-850 text-zinc-500 hover:text-zinc-350 transition-colors"
                >
                    <Icon n="menu" cls="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">Colapsar</span>}
                </button>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                    {active === "dashboard" && <Dashboard products={products} sales={sales} setActive={setActive} />}
                    {active === "inventory" && <Inventory products={products} refresh={fetchProducts} toast={showToast} />}
                    {active === "pos" && <POS products={products} refreshProducts={fetchProducts} refreshSales={fetchSales} cashSession={cashSession} refreshSession={fetchCurrentSession} toast={showToast} />}
                    {active === "suppliers" && <Suppliers suppliers={suppliers} refresh={fetchSuppliers} toast={showToast} />}
                    {active === "reports" && <Reports sales={sales} refresh={fetchSales} />}
                </div>
            </main>

            {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
