import { MouseEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { modalInfo, modalOpen } from "../../../recoil/frontState";
import { FlexDiv } from "../../../styles/assets/Div";
import { media } from "../../../styles/theme";
import ModalBankHistoryDetail from "./ModalBankHistoryDetail";
import ModalBankSupportReject from "./ModalBankSupportReject";
import ModalChangeImg from "./ModalChangeImg";
import ModalChangeIntro from "./ModalChangeIntro";
import ModalChangeName from "./ModalChangeName";
import ModalChangeNumber from "./ModalChangeNumber";
import ModalChangeType from "./ModalChangeType";
import ModalHistory from "./ModalHistory";
import ModalMajor from "./ModalMajor";
import ModalPostBankHistory from "./ModalPostBankHistory";
import ModalScholarshipHistory from "./ModalScholarshipHistory";
import ModalUpdateBankHistory from "./ModalUpdateBankHistory";

type CustomMouseEvent = MouseEvent<HTMLElement>;

const ModalBackground = styled(FlexDiv)`
    width: 100%;
    height: 100dvh;
    position: fixed;
    inset: 0;
    box-sizing: border-box;
    padding: 24px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    overflow: auto;

    > div {
        box-sizing: border-box;
        min-width: 0;
        max-width: 100%;
        max-height: 100%;
    }

    ${media.tablet} {
        > div {
            width: min(100%, 640px) !important;
        }

        p,
        h1,
        h2,
        h3,
        label {
            white-space: normal;
            overflow-wrap: anywhere;
        }

        input,
        textarea,
        select,
        img {
            box-sizing: border-box;
            max-width: 100%;
        }
    }

    ${media.mobile} {
        padding: 16px;

        > div {
            width: 100% !important;
            max-height: calc(100dvh - 32px);
        }

    }
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
                        (modalType.type === "bankHistoryUpdate" && <ModalUpdateBankHistory />) ||
                        (modalType.type === "scholarshipPost" && <ModalScholarshipHistory />) ||
                        (modalType.type === "scholarshipUpdate" && <ModalScholarshipHistory />) ||
                        (modalType.type === "bankSupportStatus" && <ModalBankSupportReject />)}
                </ModalBackground>
            )}
        </>
    );
};
