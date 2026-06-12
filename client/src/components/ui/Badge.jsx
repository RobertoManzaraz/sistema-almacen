const COLORS = {
    gray: "bg-zinc-900 text-zinc-350 border border-zinc-800",
    red: "bg-red-950/40 text-red-450 border border-red-900/30",
    orange: "bg-amber-950/40 text-amber-450 border border-amber-900/25",
    green: "bg-emerald-950/40 text-emerald-450 border border-emerald-900/25",
    indigo: "bg-zinc-800 text-zinc-200 border border-zinc-700",
    violet: "bg-violet-950/40 text-violet-450 border border-violet-900/25",
};

const Badge = ({ children, color = "gray" }) => (
    <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${COLORS[color]}`}
    >
        {children}
    </span>
);

export default Badge;
