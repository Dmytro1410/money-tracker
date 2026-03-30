export function LogoContainer() {
  return (
    <div className="flex items-center gap-3 xl:px-5 h-16 border-b border-white/5">
      <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
        <svg
          fill="none"
          height="16"
          stroke="#131313"
          strokeLinecap="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <span className="text-white font-800 text-base tracking-tight">Budget</span>
    </div>
  );
}
