import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { fmt, isLow } from "../utils/helpers";
import { api } from "../utils/api";

const POS = ({ products, refreshProducts, refreshSales, cashSession, refreshSession, toast }) => {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [openingAmount, setOpeningAmount] = useState("");
    const [closingAmount, setClosingAmount] = useState("");
    const [cashModal, setCashModal] = useState(false);

    const openCash = async () => {
        if (!openingAmount) return toast("Ingresa monto de apertura", "error");
        try {
            await api.post("/cash/open", { opening_amount: Number(openingAmount) });
            refreshSession();
            setCashModal(false);
            toast("Caja abierta correctamente", "success");
        } catch (err) {
            toast("Error al abrir caja", "error");
        }
    };

    const closeCash = async () => {
        if (!closingAmount) return toast("Ingresa monto de cierre", "error");
        try {
            await api.put(`/cash/close/${cashSession.id}`, { closing_amount: Number(closingAmount) });
            refreshSession();
            setCashModal(false);
            toast("Caja cerrada correctamente", "success");
        } catch (err) {
            toast("Error al cerrar caja", "error");
        }
    };

    const results = useMemo(() =>
        search.trim()
            ? products.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                String(p.id).toLowerCase().includes(search.toLowerCase())
            )
            : [],
        [products, search]
    );

    const addToCart = (p) => {
        if (p.stock === 0) return toast("Producto sin stock disponible", "error");
        const ex = cart.find((c) => c.id === p.id);
        if (ex) {
            if (ex.qty >= p.stock) return toast("Stock máximo alcanzado", "error");
            setCart(cart.map((c) => (c.id === p.id ? { ...c, qty: c.qty + 1 } : c)));
        } else {
            setCart([...cart, { ...p, qty: 1 }]);
        }
        toast(`${p.name} agregado al carrito`, "success");
    };

    const updQty = (id, qty) => {
        const p = products.find((p) => p.id === id);
        if (qty > p.stock) return toast("No hay suficiente stock", "error");
        if (qty <= 0) return setCart(cart.filter((c) => c.id !== id));
        setCart(cart.map((c) => (c.id === id ? { ...c, qty } : c)));
    };

    const total = cart.reduce((s, c) => s + c.salePrice * c.qty, 0);

    const checkout = async () => {
        if (!cashSession) return toast("Debes abrir la caja antes de vender", "error");
        if (!cart.length) return toast("El carrito está vacío", "error");

        const saleData = {
            items: cart.map((c) => ({
                product_id: c.id,
                qty: c.qty,
                unit_price: c.salePrice
            }))
        };

        try {
            await api.post("/sales", saleData);
            refreshProducts();
            refreshSales();
            setCart([]);
            setSearch("");
            toast(`✅ Venta registrada por ${fmt(total)}`, "success");
        } catch (err) {
            toast("Error al registrar la venta", "error");
        }
    };

    return (
        <div className="animate-fade-in relative min-h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Punto de Venta</h2>
                    <p className="text-zinc-500 text-xs font-semibold mt-0.5">Busca productos y registra ventas rápidamente</p>
                </div>
                {cashSession && (
                    <button 
                        onClick={() => setCashModal(true)} 
                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-red-500 hover:text-red-400 hover:bg-zinc-850 rounded-xl text-xs font-bold transition-all"
                    >
                        🔒 Cerrar Turno (Caja Abierta)
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Search */}
                <div className="lg:col-span-3">
                    <div className="relative mb-4">
                        <Icon n="search" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        <input 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Buscar producto por nombre o código..."
                            className="w-full pl-11 pr-4 py-3 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 placeholder-zinc-600 transition-all font-medium" 
                        />
                    </div>
                    {search.trim() ? (
                        <div className="bg-zinc-900 rounded-2xl border border-zinc-850/80 shadow-xl overflow-hidden">
                            {results.length === 0 ? (
                                <div className="py-12 text-center text-zinc-500 font-semibold">No se encontraron productos</div>
                            ) : results.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-4 border-b border-zinc-850/50 last:border-0 hover:bg-zinc-950/20 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-zinc-200 text-sm">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xxs text-zinc-500 font-mono">{p.id}</span>
                                            <Badge color="indigo">{p.category}</Badge>
                                            {isLow(p) ? (
                                                <Badge color={p.stock === 0 ? "red" : "orange"}>
                                                    {p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`}
                                                </Badge>
                                            ) : (
                                                <Badge color="green">Stock: {p.stock}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3.5 ml-4">
                                        <span className="font-bold text-red-500 text-base">{fmt(p.salePrice)}</span>
                                        <button 
                                            onClick={() => addToCart(p)} 
                                            disabled={p.stock === 0}
                                            className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors premium-glow-red"
                                        >
                                            + Agregar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-zinc-900 border border-zinc-850 rounded-2xl py-20 text-center shadow-lg">
                            <div className="w-14 h-14 bg-zinc-950 rounded-xl flex items-center justify-center mx-auto mb-4 border border-zinc-850 text-zinc-600">
                                <Icon n="search" cls="w-6 h-6" />
                            </div>
                            <p className="text-zinc-400 font-bold text-sm">Escribe para buscar productos</p>
                            <p className="text-zinc-655 text-xs font-semibold mt-1">Busca por nombre o código de barras</p>
                        </div>
                    )}
                </div>

                {/* Right: Cart */}
                <div className="lg:col-span-2 flex flex-col bg-zinc-900 border border-zinc-850 rounded-2xl shadow-xl overflow-hidden" style={{ minHeight: "400px" }}>
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-850/80 bg-zinc-950/20">
                        <div className="w-8 h-8 bg-red-950/30 border border-red-900/20 rounded-lg flex items-center justify-center">
                            <Icon n="cart" cls="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="font-bold text-zinc-200 text-sm">Carrito</h3>
                        {cart.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xxs font-extrabold px-2 py-0.5 rounded-full">
                                {cart.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-zinc-850/50">
                        {cart.length === 0 ? (
                            <div className="py-20 text-center text-zinc-550">
                                <Icon n="cart" cls="w-10 h-10 mx-auto text-zinc-700 mb-3" />
                                <p className="text-xs font-bold uppercase tracking-wider">El carrito está vacío</p>
                            </div>
                        ) : cart.map((item) => (
                            <div key={item.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-zinc-950/10">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-zinc-200 truncate">{item.name}</p>
                                    <p className="text-xxs text-zinc-500 font-semibold mt-0.5">{fmt(item.salePrice)} c/u</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-850 rounded-xl px-2 py-1">
                                    <button onClick={() => updQty(item.id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 font-bold">−</button>
                                    <span className="w-7 text-center text-xs font-bold text-zinc-300">{item.qty}</span>
                                    <button onClick={() => updQty(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-200 font-bold">+</button>
                                </div>
                                <span className="text-sm font-bold text-zinc-200 w-16 text-right">{fmt(item.salePrice * item.qty)}</span>
                                <button onClick={() => setCart(cart.filter((c) => c.id !== item.id))} className="text-zinc-600 hover:text-red-500 transition-colors ml-1.5">
                                    <Icon n="x" cls="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 border-t border-zinc-850/80 bg-zinc-950/10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-zinc-450 text-xs font-bold uppercase tracking-wider">Total a cobrar</span>
                            <span className="text-2xl font-extrabold text-zinc-100 tracking-tight">{fmt(total)}</span>
                        </div>
                        <button 
                            onClick={checkout} 
                            disabled={!cart.length}
                            className="w-full py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-red-500 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg premium-glow-red"
                        >
                            <Icon n="check" cls="w-4 h-4" />Registrar Venta
                        </button>
                        {cart.length > 0 && (
                            <button 
                                onClick={() => setCart([])} 
                                className="w-full mt-2.5 py-1 text-xs text-zinc-550 hover:text-zinc-400 font-bold uppercase tracking-wider transition-colors"
                            >
                                Vaciar carrito
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Cash Modal */}
            {cashModal && (
                <Modal title={cashSession ? "🔒 Cerrar Caja" : "🔓 Abrir Caja"} onClose={() => setCashModal(false)}>
                    <div className="space-y-4">
                        <p className="text-xs text-zinc-450 leading-relaxed">
                            {cashSession
                                ? "Ingresa el monto final reportado en caja para cerrar el turno."
                                : "Ingresa el monto inicial con el que empiezas el turno de caja."}
                        </p>
                        <div>
                            <label className="block text-xxs font-bold text-zinc-500 uppercase tracking-wider mb-2">Monto ($)</label>
                            <input
                                autoFocus
                                type="number"
                                value={cashSession ? closingAmount : openingAmount}
                                onChange={(e) => cashSession ? setClosingAmount(e.target.value) : setOpeningAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 placeholder-zinc-600 font-semibold"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850 mt-6">
                            <button 
                                onClick={() => setCashModal(false)} 
                                className="px-4 py-2 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-350 hover:bg-zinc-900 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={cashSession ? closeCash : openCash}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 premium-glow-red transition-colors animate-fade-in"
                            >
                                {cashSession ? "Finalizar Turno" : "Comenzar Turno"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Cash Status Check Blocker Overlay */}
            {!cashSession && (
                <div className="absolute inset-0 z-10 bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-zinc-800/80 animate-fade-in">
                        <div className="w-16 h-16 bg-red-950/40 text-red-500 border border-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Icon n="alert" cls="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-extrabold text-zinc-150 tracking-tight mb-2">Caja Cerrada</h3>
                        <p className="text-zinc-450 text-xs font-semibold leading-relaxed mb-6">Debes abrir una sesión de caja para poder registrar ventas y realizar operaciones comerciales.</p>
                        <button
                            onClick={() => setCashModal(true)}
                            className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold premium-glow-red transition-all shadow-lg"
                        >
                            Abrir Caja Ahora
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default POS;
