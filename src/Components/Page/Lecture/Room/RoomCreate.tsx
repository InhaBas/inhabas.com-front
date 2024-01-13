import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

import DragNDrop from "../../../Common/DragNDrop";
import TextEditor from "../../../Common/TextEditor";
import RoomNavigate from "../../../Component/Lecture/Room/RoomNavigate";
import RoomSearch from "../../../Component/Lecture/Room/RoomSearch";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
    margin: 0 50px 0 0;
`;

const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }
`;

const RoomCreate = () => {
    return (
        // <FlexDiv width="100%">

        // </FlexDiv>
        <>
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
                    <Div $alignitems="start" $padding="0">
                        <Div width="100%" $margin="0 0 30px 0">
                            <Div width="100%" $margin="0 0 30px 0">
                                <FlexDiv
                                    $padding="15px 20px"
                                    width="100%"
                                    $justifycontent="start"
                                    radius={5}
                                    $border="1px solid"
                                    $borderColor="bgColor"
                                >
                                    <Div width="25px" height="25px" $margin="0 10px 0 0">
                                        <Img src="/images/triangle-warning_purple.svg"></Img>
                                    </Div>
                                    <Div>
                                        <P color="bgColor" fontSize="sm">
                                            웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
                                        </P>
                                    </Div>
                                </FlexDiv>

                                <Div
                                    $border="1px solid"
                                    $borderColor="border"
                                    radius={5}
                                    width="100%"
                                    $margin="30px 0 0 0"
                                >
                                    <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                                        <P fontWeight={600}>공지사항</P>
                                    </Div>
                                    <Div width="100%" $padding="20px">
                                        <Div width="100%">
                                            <Div width="100%">
                                                <TitleTextInput
                                                    width="100%"
                                                    height="70px"
                                                    placeholder="제목을 입력해주세요"
                                                ></TitleTextInput>
                                            </Div>

                                            <DragNDrop />
                                        </Div>
                                        <Div width="100%">
                                            <TextEditor />
                                        </Div>
                                    </Div>
                                </Div>

                                <FlexDiv width="100%" $margin="30px 0 0 0">
                                    <Button
                                        $backgroundColor="bgColor"
                                        $HBackgroundColor="bgColorHo"
                                        $borderRadius={2}
                                        $padding="15px 30px"
                                        width="400px"
                                    >
                                        <P color="wh">작성하기</P>
                                    </Button>
                                </FlexDiv>
                            </Div>
                        </Div>
                    </Div>
                </Div>
            </FlexDiv>
        </>
    );
};

export default RoomCreate;
