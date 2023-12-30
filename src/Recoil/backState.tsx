import { atom } from "recoil";
import { answersInterface, questionnariesInterface, signUpInterface } from "../Types/IBAS/TypeMember";
//headerNav
export const headerNavInfo = atom({
    key: "headerNavInfo",
    default: {},
});

// IBAS
interface MajorItem {
    id?: number;
    college: string;
    major: string;
}

export const majorInfo = atom<MajorItem[]>({
    key: "majorInfo",
    default: [],
});

export const signupInfo = atom<signUpInterface | null>({
    key: "signupInfo",
    default: null,
});

export const signupQuestion = atom<questionnariesInterface[] | null>({
    key: "signupQuestion",
    default: null,
});

export const signupAnswer = atom<answersInterface[] | null>({
    key: "signupAnswer",
    default: null,
});

export const signupCheck = atom({
    key: "signupCheck",
    default: false,
});

//board
export const boardListInfo = atom({
    key: "boardListInfo",
    default: [],
});

//lectureRoom
export const lectureRoomInfo = atom({
    key: "lectureRoomInfo",
    default: [],
});

export const lectureRoomTutorInfo = atom({
    key: "lectureRoomTutorInfo",
    default: [],
});
