import { useState, useMemo } from "react";
import Icon from "../components/ui/Icon";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { fmt, genId, isLow } from "../utils/helpers";
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
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Punto de Venta</h2>
                <p className="text-gray-500 text-sm mt-0.5">Busca productos y registra ventas rápidamente</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Search */}
                <div className="lg:col-span-3">
                    <div className="relative mb-4">
                        <Icon n="search" cls="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto por nombre o ID..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" />
                    </div>
                    {search.trim() ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {results.length === 0 ? (
                                <div className="py-12 text-center text-gray-400">No se encontraron productos</div>
                            ) : results.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-400">{p.id}</span>
                                            <Badge color="indigo">{p.category}</Badge>
                                            {isLow(p) ? <Badge color={p.stock === 0 ? "red" : "orange"}>{p.stock === 0 ? "Agotado" : `Stock: ${p.stock}`}</Badge> : <Badge color="green">Stock: {p.stock}</Badge>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <span className="font-bold text-indigo-600 text-lg">{fmt(p.salePrice)}</span>
                                        <button onClick={() => addToCart(p)} disabled={p.stock === 0}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                            + Agregar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Icon n="search" cls="w-8 h-8 text-gray-200" />
                            </div>
                            <p className="text-gray-400 font-medium">Escribe para buscar productos</p>
                            <p className="text-gray-300 text-sm mt-1">Busca por nombre o código de producto</p>
                        </div>
                    )}
                </div>

                {/* Right: Cart */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm" style={{ minHeight: "400px" }}>
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Icon n="cart" cls="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-800">Carrito</h3>
                        {cart.length > 0 && (
                            <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                {cart.reduce((a, c) => a + c.qty, 0)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {cart.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">
                                <Icon n="cart" cls="w-10 h-10 mx-auto text-gray-200 mb-3" />
                                <p className="text-sm">El carrito está vacío</p>
                            </div>
                        ) : cart.map((item) => (
                            <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-400">{fmt(item.salePrice)} c/u</p>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-2 py-1">
                                    <button onClick={() => updQty(item.id, item.qty - 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold">−</button>
                                    <span className="w-7 text-center text-sm font-bold text-gray-700">{item.qty}</span>
                                    <button onClick={() => updQty(item.id, item.qty + 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 font-bold">+</button>
                                </div>
                                <span className="text-sm font-bold text-gray-800 w-14 text-right">{fmt(item.salePrice * item.qty)}</span>
                                <button onClick={() => setCart(cart.filter((c) => c.id !== item.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Icon n="x" cls="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-5 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 font-medium">Total a cobrar</span>
                            <span className="text-3xl font-extrabold text-gray-900">{fmt(total)}</span>
                        </div>
                        <button onClick={checkout} disabled={!cart.length}
                            className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <Icon n="check" cls="w-5 h-5" />Registrar Venta
                        </button>
                        {cart.length > 0 && (
                            <button onClick={() => setCart([])} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
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
                        <p className="text-sm text-gray-500">
                            {cashSession
                                ? "Ingresa el monto final reportado en caja para cerrar el turno."
                                : "Ingresa el monto inicial con el que empiezas el turno."}
                        </p>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Monto ($)</label>
                            <input
                                autoFocus
                                type="number"
                                value={cashSession ? closingAmount : openingAmount}
                                onChange={(e) => cashSession ? setClosingAmount(e.target.value) : setOpeningAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setCashModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-400">Cancelar</button>
                            <button
                                onClick={cashSession ? closeCash : openCash}
                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200"
                            >
                                {cashSession ? "Finalizar Turno" : "Comenzar Turno"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Cash Status Check */}
            {!cashSession && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icon n="alert" cls="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Caja Cerrada</h3>
                        <p className="text-gray-500 text-sm mb-6">Debes abrir una sesión de caja para poder registrar ventas y movimientos.</p>
                        <button
                            onClick={() => setCashModal(true)}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
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
