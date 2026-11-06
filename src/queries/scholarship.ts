import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import {
  createScholarshipHistory,
  deleteScholarshipHistory,
  getScholarshipBoardList,
  getScholarshipHistoryList,
  ScholarshipBoardListParams,
  updateScholarshipHistory,
} from '../api/scholarship';
import { saveScholarshipHistoryInterface } from '../types/ibas/TypeIBAS';

export const scholarshipQueries = {
  all: () => ['scholarship'] as const,
  histories: () => [...scholarshipQueries.all(), 'history'] as const,
  boards: () => [...scholarshipQueries.all(), 'board'] as const,

  // 장학회 페이지와 연혁 수정 모달이 같은 키를 쓴다. 모달은 페이지가 조회한 캐시를 구독만 한다
  historyList: () =>
    queryOptions({
      queryKey: [...scholarshipQueries.histories(), 'list'],
      queryFn: getScholarshipHistoryList,
    }),
  boardList: (params: ScholarshipBoardListParams) =>
    queryOptions({
      queryKey: [...scholarshipQueries.boards(), 'list', params],
      queryFn: () => getScholarshipBoardList(params),
    }),
};

// 연혁 목록만 보여 주므로 변경 뒤에는 목록만 무효화한다. Promise는 반환하지 않는다
const invalidateHistoryList = () => {
  queryClient.invalidateQueries({ queryKey: scholarshipQueries.historyList().queryKey });
};

export const scholarshipMutations = {
  createHistory: () =>
    mutationOptions({
      mutationFn: (body: saveScholarshipHistoryInterface) => createScholarshipHistory(body),
      onSuccess: invalidateHistoryList,
    }),
  updateHistory: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: number; body: saveScholarshipHistoryInterface }) =>
        updateScholarshipHistory(id, body),
      onSuccess: invalidateHistoryList,
    }),
  deleteHistory: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: number }) => deleteScholarshipHistory(id),
      onSuccess: invalidateHistoryList,
    }),
};
