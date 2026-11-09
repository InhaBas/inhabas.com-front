import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import { getPolicy, updatePolicy } from '../api/policy';
import { policyInterface } from '../types/TypeCommon';

export const policyQueries = {
  all: () => ['policy'] as const,
  details: () => [...policyQueries.all(), 'detail'] as const,

  detail: (params: { id: string }) =>
    queryOptions({
      queryKey: [...policyQueries.details(), params],
      queryFn: () => getPolicy(params.id),
    }),
};

export const policyMutations = {
  // 옛 화면은 하나를 수정해도 회칙 3개를 모두 다시 조회했다
  update: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: string; body: Pick<policyInterface, 'content'> }) =>
        updatePolicy(id, body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: policyQueries.details() });
      },
    }),
};
