import { apiGet } from '@/api/index.ts';

const baseUrl = '/categories';

export const getAllCategories = () => {
  const url = `${baseUrl}/all`;
  return apiGet({ url });
};
