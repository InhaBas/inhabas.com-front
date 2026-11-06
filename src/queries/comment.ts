import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import {
  CommentListParams,
  createComment,
  createCommentInterface,
  deleteComment,
  getCommentList,
  updateComment,
} from '../api/comment';

interface CommentTarget {
  menuId?: number;
  boardId?: string;
}

export const commentQueries = {
  all: () => ['comments'] as const,
  lists: () => [...commentQueries.all(), 'list'] as const,

  list: (params: CommentListParams) =>
    queryOptions({
      queryKey: [...commentQueries.lists(), params],
      queryFn: () => getCommentList(params),
    }),
};

// 그 게시글의 댓글 목록만 무효화한다(auth와 관계없이 부분 일치). Promise는 반환하지 않는다
const invalidateCommentList = ({ menuId, boardId }: CommentTarget) => {
  queryClient.invalidateQueries({ queryKey: [...commentQueries.lists(), { menuId, boardId }] });
};

export const commentMutations = {
  create: () =>
    mutationOptions({
      mutationFn: ({ menuId, boardId, body }: CommentTarget & { body: createCommentInterface }) =>
        createComment({ menuId, boardId }, body),
      onSuccess: (_data, target) => invalidateCommentList(target),
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, content }: CommentTarget & { id: number; content: string }) =>
        updateComment(id, { content }),
      onSuccess: (_data, target) => invalidateCommentList(target),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ id }: CommentTarget & { id: number }) => deleteComment(id),
      onSuccess: (_data, target) => invalidateCommentList(target),
    }),
};
