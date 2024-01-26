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
