import { useState } from "react";
import Icon from "../components/ui/Icon";
import { api } from "../utils/api";

export default function Login({ onLogin, toast }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", data.token);
            toast("¡Bienvenido al sistema!", "success");
            onLogin();
        } catch (err) {
            toast("Usuario o contraseña incorrectos", "error");
            window.alert("Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden" style={{ fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
            {/* Background glowing red radial gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full space-y-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10 animate-fade-in">
                <div className="text-center">
                    <div className="w-12 h-12 bg-zinc-950/80 rounded-xl flex items-center justify-center mx-auto mb-4 border border-zinc-800 text-red-500 shadow-inner">
                        <Icon n="box" cls="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Gestor de Stock</h2>
                    <p className="mt-1.5 text-xxs text-zinc-500 uppercase tracking-widest font-bold">Gestión Profesional de Almacén</p>
                </div>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xxs font-bold text-zinc-450 uppercase tracking-wider mb-2 ml-0.5" htmlFor="email-address">Correo Electrónico</label>
                            <div className="relative">
                                <Icon n="user" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full pl-11 pr-4 py-3 border border-zinc-800 placeholder-zinc-600 text-zinc-100 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm bg-zinc-950 transition-all font-medium"
                                    placeholder="admin@wms.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xxs font-bold text-zinc-450 uppercase tracking-wider mb-2 ml-0.5" htmlFor="password">Contraseña</label>
                            <div className="relative">
                                <Icon n="lock" cls="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full pl-11 pr-4 py-3 border border-zinc-800 placeholder-zinc-600 text-zinc-100 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm bg-zinc-950 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-red-500 hover:bg-red-600 focus:outline-none premium-glow-red transition-all items-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <p className="text-xxs text-zinc-500 uppercase tracking-widest font-bold">Panel de Control Administrativo</p>
                </div>
            </div>
        </div>
    );
}
