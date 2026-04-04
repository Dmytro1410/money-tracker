import { ITransactionFormCategoriesProps } from '@/types/Transactions.ts';

export function Categories({
  activeClass,
  categoryId,
  onSetCategoryId,
  onSetParentCatyId,
  parentCatId,
  parents,
  subCategories,
}: ITransactionFormCategoriesProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-2xs font-700 uppercase tracking-widest text-white/30 mb-1.5">Category</label>
        <div className="grid grid-cols-4 xl:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto pr-0.5">
          {parents.map((cat) => (
            <button
              key={cat.id}
              className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all ${
                parentCatId === cat.id
                  ? activeClass
                  : 'hover:bg-white/5 text-white/50 font-500'
              }`}
              type="button"
              onClick={() => onSetParentCatyId(parentCatId === cat.id ? '' : cat.id)}
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
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs transition-all ${
                  categoryId === sub.id
                    ? activeClass
                    : 'hover:bg-white/5 text-white/50 font-500'
                }`}
                type="button"
                onClick={() => onSetCategoryId(categoryId === sub.id ? '' : sub.id)}
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
