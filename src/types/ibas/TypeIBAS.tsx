import { fileDownloadInterface } from '../TypeCommon';

// introduce
export interface staffInterface {
  name: string;
  memberId?: number;
  studentId: string;
  role: string;
  generation?: number;
  major: string;
  picture: string;
}

export interface historyInterface {
  id: number;
  title: string;
  content?: string;
  writerId?: number;
  dateHistory: string;
  year?: string;
}

// POST /club/history, PUT /club/history/{id} 본문. dateHistory는 yyyy-MM-ddTHH:mm:ss
export interface saveHistoryInterface {
  title: string;
  content: string;
  dateHistory: string;
}

// scholarship
export interface scholarshipHistoryInterface {
  year: number | null;
  data: {
    id: number;
    title: string;
    dateHistory: string;
  }[];
}

// POST /scholarship/history, PUT /scholarship/history/{id} 본문. dateHistory는 yyyy-MM-ddTHH:mm:ss
export interface saveScholarshipHistoryInterface {
  title: string;
  dateHistory: string;
}

// GET /scholarship/{SPONSOR|USAGE} 목록 항목 (백엔드 ScholarshipBoardDto)
export interface scholarshipBoardInterface {
  id: number;
  title: string;
  writerId: number;
  writerName: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface scholarshipDetailListInterface {
  contents: {
    date: string;
    content: string;
    id: string;
  }[];
  mainUrl: string;
}

// honor
export interface honorDataInterface {
  name: string;
  memberId: number;
  studentId: string;
  generation: number;
  major: string;
  picture: string;
  intro: string;
  email: string;
  phoneNumber: string;
}

// activity

// 백엔드 ClubActivityDto
export interface ActivityInterface {
  id: number;
  title: string;
  writerId: number;
  writerName: string;
  dateCreated: string;
  dateUpdated: string;
  thumbnail: fileDownloadInterface | null;
}

// 백엔드 ClubActivityDetailDto
export interface ActivityDetailInterface {
  id: number;
  title: string;
  content: string;
  writerId: number;
  writerName: string;
  dateCreated: string;
  dateUpdated: string;
  images: fileDownloadInterface[];
  otherFiles: fileDownloadInterface[];
}

// 백엔드 SaveClubActivityDto
export interface saveActivityInterface {
  title: string;
  content: string;
  files: string[]; // 업로드한 파일 id. 1개 이상
}
