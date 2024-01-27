import { atom } from "recoil";
import {
    answersInterface,
    majorInterface,
    newUserInterface,
    profileInterface,
    questionnariesInterface,
    signUpInterface,
    userInterface,
} from "../Types/IBAS/TypeMember";
import { chiefInterface, policyInterface } from "../Types/TypeCommon";

//headerNav
export const headerNavInfo = atom({
    key: "headerNavInfo",
    default: {},
});

//bottom
export const chiefInfo = atom<chiefInterface | null>({
    key: "chiefInfo",
    default: null,
});

// common
export const totalPageInfo = atom({
    key: "totalPageInfo",
    default: 0,
});

export const _totalPageInfo = atom({
    key: "_totalPageInfo",
    default: 0,
});

export const tokenAccess = atom({
    key: "tokenAccess",
    default: "default",
});

export const userEmail = atom({
    key: "userEmail",
    default: "",
});

export const userImage = atom({
    key: "userImage",
    default: "",
});

export const userRole = atom({
    key: "userRole",
    default: "",
});

// policy
export const policyInfo = atom<policyInterface | null>({
    key: "policyInterface",
    default: null,
});

// myInfo
export const profileInfo = atom<profileInterface | null>({
    key: "profileInfo",
    default: null,
});

export const newUserInfo = atom<newUserInterface[]>({
    key: "newUserInfo",
    default: [],
});

export const totalNewUserInfo = atom({
    key: "totalNewUserInfo",
    default: 0,
});

export const userInfo = atom<userInterface[]>({
    key: "userInfo",
    default: [],
});

export const totalUserInfo = atom({
    key: "totalUserInfo",
    default: 0,
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
