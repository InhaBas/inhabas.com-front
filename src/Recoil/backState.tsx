import { atom } from "recoil";
import {
    answersInterface,
    majorInterface,
    profileInterface,
    questionnariesInterface,
    signUpInterface,
} from "../Types/IBAS/TypeMember";

//headerNav
export const headerNavInfo = atom({
    key: "headerNavInfo",
    default: {},
});

// myInfo
export const profileInfo = atom<profileInterface | null>({
    key: "profileInfo",
    default: null,
});

// IBAS
export const majorInfo = atom<majorInterface[]>({
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

export const signupCheck = atom<boolean | null>({
    key: "signupCheck",
    default: null,
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
