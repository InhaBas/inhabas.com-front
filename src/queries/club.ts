import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import {
  createClubHistory,
  deleteClubHistory,
  getClubHistory,
  getClubHistoryList,
  updateClubHistory,
} from '../api/club';
import { saveHistoryInterface } from '../types/ibas/TypeIBAS';

export const clubQueries = {
  all: () => ['club'] as const,
  histories: () => [...clubQueries.all(), 'history'] as const,

  historyList: () =>
    queryOptions({
      queryKey: [...clubQueries.histories(), 'list'],
      queryFn: getClubHistoryList,
    }),
  historyDetail: ({ id }: { id: number }) =>
    queryOptions({
      queryKey: [...clubQueries.histories(), 'detail', { id }],
      queryFn: () => getClubHistory(id),
    }),
};

// 연혁 목록만 보여 주므로 변경 뒤에는 목록만 무효화한다. Promise는 반환하지 않는다
const invalidateHistoryList = () => {
  queryClient.invalidateQueries({ queryKey: clubQueries.historyList().queryKey });
};

export const clubMutations = {
  createHistory: () =>
    mutationOptions({
      mutationFn: (body: saveHistoryInterface) => createClubHistory(body),
      onSuccess: invalidateHistoryList,
    }),
  updateHistory: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: number; body: saveHistoryInterface }) =>
        updateClubHistory(id, body),
      onSuccess: invalidateHistoryList,
    }),
  deleteHistory: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: number }) => deleteClubHistory(id),
      onSuccess: invalidateHistoryList,
    }),
};
