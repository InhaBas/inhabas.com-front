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
