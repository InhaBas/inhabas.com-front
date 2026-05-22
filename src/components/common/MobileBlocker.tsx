import { useState } from "react";
import styled from "styled-components";
import { media } from "../../styles/theme";

const Overlay = styled.div<{ $hidden: boolean }>`
    display: none;

    ${media.tablet} {
        display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
        position: fixed;
        inset: 0;
        z-index: 9999;
        background-color: #ffffff;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 32px;
        text-align: center;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    font-size: 20px;
    color: #7f8193;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &:hover {
        background-color: #f3eeff;
        color: #4611a7;
    }
`;

const Logo = styled.img`
    width: 140px;
`;

const Title = styled.p`
    font-size: 18px;
    font-weight: 700;
    color: #242230;
    margin: 0;
`;

const Description = styled.p`
    font-size: 14px;
    color: #7f8193;
    line-height: 1.6;
    margin: 0;
`;

const PcIcon = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #f3eeff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
`;

const MobileBlocker = () => {
    const [hidden, setHidden] = useState(false);

    return (
        <Overlay $hidden={hidden}>
            <CloseButton onClick={() => setHidden(true)} aria-label="닫기">
                ✕
            </CloseButton>
            <Logo src="/images/ibas-main-logo_purple.png" alt="IBAS 로고" />
            <PcIcon>🖥️</PcIcon>
            <Title>PC 환경에서 접속해 주세요</Title>
            <Description>
                현재 모바일 / 태블릿 환경을 준비 중입니다.
                <br />
                더 나은 서비스 제공을 위해 노력하고 있습니다.
            </Description>
        </Overlay>
    );
};

export default MobileBlocker;
