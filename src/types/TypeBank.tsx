import { fileDownloadInterface } from './TypeCommon';

// bank support
export interface supportListInterface {
  id: number;
  title: string;
  applicantId: number;
  applicantStudentId: number;
  applicantName: string;
  dateCreated: string;
  status: string;
}

export interface supportDetailInterface {
  id: number;
  dateUsed: string;
  dateCreated: string;
  dateUpdated?: string;
  title: string;
  details: string;
  outcome: number;
  account: string;
  applicantId: number;
  applicantStudentId: number;
  applicantName: string;
  memberIdInCharge?: null; // nullable
  memberStudentIdInCharge?: null; // nullable
  memberNameInCharge?: null; // nullable
  status: string;
  rejectReason?: string | null; // 거절했을 때만 값이 있다
  receipts: fileDownloadInterface[]; // 증빙자료(백엔드 FileDownloadDto)
}

// POST /budget/application, POST /budget/application/{id} 요청 (백엔드 BudgetApplicationRegisterForm)
export interface saveSupportInterface {
  title: string;
  details: string;
  dateUsed: string; // yyyy-MM-ddTHH:mm:ss
  outcome: number;
  account: string;
  files: string[]; // 업로드한 파일 id. 1개 이상
}

// PUT /budget/application/{id}/status 요청 (백엔드 BudgetApplicationStatusChangeRequest)
export interface supportStatusInterface {
  status: 'APPROVED' | 'REJECTED' | 'COMPLETED';
  rejectReason?: string;
}
