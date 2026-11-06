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

export interface ActivityInterface {
  id: number;
  title: string;
  writerName: string;
  dateCreated: string;
  dateUpdated: string;
  thumbnail: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  } | null;
}

export interface ActivityDetailInterface {
  id: string;
  title: string;
  content: string;
  writerId: string;
  writerName: string;
  dateCreated: string;
  dateUpdated: string;
  images: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  otherFiles: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}
