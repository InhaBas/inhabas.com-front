import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import {
  BoardCountGroup,
  BoardDetailParams,
  BoardListParams,
  createBoard,
  deleteBoard,
  getBoard,
  getBoardCount,
  getBoardList,
  saveBoardInterface,
  updateBoard,
} from '../api/board';

export const boardQueries = {
  all: () => ['boards'] as const,
  lists: () => [...boardQueries.all(), 'list'] as const,
  details: () => [...boardQueries.all(), 'detail'] as const,

  list: (params: BoardListParams) =>
    queryOptions({
      queryKey: [...boardQueries.lists(), params],
      queryFn: () => getBoardList(params),
      // 페이지를 넘기거나 검색하는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다.
      // 옛 BoardSearch는 스피너 없이 결과로 목록을 바꿨다. 게시판이 바뀌면 pending이 되어 스피너가 보인다
      placeholderData: keepPreviousPage(params, ['search']),
    }),
  detail: (params: BoardDetailParams) =>
    queryOptions({
      queryKey: [...boardQueries.details(), params],
      queryFn: () => getBoard(params),
    }),
  count: ({ group }: { group: BoardCountGroup }) =>
    queryOptions({
      queryKey: [...boardQueries.all(), 'count', { group }],
      queryFn: () => getBoardCount(group),
    }),
};

/*
  작성·수정·삭제 뒤에는 그 게시판의 목록만 무효화한다. Promise는 반환하지 않는다.
  성공하면 화면이 목록으로 이동하고 목록은 마운트할 때 새로 조회하므로, 지금은 대개 무효화할 활성 쿼리가 없다
*/
const invalidateBoardLists = (board: string) => {
  queryClient.invalidateQueries({ queryKey: [...boardQueries.lists(), { board }] });
};

export const boardMutations = {
  create: () =>
    mutationOptions({
      mutationFn: ({ board, body }: { board: string; body: saveBoardInterface }) =>
        createBoard(board, body),
      onSuccess: (_data, { board }) => invalidateBoardLists(board),
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ board, id, body }: { board: string; id: string; body: saveBoardInterface }) =>
        updateBoard(board, id, body),
      // 토큰 유무로 나뉜 그 글의 상세 캐시를 모두 다시 받는다. 다음에 상세를 열 때 고치기 전 내용이 잠깐 보이지 않게 한다
      onSuccess: (_data, { board, id }) => {
        invalidateBoardLists(board);
        queryClient.invalidateQueries({
          queryKey: boardQueries.details(),
          predicate: (query) => {
            const params = query.queryKey.at(-1) as BoardDetailParams;
            return params.board === board && params.id === id;
          },
          refetchType: 'all',
        });
      },
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ board, id }: { board: string; id: string }) => deleteBoard(board, id),
      onSuccess: (_data, { board }) => invalidateBoardLists(board),
    }),
};
