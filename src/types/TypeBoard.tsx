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

// 백엔드 ContestBoardDetailDto
export interface contestDetailInterface {
  id: number;
  contestFieldId: number;
  title: string;
  content: string;
  writerId: number;
  writerName: string;
  association: string;
  topic: string;
  thumbnail: fileDownloadInterface;
  images: fileDownloadInterface[];
  otherFiles: fileDownloadInterface[];
  dateContestStart: string;
  dateContestEnd: string;
  dateCreated: string;
  dateUpdated: string;
}

// 백엔드 SaveContestBoardDto
export interface saveContestInterface {
  contestFieldId: string | null; // 옛 화면 그대로 '1'(빅데이터)·'2'(IT)를 문자열로 보낸다
  title: string;
  topic: string;
  association: string;
  dateContestStart: string; // yyyy-MM-ddT00:00:00
  dateContestEnd: string; // yyyy-MM-ddT23:59:59
  content: string;
  files: string[]; // 업로드한 파일 id. 1개 이상
}
