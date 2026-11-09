// signup
export interface signUpInterface {
  name: string | null;
  major: string | null;
  phoneNumber: string | null;
  studentId: string | null;
  memberType: string | null;
  grade: number | string | null; // PROFESSOR나 특이 케이스 경우 0
}

export interface questionnariesInterface {
  id: number;
  question: string;
}

export interface answersInterface {
  questionId: number;
  content: string | null;
}

export interface majorInterface {
  id?: number;
  college: string;
  major: string;
}

// GET /signUp/check 응답. 회원가입을 마쳤으면 true
export interface signUpCheckInterface {
  check: boolean;
}

// 백엔드 ApprovedMemberManagementDto (GET /members/notGraduated의 한 줄)
export interface notGraduatedMemberInterface {
  name: string;
  memberId: number;
  studentId: string;
  phoneNumber: string;
  memberType: string;
  generation: number;
  major: string;
  role: string;
}

// 백엔드 UpdateRequestDto (PUT /members/unapproved). state는 pass 또는 fail
export interface updateUnapprovedMembersInterface {
  memberIdList: number[];
  state: string;
}

// 백엔드 UpdateRoleRequestDto (PUT /members/approved/role)
export interface updateMembersRoleInterface {
  memberIdList: number[];
  role: string;
}

// 백엔드 UpdateTypeRequestDto (PUT /members/approved/type)
export interface updateMembersTypeInterface {
  memberIdList: number[];
  type: string;
}
