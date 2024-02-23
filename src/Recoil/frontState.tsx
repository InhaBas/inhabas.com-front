import { atom } from "recoil";

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

// board
export const modalInfo = atom({
    key: "modalInfoState",
    default: "",
});

export const modalOpen = atom({
    key: "modalOpenState",
    default: false,
});
