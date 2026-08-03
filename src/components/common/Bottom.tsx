import { styled } from "styled-components";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useFetch from "../../hooks/useFetch";
import { chiefInfo } from "../../recoil/backState";
import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { media } from "../../styles/theme";

const BottomDiv = styled(FlexDiv)`
    background-image: url("/images/bottom.jpg");
    object-fit: fill;
    background-position: center center;
    background-size: cover;
    position: relative;

    ${media.tablet} {
        height: auto;
    }
`;

const BottomContent = styled(FlexDiv)`
    width: 100%;
    justify-content: space-around;
    padding: 20px 0;

    ${media.tablet} {
        align-items: flex-start;
        justify-content: space-between;
        padding: 32px 24px;
    }

    ${media.mobile} {
        flex-direction: column;
        align-items: center;
        gap: 32px;
        padding: 40px 16px 32px;
    }
`;

const FooterLogo = styled(Div)`
    width: 350px;

    ${media.desktop} {
        width: 28%;
    }

    ${media.mobile} {
        width: 100%;
        max-width: 240px;
    }
`;

const ContactColumn = styled(FlexDiv)`
    width: 350px;
    height: 180px;

    ${media.desktop} {
        width: 38%;
    }

    ${media.tablet} {
        height: auto;
        gap: 14px;
    }

    ${media.mobile} {
        width: 100%;
        max-width: 360px;
        align-items: flex-start;
    }
`;

const ContactRow = styled(FlexDiv)`
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: nowrap;

    & > div:last-child {
        min-width: 0;
        white-space: normal;
    }
`;

const ContactText = styled(P)`
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    line-height: 1.5;
`;

const Terms = styled(FlexDiv)`
    width: 100%;
    padding: 20px;
    border: 1px solid ${props => props.theme.color.bk};

    ${media.mobile} {
        gap: 8px 0;
        padding: 18px 16px;
    }
`;

const Term = styled(FlexDiv)`
    white-space: normal;

    ${media.mobile} {
        justify-content: center;
    }
`;

const Credits = styled(FlexDiv)`
    height: 70px;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        text-align: center;
    }

    ${media.mobile} {
        height: auto;
        gap: 8px;
        padding: 20px 16px 28px;
    }
`;

const Bottom = () => {
    const navigate = useNavigate();
    // 정책 페이지로 이동하는 함수. 매개변수는 숫자여야 함
    const moveRule = (id: number) => {
        navigate(`/rule/${id}`);
    };

    const [chiefData, chiefFetchData] = useFetch();
    const [chief, setChief] = useRecoilState(chiefInfo);

    // 회장 정보 불러오는 api
    useEffect(() => {
        chiefFetchData("/member/chief", "GET");
    }, []);

    useEffect(() => {
        if (chiefData) {
            setChief(chiefData);
        }
    }, [chiefData]);

    return (
        <>
            <BottomDiv width="100%" height="350px">
                <BottomContent>
                    <FooterLogo>
                        <Img src="/images/logo_white.png" />
                    </FooterLogo>
                    <ContactColumn
                        direction="column"
                        $justifycontent="space-around"
                        $alignitems="start"
                    >
                        <Div>
                            <P color="wh" fontWeight={800} fontSize="lg">
                                Contact Us
                            </P>
                        </Div>
                        <ContactRow>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/user_white.svg" />
                            </Div>
                            <Div>
                                <ContactText fontSize="sm" color="wh">
                                    {chief?.name}
                                </ContactText>
                            </Div>
                        </ContactRow>
                        <ContactRow>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/location_white.svg" />
                            </Div>
                            <Div>
                                <ContactText fontSize="sm" color="wh">
                                    인하대학교 22212 인천광역시 미추홀구 인하로 100
                                </ContactText>
                            </Div>
                        </ContactRow>
                        <ContactRow>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/phone_white.svg" />
                            </Div>
                            <Div>
                                <ContactText fontSize="sm" color="wh">
                                    {chief?.phoneNumber}
                                </ContactText>
                            </Div>
                        </ContactRow>
                        <ContactRow>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/envelope_white.svg" />
                            </Div>
                            <Div>
                                <ContactText fontSize="sm" color="wh">
                                    {chief?.email}
                                </ContactText>
                            </Div>
                        </ContactRow>
                    </ContactColumn>
                    <FooterLogo>
                        <Img src="/images/inha-en-logo_white.png" />
                    </FooterLogo>
                </BottomContent>
                <Terms>
                    <Term $pointer>
                        <Div>
                            <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(1)}>
                                제3자에 관한 개인정보 이용제공 동의 약관
                            </A>
                        </Div>
                        <Div $margin="0 5px">
                            <P color="wh">·</P>
                        </Div>
                    </Term>
                    <Term $pointer>
                        <Div>
                            <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(2)}>
                                동아리 회칙
                            </A>
                        </Div>
                        <Div $margin="0 5px">
                            <P color="wh">·</P>
                        </Div>
                    </Term>
                    <Term $pointer>
                        <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(3)}>
                            홈페이지 이용약관
                        </A>
                    </Term>
                </Terms>
                <Credits direction="column" $justifycontent="space-around" $padding="20px 0 ">
                    <Div>
                        <P color="wh" fontSize="xs">
                            2021 Developed By 양태영, 신승연, 김채림, 윤예진, 유동현
                        </P>
                    </Div>
                    <Div>
                        <P color="wh" fontSize="xs">
                            2024 Developed By 조승현, 윤예진, 송민석
                        </P>
                    </Div>
                </Credits>
            </BottomDiv>
        </>
    );
};

export default Bottom;
