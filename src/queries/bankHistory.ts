import {
  matchMutation,
  mutationOptions,
  queryOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import {
  BankHistoryListParams,
  createBankHistory,
  deleteBankHistory,
  getBankHistory,
  getBankHistoryList,
  getBankHistoryYears,
  updateBankHistory,
} from '../api/bankHistory';
import { BankHistoryPayload } from '../functions/bankHistoryFunctions';

export const bankHistoryQueries = {
  all: () => ['bankHistories'] as const,
  lists: () => [...bankHistoryQueries.all(), 'list'] as const,
  details: () => [...bankHistoryQueries.all(), 'detail'] as const,

  years: () =>
    queryOptions({
      queryKey: [...bankHistoryQueries.all(), 'years'],
      queryFn: getBankHistoryYears,
    }),
  list: (params: BankHistoryListParams) =>
    queryOptions({
      queryKey: [...bankHistoryQueries.lists(), params],
      queryFn: () => getBankHistoryList(params),
      // 페이지를 넘기거나 연도를 바꾸는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다.
      // 옛 Bank는 첫 조회에만 스피너를 그리고, 그 뒤에는 응답이 오면 목록을 바꿨다
      placeholderData: keepPreviousPage(params, ['year']),
    }),
  detail: ({ id }: { id: string }) =>
    queryOptions({
      queryKey: [...bankHistoryQueries.details(), { id }],
      queryFn: () => getBankHistory(id),
    }),
};

/*
  추가·수정·삭제에 성공하면 Bank가 1페이지로 돌아간다(useOnBankHistoryChanged). 옛 화면도 성공하면 page=0으로 다시 조회했다.
  그래서 1페이지 목록만 무효화한다. 보고 있던 N페이지까지 무효화하면 N페이지를 다시 받은 뒤 1페이지를 또 받아 요청이 는다.
  N페이지 목록은 Bank가 1페이지로 옮기면 관찰자가 없어져 gcTime 0으로 캐시에서 사라진다. Promise는 반환하지 않는다
*/
const invalidateFirstPageLists = () => {
  queryClient.invalidateQueries({
    queryKey: bankHistoryQueries.lists(),
    predicate: (query) => (query.queryKey.at(-1) as BankHistoryListParams).page === 1,
  });
};

// 상세는 무효화하지 않는다. 수정 모달은 성공하면 닫히고, 상세는 다음에 열 때 새로 조회한다
export const bankHistoryMutations = {
  create: () =>
    mutationOptions({
      mutationKey: [...bankHistoryQueries.all(), 'create'],
      mutationFn: (body: BankHistoryPayload) => createBankHistory(body),
      onSuccess: invalidateFirstPageLists,
    }),
  update: () =>
    mutationOptions({
      mutationKey: [...bankHistoryQueries.all(), 'update'],
      mutationFn: ({ id, body }: { id: string; body: BankHistoryPayload }) =>
        updateBankHistory(id, body),
      onSuccess: invalidateFirstPageLists,
    }),
  delete: () =>
    mutationOptions({
      mutationKey: [...bankHistoryQueries.all(), 'delete'],
      mutationFn: (id: number) => deleteBankHistory(id),
      onSuccess: invalidateFirstPageLists,
    }),
};

/*
  회계 내역 추가·수정·삭제가 성공할 때마다 onChanged를 부른다. Bank가 여기서 1페이지로 돌아간다.
  추가·수정은 전역 Modal 안에서 일어나서 Bank의 setPage를 mutate 콜백으로 넘길 수 없기 때문에 뮤테이션 캐시를 구독한다.
  팩토리의 onSuccess(1페이지 무효화)가 끝난 뒤에 불린다
*/
export const useOnBankHistoryChanged = (onChanged: () => void) => {
  const client = useQueryClient();
  // 콜백이 렌더마다 바뀌어도 다시 구독하지 않도록 최신 콜백을 ref에 둔다
  const onChangedRef = useRef(onChanged);
  useEffect(() => {
    onChangedRef.current = onChanged;
  });

  useEffect(
    () =>
      client.getMutationCache().subscribe((event) => {
        if (
          event.type === 'updated' &&
          event.action.type === 'success' &&
          matchMutation({ mutationKey: bankHistoryQueries.all() }, event.mutation)
        ) {
          onChangedRef.current();
        }
      }),
    [client],
  );
};
