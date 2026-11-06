import { queryOptions } from '@tanstack/react-query';

import { getPolicy } from '../api/policy';

export const policyQueries = {
  all: () => ['policy'] as const,
  details: () => [...policyQueries.all(), 'detail'] as const,

  detail: (params: { id: string }) =>
    queryOptions({
      queryKey: [...policyQueries.details(), params],
      queryFn: () => getPolicy(params.id),
    }),
};
