// myInfo
export interface profileInterface {
  name: string;
  studentId: string;
  major: string;
  grade: number;
  email: string;
  phoneNumber: string;
  role: string;
  type: string;
  picture: string;
  introduce: string | null; // nullable
  isHOF: boolean;
}

// manage user
// 백엔드 NotApprovedMemberManagementDto (GET /members/unapproved의 한 줄)
export interface newUserInterface {
  name: string;
  memberId: number;
  studentId: string;
  phoneNumber: string;
  email: string;
  grade: number;
  major: string;
}

// 백엔드 UpdateNameRequestDto (GET /myInfo/requests의 한 줄)
export interface changeNameUserInterface {
  id: number;
  beforeName: string;
  afterName: string;
  studentId: string;
  major: string;
  status: string;
}

// new user application
export interface applicationInterface {
  name: string;
  grade: number;
  major: string;
  studentId?: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
}

export interface applicationAnswersInterface {
  questionId: number;
  question: string;
  answer: string;
}

// staff/manage
export interface scheduleInterface {
  generation: number;
  signupStartDate: string;
  signupEndDate: string;
  interviewStartDate: string;
  interviewEndDate: string;
  resultAnnounceDate: string;
}

export interface MyBoardInterface {
  id?: number; //게시글 id
  menuId?: number; //menuId
  menuName: string;
  menuType: string;
  title: string;
  dateCreated: string;
}

export interface MySupportInterface {
  id: number;
  status: string;
  title: string;
  dateCreated: string;
  dateChecked: string;
  dateDeposited: string;
}

// PUT /myInfo/detail 요청 (백엔드 ProfileDetailDto). 바꿀 필드만 보낸다
export interface updateMyInfoDetailInterface {
  major?: string;
  grade?: number;
  phoneNumber?: string;
  type?: string;
}

// PUT /myInfo/intro 요청 (백엔드 ProfileIntroDto)
export interface updateMyInfoIntroInterface {
  introduce?: string;
  isHOF?: boolean;
}

// 백엔드 HandleNameRequestDto (PUT /myInfo/request). status는 pass 또는 fail
export interface handleNameChangeRequestInterface {
  id: number;
  status: string;
}
