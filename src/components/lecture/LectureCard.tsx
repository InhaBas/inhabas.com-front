import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { theme } from "../../styles/theme";

import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import styled from "styled-components";
import { media } from "../../styles/theme";

const CardList = styled.div`
    border: 1px solid ${({ theme }) => theme.color.grey1};
    max-width: 100%;
`;

const Card = styled.div`
    width: 360px;
    max-width: 100%;
    min-height: 390px;
    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;

    &,
    * {
        box-sizing: border-box;
    }

    ${media.mobile} {
        width: 100%;
    }
`;

const CardImage = styled.div`
    width: 100%;
    height: 220px;

    img {
        object-fit: cover;
    }
`;

const CardBody = styled.div`
    display: flex;
    min-height: 115px;
    padding: 15px;
`;

const DateColumn = styled.div`
    flex: 0 0 30px;
`;

const CardCopy = styled.div`
    flex: 1;
    min-width: 0;
    margin-left: 10px;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const CardFooter = styled.div`
    display: flex;
    align-items: center;
    min-height: 55px;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    padding: 8px;
    gap: 8px;

    ${media.mobile} {
        align-items: flex-start;
        flex-wrap: wrap;
    }
`;

const LectureMeta = styled.div`
    display: flex;
    flex: 1;
    min-width: 0;
    justify-content: space-between;
    gap: 8px;

    ${media.mobile} {
        flex-wrap: wrap;
    }
`;

const LectureMetaItem = styled.div`
    display: flex;
    align-items: center;
    min-width: 0;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
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
        <CardList>
            <Card
                onClick={(e: MouseEvent) => clickEvent(e, "ss")}
            >
                <CardImage>
                    <Img src="/images/board-name-img.jpg" />
                </CardImage>
                <CardBody>
                    <DateColumn>
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
                    </DateColumn>
                    <CardCopy>
                        <Div $margin="8px 4px">
                            <P fontWeight={600} fontSize="sm">
                                R을 이용한 간단한 데이터 분석
                            </P>
                        </Div>
                        <Div $margin="8px 4px">
                            <P color="grey4" fontSize="xs" $whiteSpace="normal">
                                R studio의 기능과 문법, tidyverse의 패키지를 배우고 iris, titanic, gapminder 등과 같은
                                데이터를 활용한 간단한 분석까지를 목표로 합니다.
                            </P>
                        </Div>
                    </CardCopy>
                </CardBody>
                <CardFooter>
                    <Div>
                        <Div $border="1px solid" $borderColor="grey2" radius={3} $padding="2px">
                            <P color="grey2" fontSize="xs" fontWeight={600}>
                                오프라인
                            </P>
                        </Div>
                    </Div>

                    <LectureMeta>
                        <LectureMetaItem>
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
                        </LectureMetaItem>
                        <LectureMetaItem>
                            <FlexDiv width="10px" $margin="0 5px 0 15px">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="grey2" fontSize="xs">
                                    18 / 99 명
                                </P>
                            </Div>
                        </LectureMetaItem>
                    </LectureMeta>
                </CardFooter>
            </Card>
        </CardList>
    );
};

export default LectureCard;
