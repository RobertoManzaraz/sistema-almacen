import Icon from "./Icon";

const Modal = ({ title, children, onClose, wide }) => (
    <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div
            className={`bg-zinc-950 border border-zinc-850 rounded-xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"
                } max-h-screen overflow-y-auto`}
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-900/30">
                <h3 className="text-base font-bold text-zinc-100">{title}</h3>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                    <Icon n="x" cls="w-4 h-4" />
                </button>
            </div>
            <div className="px-6 py-5 text-zinc-300">{children}</div>
        </div>
    </div>
);

export default Modal;
