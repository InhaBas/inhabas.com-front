import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import {
  ContestDetailParams,
  ContestListParams,
  ContestType,
  createContest,
  deleteContest,
  getContest,
  getContestList,
  updateContest,
} from '../api/contest';
import { saveContestInterface } from '../types/TypeBoard';

export const contestQueries = {
  all: () => ['contest'] as const,
  lists: () => [...contestQueries.all(), 'list'] as const,
  details: () => [...contestQueries.all(), 'detail'] as const,

  list: (params: ContestListParams) =>
    queryOptions({
      queryKey: [...contestQueries.lists(), params],
      queryFn: () => getContestList(params),
      // 페이지를 넘기거나 검색하는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다.
      // 종류·정렬이 바뀌면 pending이 되어 스피너가 보인다
      placeholderData: keepPreviousPage(params, ['search']),
    }),
  detail: (params: ContestDetailParams) =>
    queryOptions({
      queryKey: [...contestQueries.details(), params],
      queryFn: () => getContest(params),
    }),
};

/*
  작성·수정·삭제 뒤에는 그 종류(공모전·대외활동)의 목록만 무효화한다. Promise는 반환하지 않는다.
  성공하면 화면이 목록으로 이동하고 목록은 마운트할 때 새로 조회하므로, 지금은 대개 무효화할 활성 쿼리가 없다
*/
const invalidateContestLists = (contestType: ContestType) => {
  queryClient.invalidateQueries({ queryKey: [...contestQueries.lists(), { contestType }] });
};

export const contestMutations = {
  create: () =>
    mutationOptions({
      mutationFn: ({
        contestType,
        body,
      }: {
        contestType: ContestType;
        body: saveContestInterface;
      }) => createContest(contestType, body),
      onSuccess: (_data, { contestType }) => invalidateContestLists(contestType),
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({
        contestType,
        id,
        body,
      }: {
        contestType: ContestType;
        id: string;
        body: saveContestInterface;
      }) => updateContest(contestType, id, body),
      // 상세는 무효화하지 않는다. 수정 화면이 구독 중인 상세를 다시 요청하게 되고(옛 화면에 없던 요청),
      // 성공하면 목록으로 이동하므로 상세는 다음에 열 때 새로 조회한다
      onSuccess: (_data, { contestType }) => invalidateContestLists(contestType),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ contestType, id }: { contestType: ContestType; id: string }) =>
        deleteContest(contestType, id),
      onSuccess: (_data, { contestType }) => invalidateContestLists(contestType),
    }),
};
