import { styled } from "styled-components";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useFetch from "../../Hooks/useFetch";
import { chiefInfo } from "../../Recoil/backState";
import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const BottomDiv = styled(FlexDiv)`
    background-image: url("/images/bottom.jpg");
    object-fit: fill;
    background-position: center center;
    background-size: cover;
    position: relative;
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
                <FlexDiv width="100%" $justifycontent="space-around" $padding="20px 0">
                    <Div width="350px">
                        <Img src="/images/logo_white.png" />
                    </Div>
                    <FlexDiv
                        direction="column"
                        $justifycontent="space-around"
                        $alignitems="start"
                        width="350px"
                        height="180px"
                    >
                        <Div>
                            <P color="wh" fontWeight={800} fontSize="lg">
                                Contact Us
                            </P>
                        </Div>
                        <FlexDiv>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/user_white.svg" />
                            </Div>
                            <Div>
                                <P fontSize="sm" color="wh">
                                    {chief?.name}
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/location_white.svg" />
                            </Div>
                            <Div>
                                <P fontSize="sm" color="wh">
                                    인하대학교 22212 인천광역시 미추홀구 인하로 100
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/phone_white.svg" />
                            </Div>
                            <Div>
                                <P fontSize="sm" color="wh">
                                    {chief?.phoneNumber}
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv>
                            <Div width="17px" height="15px" $margin="0 5px 0 0">
                                <Img src="/images/envelope_white.svg" />
                            </Div>
                            <Div>
                                <P fontSize="sm" color="wh">
                                    {chief?.email}
                                </P>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                    <Div width="350px">
                        <Img src="/images/inha-en-logo_white.png" />
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $padding="20px" $border="1px solid" $borderColor="bk">
                    <FlexDiv $pointer>
                        <Div>
                            <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(1)}>
                                제3자에 관한 개인정보 이용제공 동의 약관
                            </A>
                        </Div>
                        <Div $margin="0 5px">
                            <P color="wh">·</P>
                        </Div>
                    </FlexDiv>
                    <FlexDiv $pointer>
                        <Div>
                            <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(2)}>
                                동아리 회칙
                            </A>
                        </Div>
                        <Div $margin="0 5px">
                            <P color="wh">·</P>
                        </Div>
                    </FlexDiv>
                    <FlexDiv $pointer>
                        <A color="wh" fontSize="sm" $hoverColor="grey2" onClick={() => moveRule(3)}>
                            홈페이지 이용약관
                        </A>
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv direction="column" $justifycontent="space-around" $padding="20px 0 " height="70px">
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
                </FlexDiv>
            </BottomDiv>
        </>
    );
};

export default Bottom;
