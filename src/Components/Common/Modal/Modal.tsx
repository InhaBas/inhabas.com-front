import { MouseEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { modalInfo, modalOpen } from "../../../Recoil/frontState";
import { FlexDiv } from "../../../styles/assets/Div";
import ModalChangeIntro from "./ModalChangeIntro";
import ModalChangeName from "./ModalChangeName";
import ModalChangeNumber from "./ModalChangeNumber";
import ModalMajor from "./ModalMajor";

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

    const info = useRecoilValue(modalInfo);

    const modalType = info.type;

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
                    {(modalType === "major" && <ModalMajor />) ||
                        (modalType === "changeName" && <ModalChangeName />) ||
                        (modalType === "changeNumber" && <ModalChangeNumber />) ||
                        (modalType === "changeMajor" && <ModalMajor />) ||
                        (modalType === "changeIntro" && <ModalChangeIntro />)}
                </ModalBackground>
            )}
        </>
    );
};
