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
      // 토큰 유무로 나뉜 그 글의 상세 캐시를 모두 다시 받는다. 다음에 상세를 열 때 고치기 전 내용이 잠깐 보이지 않게 한다
      onSuccess: (_data, { contestType, id }) => {
        invalidateContestLists(contestType);
        queryClient.invalidateQueries({
          queryKey: contestQueries.details(),
          predicate: (query) => {
            const params = query.queryKey.at(-1) as ContestDetailParams;
            return params.contestType === contestType && params.id === id;
          },
          refetchType: 'all',
        });
      },
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ contestType, id }: { contestType: ContestType; id: string }) =>
        deleteContest(contestType, id),
      onSuccess: (_data, { contestType }) => invalidateContestLists(contestType),
    }),
};
