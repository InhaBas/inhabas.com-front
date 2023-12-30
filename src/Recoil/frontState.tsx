import { atom } from "recoil";

//login
export const relogin = atom({
    key: "relogin",
    default: false,
});

export const tokenAccess = atom({
    key: "tokenAccess",
    default: "default",
});

export const userEmail = atom({
    key: "userEmail",
    default: "",
});

export const majorSelected = atom({
    key: "majorSelected",
    default: { college: "", major: "" },
});
//board
export const modalInfo = atom({
    key: "modalInfoState",
    // type: 어떤 모달을 렌더링 할것인지 명시
    // content: 모달의 내용
    default: {
        type: "",
        content: "",
        modalFunc: "",
    },
});

export const modalOpen = atom({
    key: "modalOpenState",
    default: false,
});

// InputFetch
export const inputPageFetch = atom({
    key: "inputPageFetch",
    default: "",
});
