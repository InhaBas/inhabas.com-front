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
export interface newUserInterface {
    name: string;
    memberId: number;
    studentId: number;
    phoneNumber: string;
    email: string;
    grade: number;
    major: string;
}

export interface userInterface {
    name: string;
    memberId: number;
    studentId: number;
    phoneNumber: string;
    role: string;
    generation: number;
    major: string;
    memberType: string;
}

export interface changeNameUserInterface {
    id: number;
    beforeName: string;
    afterName: string;
    studentId: number;
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
