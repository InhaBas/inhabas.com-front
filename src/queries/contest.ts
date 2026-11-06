import { queryOptions } from '@tanstack/react-query';

import { keepPreviousPage } from './keepPreviousPage';
import { ContestListParams, getContestList } from '../api/contest';

export const contestQueries = {
  all: () => ['contest'] as const,
  lists: () => [...contestQueries.all(), 'list'] as const,

  list: (params: ContestListParams) =>
    queryOptions({
      queryKey: [...contestQueries.lists(), params],
      queryFn: () => getContestList(params),
      // 페이지를 넘기거나 검색하는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다.
      // 종류·정렬이 바뀌면 pending이 되어 스피너가 보인다
      placeholderData: keepPreviousPage(params, ['search']),
    }),
};
