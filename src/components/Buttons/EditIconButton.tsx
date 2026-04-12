export function EditIconButton({ onEdit }: { onEdit: () => void }) {
  return (
    <button
      className="btn-icon"
      title="Edit"
      type="button"
      onClick={onEdit}
    >
      <svg
        fill="none"
        height="12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="12"
      >
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}
