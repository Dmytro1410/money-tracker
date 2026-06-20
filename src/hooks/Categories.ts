import { TRANSACTION_TYPES } from '@/constants/Transactions.ts';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/api/categories.ts';
import { Category } from '@/types/common.ts';

export function useGetAllCategoriesAPI(type?: TRANSACTION_TYPES) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await getAllCategories();
      if (error) throw error;
      return data as { all: Category[]; children: Category[]; parents: Category[] };
    },
    select: (data) => {
      const filterByType = (list: Category[]) => (type
        ? list.filter((c) => c.type === type || c.type === 'transfer')
        : list);

      return {
        all: filterByType(data.all),
        children: filterByType(data.children),
        parents: filterByType(data.parents),
      };
    },
  });
}
