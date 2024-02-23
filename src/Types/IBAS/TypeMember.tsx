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
