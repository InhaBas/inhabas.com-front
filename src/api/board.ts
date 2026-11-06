import { request } from './client';
import {
  boardCountInterface,
  boardDetailInterface,
  boardListResponseInterface,
} from '../types/TypeBoard';

/*
  게시판 종류(라우트 /board/<board>의 <board>)에서 API 기본 경로를 고르는 곳은 여기 하나다.
  공모전·대외활동(contest, activity) 목록은 src/api/contest.ts에 있다
*/
const getBoardBasePath = (board: string) => {
  switch (board) {
    case 'alpha':
      return '/project/alpha';
    case 'beta':
      return '/project/beta';
    case 'sponsor':
      return '/scholarship/sponsor';
    case 'usage':
      return '/scholarship/usage';
    case 'opensource':
      return '/board/storage';
    default:
      return `/board/${board}`;
  }
};

// 비로그인으로도 보는 게시판. 목록과 상세를 토큰 없이 부른다(옛 BoardList·BoardDetail과 같다)
export const isPublicBoard = (board: string) => ['opensource', 'usage', 'sponsor'].includes(board);

export interface BoardListParams {
  board: string;
  page: number; // 1부터 센다
  size: number;
  search: string; // 제출한 검색어. 빈 문자열이면 검색하지 않는다
}

export const getBoardList = ({ board, page, size, search }: BoardListParams) =>
  request<boardListResponseInterface>(
    `${getBoardBasePath(board)}?page=${page - 1}&size=${size}${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`,
    { auth: !isPublicBoard(board) },
  );

export interface BoardDetailParams {
  board: string;
  id: string;
  // 상세 화면은 isPublicBoard(board)면 토큰 없이, 수정 화면은 항상 토큰과 함께 부른다(옛 화면과 같다)
  auth: boolean;
}

export const getBoard = ({ board, id, auth }: BoardDetailParams) =>
  request<boardDetailInterface>(`${getBoardBasePath(board)}/${id}`, { auth });

export interface saveBoardInterface {
  title: string;
  content: string;
  files: string[]; // 업로드한 파일 id
  pinOption?: string; // 장학회 게시판 외
  dateHistory?: string; // 장학회 게시판만. yyyy-MM-ddT00:00:00
}

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createBoard = (board: string, body: saveBoardInterface) =>
  request<null>(getBoardBasePath(board), { method: 'POST', auth: true, body });

// 수정도 POST다. 204
export const updateBoard = (board: string, id: string, body: saveBoardInterface) =>
  request<null>(`${getBoardBasePath(board)}/${id}`, { method: 'POST', auth: true, body });

// 204
export const deleteBoard = (board: string, id: string) =>
  request<null>(`${getBoardBasePath(board)}/${id}`, { method: 'DELETE', auth: true });

// 게시판 사이드바의 게시판별 글 수. 게시판 종류에 따라 셋 중 하나를 부른다
export type BoardCountGroup = 'board' | 'project' | 'contest';

export const getBoardCountGroup = (board: string): BoardCountGroup => {
  if (board === 'alpha' || board === 'beta') return 'project';
  if (board === 'contest' || board === 'activity') return 'contest';
  return 'board';
};

// 옛 화면 그대로 토큰과 함께 부른다
export const getBoardCount = (group: BoardCountGroup) =>
  request<boardCountInterface[]>(`/${group}/count`, { auth: true });
