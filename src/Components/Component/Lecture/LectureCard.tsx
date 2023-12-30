import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { theme } from "../../../styles/theme";

import { styled } from "styled-components";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const BoardTableHover = styled(FlexDiv)`
    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

const LectureCard = () => {
    const navigate = useNavigate();

    const clickEvent = (ev: MouseEvent, name: string) => {
        // const event = ev.target
        navigate("/lecture/detail");
    };
    const cardPrint = () => {
        for (let i = 0; i < 10; i++) {}
    };
    return (
        <Div $border={`1px solid ${theme.color.grey1}`}>
            <Div
                $pointer
                onClick={(e: MouseEvent) => clickEvent(e, "ss")}
                width="360px"
                height="390px"
                $border="1px solid"
                $borderColor="border"
                radius={3}
            >
                <Div width="100%" height="220px">
                    <Img src="/images/board-name-img.jpg" />
                </Div>
                <FlexDiv width="100%" height="115px" $padding="15px">
                    <FlexDiv direction="column" width="30px">
                        <Div>
                            <P fontSize="sm" color="bgColor">
                                3월
                            </P>
                        </Div>
                        <Div $margin="3px 0 0 0">
                            <P fontSize="xxl" color="grey">
                                28
                            </P>
                        </Div>
                        <Div $border="1px solid" $borderColor="red" radius={3} $padding="2px">
                            <P color="red" fontSize="xs">
                                마감
                            </P>
                        </Div>
                    </FlexDiv>
                    <Div $margin="0 0 0 10px">
                        <Div width="280px" $margin="8px 4px">
                            <P fontWeight={600} fontSize="sm">
                                R을 이용한 간단한 데이터 분석
                            </P>
                        </Div>
                        <Div width="280px" $margin="8px 4px">
                            <P color="grey4" fontSize="xs" $whiteSpace="normal">
                                R studio의 기능과 문법, tidyverse의 패키지를 배우고 iris, titanic, gapminder 등과 같은
                                데이터를 활용한 간단한 분석까지를 목표로 합니다.
                            </P>
                        </Div>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" height="55px" $borderT={`1px solid ${theme.color.border}`}>
                    <Div width="65px">
                        <Div $border="1px solid" $borderColor="grey2" radius={3} $padding="2px">
                            <P color="grey2" fontSize="xs" fontWeight={600}>
                                오프라인
                            </P>
                        </Div>
                    </Div>

                    <FlexDiv>
                        <FlexDiv width="145px">
                            <Div $margin="0 10px">
                                <P color="bgColor" fontSize="xs" fontWeight={600}>
                                    요일
                                </P>
                            </Div>
                            <Div>
                                <P color="grey2" fontSize="xs">
                                    월 화 수 목 금 토 일
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv width="90px">
                            <FlexDiv width="10px" $margin="0 5px 0 15px">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="grey2" fontSize="xs">
                                    18 / 99 명
                                </P>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>
            </Div>
        </Div>
    );
};

export default LectureCard;
