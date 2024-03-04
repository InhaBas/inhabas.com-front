import { atom } from "recoil";
import { staffInterface } from "../Types/IBAS/TypeIBAS";
import {
    answersInterface,
    applicationAnswersInterface,
    applicationInterface,
    changeNameUserInterface,
    majorInterface,
    newUserInterface,
    profileInterface,
    questionnariesInterface,
    scheduleInterface,
    signUpInterface,
    userInterface,
} from "../Types/IBAS/TypeMember";
import { chiefInterface, menuInterface, policyInterface } from "../Types/TypeCommon";

//headerNav
export const headerNavInfo = atom({
    key: "headerNavInfo",
    default: {},
});

//headerTitle
export const headerTitleInfo = atom<menuInterface>({
    key: "headerTitleInfo",
    default: {
        name: "",
        description: "",
    },
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

export const __totalPageInfo = atom({
    key: "__totalPageInfo",
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

// 숫자로 role 설정하려 했으나, 직관적인 코드를 위해 string 값으로 지정
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

export const graduateUserInfo = atom<userInterface[]>({
    key: "graduateUserInfo",
    default: [],
});

export const totalGraduateUserInfo = atom({
    key: "totalGraduateUserInfo",
    default: 0,
});

export const changeNameUserInfo = atom<changeNameUserInterface[]>({
    key: "changeNameUserInfo",
    default: [],
});

export const changeNameTotalPageInfo = atom({
    key: "changeNameTotalPageInfo",
    default: 0,
});

export const applicationInfo = atom<applicationInterface | null>({
    key: "applicationInfo",
    default: null,
});

export const applicationAnswerInfo = atom<applicationAnswersInterface[] | null>({
    key: "applicationAnswerInfo",
    default: null,
});

export const scheduleInfo = atom<scheduleInterface | null>({
    key: "scheduleInfo",
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

// introduce
export const staffInfo = atom<staffInterface[] | null>({
    key: "staffInfoData",
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
