import { atom } from "recoil";
import { modalInterface } from "../Types/TypeCommon";

// common
export const refetch = atom({
    key: "refetch",
    default: false,
});

export const checkedList = atom({
    key: "checkedList",
    default: [] as Number[],
});

export const _checkedList = atom({
    key: "_checkedList",
    default: [] as Number[],
});

export const __checkedList = atom({
    key: "__checkedList",
    default: [] as Number[],
});

export const checkOne = atom({
    key: "checkOne",
    default: 0,
});

export const menuId = atom({
    key: "menuId",
    default: 0,
});

// headerTitle
export const menuInfo = atom({
    key: "menuInfo",
    default: 0,
});

// login
export const relogin = atom({
    key: "relogin",
    default: false,
});

export const majorSelected = atom({
    key: "majorSelected",
    default: { college: "", major: "" },
});

// modal
export const modalInfo = atom<modalInterface>({
    key: "modalInfoState",
    default: {
        type: "",
        content: "",
    },
});

export const modalOpen = atom({
    key: "modalOpenState",
    default: false,
});

// dragNdrop
export const selectedFile = atom<any[]>({
    key: "selectedFile",
    default: [],
});

// bank
export const selectedStudentInfos = atom({
    key: "selectedStudentInfos",
    default: { name: "", major: "", studentId: "" },
});

export const bankSupportRejectReasonInfo = atom({
    key: "bankSupportRejectReasonInfo",
    default: "",
});

// useFetch
export const failRefreshing = atom({
    key: "failRefreshing",
    default: false,
});

// carousel
export const carouselOpen = atom({
    key: "carouselOpenState",
    default: false,
});

export const carouselInitialState = atom({
    key: "carouselInitialState",
    default: 0,
});

// contest
export const contestOrder = atom({
    key: "contestOrder",
    default: "&orderBy=ALL",
});

// myInfo
export const myAcceptUserState = atom({
    key: "myAcceptUserState",
    default: false,
});

export const mySetGraduateState = atom({
    key: "mySetGraduateState",
    default: false,
});

export const mySetUndergraduateState = atom({
    key: "mySetUndergraduateState",
    default: false,
});
