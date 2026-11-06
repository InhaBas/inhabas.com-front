import { request } from './client';
import { commentListInterface } from '../types/TypeCommon';

export interface CommentListParams {
  menuId?: number;
  boardId?: string;
  // 비로그인으로도 보는 게시판(공개 자료실·공모전·대외활동)은 토큰 없이 부른다(옛 화면과 같다)
  auth: boolean;
}

export const getCommentList = ({ menuId, boardId, auth }: CommentListParams) =>
  request<commentListInterface[]>(`/board/${menuId}/${boardId}/comments`, { auth });

export interface createCommentInterface {
  parentCommentId: number | null; // null이면 댓글, 값이 있으면 대댓글
  content: string;
}

// 201 빈 본문
export const createComment = (
  { menuId, boardId }: { menuId?: number; boardId?: string },
  body: createCommentInterface,
) => request<null>(`/board/${menuId}/${boardId}/comment`, { method: 'POST', auth: true, body });

// 204
export const updateComment = (id: number, body: { content: string }) =>
  request<null>(`/comment/${id}`, { method: 'PUT', auth: true, body });

// 204
export const deleteComment = (id: number) =>
  request<null>(`/comment/${id}`, { method: 'DELETE', auth: true });
