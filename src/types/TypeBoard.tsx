import { fileDownloadInterface, pagedResponseInterface } from './TypeCommon';

// board
export interface boardListInterface {
  id?: number;
  title: string;
  writerId?: number;
  writerName: string;
  datePinExpiration?: string;
  dateCreated: string;
  dateUpdated?: string;
  isPinned?: boolean;
}

export interface boardMenuInterface {
  menuName: string;
  count: string;
  // boardType?: string;
}

// 백엔드 BoardCountDto (/board/count, /project/count, /contest/count)
export interface boardCountInterface {
  menuId: number;
  priority: number;
  type: string; // MenuType. 'STORAGE'는 opensource 게시판이다
  menuName: string;
  count: number;
}

// 백엔드 PagedPinnedResponseDto. 장학회 게시판(PagedResponseDto)은 pinnedData가 없다
export interface boardListResponseInterface extends pagedResponseInterface<boardListInterface> {
  pinnedData?: boardListInterface[];
}

// 백엔드 ContestBoardDto
export interface contestListInterface {
  id: number;
  contestFieldId: number;
  title: string;
  writerId: number;
  topic: string;
  association: string;
  dateContestStart?: string;
  dateContestEnd?: string;
  dday?: number;
  thumbnail?: fileDownloadInterface;
}

export interface boardDetailInterface {
  id: number;
  title: string;
  content: string;
  writerId?: number;
  writerName: string;
  datePinExpiration?: string;
  dateCreated: string;
  dateUpdated: string;
  images?: fileDownloadInterface[];
  otherFiles?: fileDownloadInterface[];
  isPinned?: boolean;
  dateHistory?: string;
}
