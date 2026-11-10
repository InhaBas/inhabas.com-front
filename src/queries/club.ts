import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import {
  ClubActivityDetailParams,
  ClubActivityListParams,
  createClubActivity,
  createClubHistory,
  deleteClubActivity,
  deleteClubHistory,
  getClubActivity,
  getClubActivityList,
  getClubHistory,
  getClubHistoryList,
  updateClubActivity,
  updateClubHistory,
} from '../api/club';
import { saveActivityInterface, saveHistoryInterface } from '../types/ibas/TypeIBAS';

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

  activities: () => [...clubQueries.all(), 'activity'] as const,
  activityLists: () => [...clubQueries.activities(), 'list'] as const,

  activityList: (params: ClubActivityListParams) =>
    queryOptions({
      queryKey: [...clubQueries.activityLists(), params],
      queryFn: () => getClubActivityList(params),
      // 페이지를 넘기는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다
      placeholderData: keepPreviousPage(params),
    }),
  activityDetail: (params: ClubActivityDetailParams) =>
    queryOptions({
      queryKey: [...clubQueries.activities(), 'detail', params],
      queryFn: () => getClubActivity(params),
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
      // 그 연혁의 상세 캐시도 다시 받는다. 다음에 수정 모달을 열 때 고치기 전 내용이 잠깐 보이지 않게 한다
      onSuccess: (_data, { id }) => {
        invalidateHistoryList();
        queryClient.invalidateQueries({
          queryKey: clubQueries.historyDetail({ id }).queryKey,
          refetchType: 'all',
        });
      },
    }),
  deleteHistory: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: number }) => deleteClubHistory(id),
      onSuccess: invalidateHistoryList,
    }),
};

/*
  활동 글 작성·수정·삭제 뒤에는 활동 목록만 무효화한다. Promise는 반환하지 않는다.
  성공하면 화면이 목록으로 이동하고 목록은 마운트할 때 새로 조회하므로, 지금은 대개 무효화할 활성 쿼리가 없다.
  수정 뒤 상세는 무효화하지 않는다. 수정 화면이 구독 중인 상세를 다시 요청하게 되기 때문이다(옛 화면에 없던 요청)
*/
const invalidateActivityLists = () => {
  queryClient.invalidateQueries({ queryKey: clubQueries.activityLists() });
};

export const clubActivityMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (body: saveActivityInterface) => createClubActivity(body),
      onSuccess: invalidateActivityLists,
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: string; body: saveActivityInterface }) =>
        updateClubActivity(id, body),
      // 토큰 유무로 나뉜 그 활동의 상세 캐시를 모두 다시 받는다. 다음에 상세를 열 때 고치기 전 내용이 잠깐 보이지 않게 한다
      onSuccess: (_data, { id }) => {
        invalidateActivityLists();
        queryClient.invalidateQueries({
          queryKey: [...clubQueries.activities(), 'detail'],
          predicate: (query) => (query.queryKey.at(-1) as ClubActivityDetailParams).id === id,
          refetchType: 'all',
        });
      },
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => deleteClubActivity(id),
      onSuccess: invalidateActivityLists,
    }),
};
