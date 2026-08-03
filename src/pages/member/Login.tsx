import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { media } from "../../styles/theme";

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

const OAuthButton = styled(FlexDiv)`
    ${media.mobile} {
        width: 100%;
        max-width: 250px;
    }
`;

const KakaoButton = styled(OAuthButton)`
    background-color: #fee500;
    border: 1px solid #fee500;
`;

const NaverButton = styled(OAuthButton)`
    background-color: #03c75a;
    border: 1px solid #03c75a;
`;

const Copyright = styled(P)`
    color: rgba(0, 0, 0, 0.35);

    ${media.mobile} {
        white-space: normal;
        overflow: visible;
        text-align: center;
        text-overflow: clip;
    }
`;

const LoginPage = styled(FlexDiv)`
    ${media.mobile} {
        height: auto;
        min-height: 100vh;
        align-items: flex-start;
    }
`;

const LoginPanel = styled(FlexDiv)`
    ${media.desktop} {
        width: max(27%, 380px);
    }

    ${media.tabletOnly} {
        width: 44%;
        padding: 0 32px;
    }

    ${media.mobile} {
        width: 100%;
        height: auto;
        min-height: 100vh;
        margin: 0;
        padding: 48px 24px 32px;
    }
`;

const LoginContent = styled(FlexDiv)`
    ${media.mobile} {
        width: 100%;
    }
`;

const LoginLogo = styled(FlexDiv)`
    ${media.mobile} {
        width: 120px;
        margin-bottom: 24px;
    }
`;

const LoginOptions = styled(FlexDiv)`
    ${media.mobile} {
        width: 100%;
        max-width: 300px;
    }
`;

const LoginBackground = styled(Div)`
    ${media.desktop} {
        width: calc(100% - max(27%, 380px));
    }

    ${media.tabletOnly} {
        width: 56%;
    }

    ${media.mobile} {
        display: none;
    }
`;

const Login = () => {
    const navigate = useNavigate();

    const moveMain = () => {
        navigate("/");
    };

    const moveLogin = (method: string) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/login/oauth2/authorization/${method}`;
    };

    return (
        <>
            <LoginPage width="100%" height="100vh">
                <LoginPanel
                    width="27%"
                    height="80%"
                    direction="column"
                    $padding="0 45px"
                    $margin="0 auto"
                    $justifycontent="space-evenly"
                >
                    <LoginContent>
                        <LoginLogo width="150px" $margin="0 0 30px 0" $pointer onClick={() => moveMain()}>
                            <Img src="/images/ibas-main-logo_purple.png" />
                        </LoginLogo>

                        <LoginOptions width="80%">
                            <HrSect>소셜 로그인</HrSect>
                            <OAuthButton
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
                            </OAuthButton>
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
                        </LoginOptions>
                    </LoginContent>
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
                </LoginPanel>
                <LoginBackground width="73%" height="100vh" overflow="hidden">
                    <Img src="/images/member-background.jpg" />
                </LoginBackground>
            </LoginPage>
        </>
    );
};

export default Login;
