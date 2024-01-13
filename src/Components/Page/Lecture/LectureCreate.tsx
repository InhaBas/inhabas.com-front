import { theme } from "../../../styles/theme";

import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

import Button from "../../../styles/assets/Button";
import { Checkbox, Date, Label, NumberInput, Select, TextArea, TextInput } from "../../../styles/assets/Input";
import DragNDrop from "../../Common/DragNDrop";
import TextEditor from "../../Common/TextEditor";

const LectureCreate = () => {
    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <Container>
                <Div width="100%" $margin="0 0 30px 0">
                    <FlexDiv
                        width="100%"
                        $padding="20px"
                        $margin="0 0 20px 0"
                        $justifycontent="space-between"
                        $backgroundColor="bgColor"
                        $pointer
                    >
                        <FlexDiv $justifycontent="start">
                            <FlexDiv width="10px" $margin="0 10px 0 0">
                                <Img src="/images/won_white.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="wh" fontSize="sm">
                                    강의비 지급 기준
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv width="10px">
                            <Img src="/images/chevron-down_white.svg" />
                        </FlexDiv>
                    </FlexDiv>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>이름</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px" width="100%">
                            <TextInput width="100%" placeholder="이름을 입력해주세요." />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>썸네일 설명</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px" width="100%" height="200px">
                            <TextArea width="100%" height="150px" placeholder="간략한 설명을 입력해주세요. " />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>강의 소개 및 계획</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px" width="100%" height="550px">
                            <TextEditor />
                        </Div>
                    </Div>

                    <FlexDiv
                        width="100%"
                        $justifycontent="start"
                        $border="1px solid"
                        $borderColor="border"
                        $margin=" 0 0 20px 0"
                        radius={6}
                    >
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>요일</P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">월요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">화요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">수요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">목요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">금요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">토요일</P>
                            </Label>
                        </FlexDiv>
                        <FlexDiv $padding="20px">
                            <Checkbox name="days" />
                            <Label $margin="0 0 0 5px">
                                <P fontSize="sm">일요일</P>
                            </Label>
                        </FlexDiv>
                    </FlexDiv>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>강의 제한인원</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px" width="100%">
                            <NumberInput
                                width="100%"
                                placeholder="강의 제한 인원을 입력하세요. 미 작성시 수강 인원은 제한되지 않습니다.  "
                            />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>강의 방식</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <Select name="subject" required>
                                <option value="" disabled selected hidden>
                                    선택
                                </option>
                                <option>오프라인</option>
                            </Select>
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>장소</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput width="100%" placeholder="장소를 입력해주세요." />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>참고 링크</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput width="100%" placeholder="참고 링크를 입력해주세요." />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>강의 신청 마감일</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <Date width="100%" />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>대표이미지</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="0 20px" width="100%">
                            <DragNDrop />
                            <FlexDiv width="100%" $margin="20px">
                                <Div>
                                    <P color="red" fontSize="sm">
                                        두 장 이상의 사진을 첨부 할 경우 마지막 사진이 등록됩니다.
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </Div>
                    <FlexDiv width="100%">
                        <Button
                            $backgroundColor="bgColor"
                            $HBackgroundColor="bgColorHo"
                            $padding="20px 30px"
                            $borderRadius={2}
                            width="342px"
                        >
                            <P color="wh">등록하기</P>
                        </Button>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default LectureCreate;
