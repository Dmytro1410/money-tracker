import clsx from 'clsx';
import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { useGetAllCategoriesAPI } from '@/hooks/Categories.ts';

export function UpsertBudgetsFormCategories({
  onSetParentCatId,
  onSetSubCatId,
  parentCatId,
  subCatId,
}: {
  onSetParentCatId: (parentCatId: string) => void;
  onSetSubCatId: (categoryId: string) => void;
  parentCatId: string;
  subCatId: string;
}) {
  const { data: catData } = useGetAllCategoriesAPI(TRANSACTION_TYPES.EXPENSE);
  const { children = [], parents = [] } = catData || {};
  const subCategories = children.filter((c) => c.parent_id === parentCatId);
  const isSelected = (c: string) => parentCatId === c || subCatId === c;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Category</label>
        <div className="grid grid-cols-4 xl:grid-cols-8 gap-1.5 overflow-y-auto pr-0.5 ">
          {parents.map((cat) => (
            <button
              key={cat.id}
              className={clsx(
                'flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all',
                'hover:bg-white/5 text-white/50 font-500',
                isSelected(cat.id) && 'bg-violet-500/20 hover:bg-violet-500/20 text-white/100 font-700',
              )}
              type="button"
              onClick={() => onSetParentCatId(cat.id)}
            >
              <span className="text-lg leading-none">{cat.icon}</span>
              <span className="truncate w-full text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {parentCatId && subCategories.length > 0 && (
        <div>
          <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">
            Subcategory
            <span className="text-white/20 normal-case tracking-normal" />
          </label>
          <div className="grid grid-cols-4 xl:grid-cols-8 gap-1.5">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                className={clsx(
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all',
                  'hover:bg-white/5 text-white/50 font-500',
                  isSelected(sub.id) && 'bg-violet-500/20 hover:bg-violet-500/20 text-white/100 font-700',
                )}
                type="button"
                onClick={() => onSetSubCatId(sub.id)}
              >
                <span className="text-lg leading-none">{sub.icon}</span>
                <span className="truncate w-full text-center leading-tight">{sub.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
