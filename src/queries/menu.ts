import { queryOptions } from '@tanstack/react-query';

import { getMenu } from '../api/menu';

export const menuQueries = {
  all: () => ['menu'] as const,

  detail: ({ id }: { id: number }) =>
    queryOptions({
      queryKey: [...menuQueries.all(), 'detail', { id }],
      queryFn: () => getMenu(id),
    }),
};
