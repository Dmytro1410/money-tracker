import { IPageEmptyListProps } from '@/types/common.ts';

export function PageEmptyList({
  onResetSearch, onShowAdd, search, title,
}: IPageEmptyListProps) {
  return (
    <div
      className="card p-12 text-center transition-colors"
    >
      {search ? (
        <div
          className="w-14 h-14 rounded-2xl cursor-pointer bg-violet-500 hover:bg-violet-600 flex items-center justify-center mx-auto mb-4"
          onClick={() => {
            if (onResetSearch) onResetSearch();
          }}
        >
          <svg
            fill="none"
            height="24"
            stroke="#CFF008"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-2xl cursor-pointer bg-violet-500 hover:bg-violet-600 flex items-center justify-center mx-auto mb-4"
          onClick={() => {
            onShowAdd();
          }}
        >
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="14"
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
        </div>
      )}
      <p className="text-white/50 text-sm font-700">
        {search ? 'Nothing found' : `There are no ${title} yet.`}
      </p>
      <p
        className="text-white/20 text-xs font-500 mt-1"
      >
        {`Click to ${search ? 'reset search' : 'add the first one'}`}
      </p>
    </div>
  );
}
