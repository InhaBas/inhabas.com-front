import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { relogin } from "../../../Recoil/frontState";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";

const MainDiv = styled(Div)`
    top: 0;
    background-image: url("/images/ibas-main-background.jpg");
    object-fit: fill;
    background-position: center center;
    background-size: cover;
    position: relative;
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
                <FlexDiv direction="column" width="100%" height="90%">
                    <Div width="350px" height="350px">
                        <LogoImg src="/images/ibas-main-logo_white.png" />
                    </Div>
                    <Div $margin="50px 0 0 0">
                        <Img src="/images/main-text.png" />
                    </Div>
                </FlexDiv>
            </MainDiv>
            {/* <Bottom /> */}
        </>
    );
};

export default Main;
