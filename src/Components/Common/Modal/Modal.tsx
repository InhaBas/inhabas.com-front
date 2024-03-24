import { MouseEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { modalInfo, modalOpen } from "../../../Recoil/frontState";
import { FlexDiv } from "../../../styles/assets/Div";
import ModalChangeImg from "./ModalChangeImg";
import ModalChangeIntro from "./ModalChangeIntro";
import ModalChangeName from "./ModalChangeName";
import ModalChangeNumber from "./ModalChangeNumber";
import ModalChangeType from "./ModalChangeType";
import ModalHistory from "./ModalHistory";
import ModalMajor from "./ModalMajor";
import ModalBankHistoryDetail from "./ModalBankHistoryDetail";
import ModalPostBankHistory from "./ModalPostBankHistory";
import ModalUpdateBankHistory from "./ModalUpdateBankHistory";

type CustomMouseEvent = MouseEvent<HTMLElement>;

const ModalBackground = styled(FlexDiv)`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
`;

export const Modal = () => {
    const [open, setOpen] = useRecoilState(modalOpen);

    const backgroundRef = useRef<HTMLDivElement>(null);

    const modalType = useRecoilValue(modalInfo);

    const closeModal = () => {
        setOpen(false);
    };

    const clickBackground = (e: CustomMouseEvent) => {
        if (e.target === backgroundRef.current) {
            setOpen(false);
        }
    };

    return (
        <>
            {open && (
                <ModalBackground ref={backgroundRef} onClick={clickBackground}>
                    {(modalType.type === "major" && <ModalMajor />) ||
                        (modalType.type === "changeName" && <ModalChangeName />) ||
                        (modalType.type === "changeNumber" && <ModalChangeNumber />) ||
                        (modalType.type === "changeMajor" && <ModalMajor />) ||
                        (modalType.type === "changeImg" && <ModalChangeImg />) ||
                        (modalType.type === "changeIntro" && <ModalChangeIntro />) ||
                        (modalType.type === "changeType" && <ModalChangeType />) ||
                        (modalType.type === "historyPost" && <ModalHistory />) ||
                        (modalType.type === "historyPut" && <ModalHistory />) ||
                        (modalType.type === "bankHistory" && <ModalBankHistoryDetail />) ||
                        (modalType.type === "bankHistoryPost" && <ModalPostBankHistory />) ||
                        (modalType.type === "bankHistoryUpdate" && <ModalUpdateBankHistory />)
                        } ||
                </ModalBackground>
            )}
        </>
    );
};
