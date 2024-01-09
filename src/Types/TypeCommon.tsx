// headerNav

export interface menuItem {
    menuId: number;
    priority: number;
    name: string;
    type: string;
    description: string;
    url?: string;
}

export interface ex {
    name: "조승현";
    studentId: "12171707";
    major: "컴퓨터공학과";
    grade: 1;
    email: "5177jsh@naver.com";
    phoneNumber: "010-6539-2177";
    role: "CHIEF";
    type: "UNDERGRADUATE";
    introduce: "hello"; // nullable
}
