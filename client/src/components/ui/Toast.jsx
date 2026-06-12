import Icon from "./Icon";

const Toast = ({ msg, type, onClose }) => {
    const config = {
        success: {
            border: "border-l-4 border-l-emerald-500",
            icon: "check",
            iconCls: "text-emerald-500 bg-emerald-950/40 border border-emerald-900/30"
        },
        error: {
            border: "border-l-4 border-l-red-500",
            icon: "alert",
            iconCls: "text-red-500 bg-red-950/40 border border-red-900/30"
        },
        info: {
            border: "border-l-4 border-l-zinc-500",
            icon: "alert", // fallback or info icon
            iconCls: "text-zinc-400 bg-zinc-800/40 border border-zinc-700/30"
        }
    };

    const current = config[type] || config.info;

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-3.5 px-5 py-4 rounded-xl shadow-2xl text-zinc-100 text-sm font-semibold bg-zinc-900/95 border border-zinc-800 backdrop-blur-md animate-fade-in ${current.border}`}
        >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${current.iconCls}`}>
                <Icon n={current.icon} cls="w-3.5 h-3.5" />
            </div>
            <span className="pr-4">{msg}</span>
            <button 
                onClick={onClose} 
                className="ml-auto w-6 h-6 flex items-center justify-center rounded-lg hover:bg-zinc-850 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                <Icon n="x" cls="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

export default Toast;
