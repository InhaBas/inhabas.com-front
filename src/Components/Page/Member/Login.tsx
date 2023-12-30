import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const HrSect = styled.div`
    display: flex;
    flex-basis: 100%;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    font-size: 12px;
    margin: 8px 0px;

    &::before,
    &::after {
        content: "";
        flex-grow: 1;
        background: rgba(0, 0, 0, 0.35);
        height: 1px;
        font-size: 0px;
        line-height: 0px;
        margin: 0px 16px;
    }
`;

const KakaoButton = styled(FlexDiv)`
    background-color: #fee500;
    border: 1px solid #fee500;
`;

const NaverButton = styled(FlexDiv)`
    background-color: #03c75a;
    border: 1px solid #03c75a;
`;

const Copyright = styled(P)`
    color: rgba(0, 0, 0, 0.35);
`;

const Login = () => {
    const navigate = useNavigate();

    const moveMain = () => {
        navigate("/");
    };

    const moveLogin = (method: string) => {
        window.location.href = `https://dev.inhabas.com/api/login/oauth2/authorization/${method}`;
    };

    return (
        <>
            <FlexDiv width="100%" height="100vh">
                <FlexDiv
                    width="27%"
                    height="80%"
                    direction="column"
                    $padding="0 45px"
                    $margin="0 auto"
                    $justifycontent="space-evenly"
                >
                    <FlexDiv>
                        <FlexDiv width="150px" $margin="0 0 30px 0" $pointer onClick={() => moveMain()}>
                            <Img src="/images/ibas-main-logo_purple.png" />
                        </FlexDiv>

                        <FlexDiv width="80%">
                            <HrSect>소셜 로그인</HrSect>
                            <FlexDiv
                                $backgroundColor="wh"
                                width="250px"
                                height="40px"
                                $margin="10px 0"
                                $padding="8px"
                                $pointer
                                radius={4}
                                $border="1px solid"
                                $borderColor="grey1"
                                $justifycontent="start"
                                onClick={() => moveLogin("google")}
                            >
                                <FlexDiv width="18px" $margin="0 22px 0 0 ">
                                    <Img src="/images/google.png" />
                                </FlexDiv>
                                <FlexDiv>
                                    <Div>
                                        <P fontSize="sm">Google 계정으로 로그인</P>
                                    </Div>
                                </FlexDiv>
                            </FlexDiv>
                            <NaverButton
                                $backgroundColor="wh"
                                width="250px"
                                height="40px"
                                $margin="0 0 10px 0"
                                $padding="8px"
                                $pointer
                                radius={4}
                                $justifycontent="start"
                                $borderColor="wh"
                                onClick={() => moveLogin("naver")}
                            >
                                <FlexDiv width="16px" $margin="0 24px 0 0 ">
                                    <Img src="/images/naver.png" />
                                </FlexDiv>
                                <FlexDiv>
                                    <Div>
                                        <P fontSize="sm" color="wh">
                                            네이버 계정으로 로그인
                                        </P>
                                    </Div>
                                </FlexDiv>
                            </NaverButton>

                            <KakaoButton
                                $backgroundColor="wh"
                                width="250px"
                                height="40px"
                                $padding="8px"
                                $pointer
                                radius={4}
                                $justifycontent="start"
                                $borderColor="wh"
                                onClick={() => moveLogin("kakao")}
                            >
                                <FlexDiv width="16px" $margin="0 24px 0 0 ">
                                    <Img src="/images/kakao.svg" />
                                </FlexDiv>
                                <FlexDiv>
                                    <Div>
                                        <P fontSize="sm">카카오 계정으로 로그인</P>
                                    </Div>
                                </FlexDiv>
                            </KakaoButton>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv>
                        <Div>
                            <Copyright fontSize="xs" fontWeight={300} $lineHeight={1.3}>
                                ©INHA BAS All rights reserved.
                            </Copyright>
                        </Div>
                        <Div>
                            <Copyright fontSize="xs" fontWeight={300} $lineHeight={1.3}>
                                Developed by 양태영, 신승연, 김채림, 윤예진, 유동현
                            </Copyright>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                <Div width="73%" height="100vh" overflow="hidden">
                    <Img src="/images/member-background.jpg" />
                </Div>
            </FlexDiv>
        </>
    );
};

export default Login;
