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
    id?: number;
    title: string;
    content?: string;
    writerId?: number;
    dateHistory: string;
    year?: string;
}
