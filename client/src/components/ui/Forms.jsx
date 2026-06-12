export const Inp = ({ label, ...props }) => (
    <div>
        {label && (
            <label className="block text-xxs font-bold text-zinc-450 uppercase tracking-wider mb-2 ml-0.5">
                {label}
            </label>
        )}
        <input
            className="w-full border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 placeholder-zinc-650 focus:bg-zinc-950 transition-all font-medium"
            {...props}
        />
    </div>
);

export const Sel = ({ label, children, ...props }) => (
    <div>
        {label && (
            <label className="block text-xxs font-bold text-zinc-450 uppercase tracking-wider mb-2 ml-0.5">
                {label}
            </label>
        )}
        <select
            className="w-full border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-zinc-900 text-zinc-100 focus:bg-zinc-950 transition-all font-medium"
            {...props}
        >
            {children}
        </select>
    </div>
);
