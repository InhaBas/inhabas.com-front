import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { relogin } from "../../recoil/frontState";

import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { media } from "../../styles/theme";

const MainDiv = styled(Div)`
    top: 0;
    background-image: url("/images/ibas-main-background.jpg");
    object-fit: fill;
    background-position: center center;
    background-size: cover;
    position: relative;

    ${media.tablet} {
        height: auto;
        min-height: 100vh;
    }
`;

const MainContent = styled(FlexDiv)`
    ${media.tablet} {
        min-height: 100vh;
        height: auto;
        padding: 100px 24px 40px;
    }

    ${media.mobile} {
        padding: 88px 16px 32px;
    }
`;

const Logo = styled(Div)`
    ${media.tablet} {
        width: 280px;
        height: 280px;
        max-width: calc(100vw - 48px);
        max-height: calc(100vw - 48px);
    }

    ${media.mobile} {
        width: 210px;
        height: 210px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vw - 32px);
    }
`;

const MainText = styled(Div)`
    ${media.tablet} {
        width: min(420px, calc(100vw - 48px));
    }

    ${media.mobile} {
        width: min(300px, calc(100vw - 32px));
        margin-top: 32px;
    }
`;

const MainTextImg = styled(Img)`
    ${media.tablet} {
        height: auto;
    }
`;

const LogoImg = styled(Img)`
    transition: all 0.7s linear;

    &:hover {
        transform: scale(1.1);
    }
`;

const Main = () => {
    const [reload, setReload] = useRecoilState(relogin);

    useEffect(() => {
        if (reload) {
            alert("로그인을 다시 시도해주세요");
            window.location.reload();
        }
        return setReload(false);
    }, [reload]);
    return (
        <>
            <MainDiv width="100%" height="100vh" direction="column">
                <MainContent direction="column" width="100%" height="90%">
                    <Logo width="350px" height="350px">
                        <LogoImg src="/images/ibas-main-logo_white.png" />
                    </Logo>
                    <MainText $margin="50px 0 0 0">
                        <MainTextImg src="/images/main-text.png" />
                    </MainText>
                </MainContent>
            </MainDiv>
            {/* <Bottom /> */}
        </>
    );
};

export default Main;
