import styled from "styled-components";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { DetailContainer, Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import CommentInput from "../../../Common/CommentInput";

import RoomNavigate from "../../../Component/Lecture/Room/RoomNavigate";
import RoomSearch from "../../../Component/Lecture/Room/RoomSearch";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
    margin: 0 50px 0 0;
`;

const RoomDetail = () => {
    return (
        <FlexDiv $justifycontent="start" $alignitems="start" $margin="0 5%">
            <StickyDiv>
                <Div $margin="0 0 30px 0">
                    <RoomSearch />
                </Div>

                <Div>
                    <RoomNavigate />
                </Div>
            </StickyDiv>
            <Div>
                <DetailContainer $alignitems="start">
                    <Div width="100%" $margin="0 0 30px 0">
                        <FlexDiv $margin="50px 0 30px 0">
                            <FlexDiv width="12px" $margin="0 5px 0 0">
                                <Img src="/images/user_grey.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="grey4" fontSize="sm">
                                    By 윤예진 |
                                </P>
                            </Div>
                            <FlexDiv width="12px" $margin="0 5px ">
                                <Img src="/images/clock_grey.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="grey4" fontSize="sm">
                                    2022-04-03 17:02
                                </P>
                            </Div>
                        </FlexDiv>
                        <Div>
                            <H2 fontSize="xxl" fontWeight={800}>
                                업로드 가능한 파일 제한 안내
                            </H2>
                        </Div>
                        <Div $margin="50px 0 ">
                            <P $whiteSpace="pre-wrap" $lineHeight={1.5}>
                                작성일 기준 업로드 가능한 파일 확장자는 아래와 같습니다. .xlsx .xls image/* .doc .docx
                                .ppt .pptx .txt .pdf .zip .csv 물론 과제 제출에는 .py .java 도 제출 가능합니다만, 일부는
                                기능에 따라서 이미지만 업로드 가능한 경우가 있습니다. 꼭 필요한 파일의 업로드가 제한되는
                                경우 회장단을 통해 it 부서에 문의 주시면 됩니다.
                            </P>
                        </Div>

                        <FlexDiv width="100%">
                            <FlexDiv
                                $justifycontent="start"
                                width="80%"
                                $padding="20px 30px"
                                $border="2px solid"
                                $borderColor="border"
                            >
                                <Div width="16px" $margin="0 10px 0 0">
                                    <Img src="/images/download_grey.svg" />
                                </Div>
                                <Div $pointer>
                                    <A color="grey4" fontSize="sm" $hoverColor="textColor">
                                        2022년도_2학기_베타테스터_프로젝트_팀_배분.xlsx
                                    </A>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>

                        <FlexDiv $margin="50px 0 0 0" width="100%" $justifycontent="end">
                            <Button
                                display="flex"
                                $backgroundColor="bgColor"
                                $margin="0 10px 0 0"
                                $padding="12px 15px"
                                $borderRadius={30}
                            >
                                <Div width="12px" $margin="0 10px 0 0">
                                    <Img src="/images/pencil_white.svg" />
                                </Div>
                                <Div $pointer>
                                    <P color="wh" fontSize="sm">
                                        게시글 수정
                                    </P>
                                </Div>
                            </Button>
                            <Button display="flex" $backgroundColor="red" $padding="12px 15px" $borderRadius={30}>
                                <Div width="12px" $margin="0 10px 0 0">
                                    <Img src="/images/trash_white.svg" />
                                </Div>
                                <Div $pointer>
                                    <P color="wh" fontSize="sm">
                                        게시글 삭제
                                    </P>
                                </Div>
                            </Button>
                        </FlexDiv>
                    </Div>
                    {/* <Comment></Comment> */}
                    <CommentInput></CommentInput>
                </DetailContainer>
            </Div>
        </FlexDiv>
    );
};

export default RoomDetail;
