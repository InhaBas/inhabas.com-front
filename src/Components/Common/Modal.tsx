import { MouseEvent, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { modalInfo, modalOpen } from "../../Recoil/frontState";
import { FlexDiv } from "../../styles/assets/Div";
import ModalMajor from "../Component/IBAS/Member/ModalMajor";

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

    const backgroundRef = useRef();

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
                <ModalBackground onClick={clickBackground}>
                    {(modalType === "major" && <ModalMajor />) || (modalType === "bank" && <ModalMajor />)}
                </ModalBackground>
            )}
        </>
    );
};
