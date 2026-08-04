import styled from "styled-components";
import { media, theme } from "../../styles/theme";

import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { TextInput } from "../../styles/assets/Input";
import P from "../../styles/assets/P";

import DragNDrop from "../../components/common/DragNDrop";
import TextEditor from "../../components/common/TextEditor";
import RoomNavigate from "../../components/lecture/RoomNavigate";
import RoomSearch from "../../components/lecture/RoomSearch";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
    margin: 0 50px 0 0;

    flex: 0 0 263px;

    ${media.tablet} {
        position: static;
        width: 100%;
        margin: 0 0 30px;
    }
`;

const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }

    ${media.mobile} {
        font-size: 20px;
    }
`;

const RoomLayout = styled(FlexDiv)`
    width: 90%;
    max-width: 90%;
    min-width: 0;

    ${media.tablet} {
        width: calc(100% - 48px);
        max-width: calc(100% - 48px);
        flex-direction: column;
    }

    ${media.mobile} {
        width: calc(100% - 32px);
        max-width: calc(100% - 32px);
    }
`;

const RoomContent = styled(Div)`
    && {
        flex: 1 1 auto;
        min-width: 0;
        width: calc(100% - 313px);

        ${media.tablet} {
            width: 100%;
        }
    }

    &,
    * {
        box-sizing: border-box;
    }

    > div {
        width: 100%;
        max-width: 100%;
        min-width: 0;
    }
`;

const PolicyNotice = styled(FlexDiv)`
    > :last-child {
        min-width: 0;
    }

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        line-height: 1.5;
    }

    ${media.mobile} {
        align-items: flex-start;
        padding: 14px 16px;
    }
`;

const SubmitButton = styled(Button)`
    width: 400px;
    max-width: 100%;

    ${media.mobile} {
        width: 100%;
    }
`;

const RoomCreate = () => {
    return (
        // <FlexDiv width="100%">

        // </FlexDiv>
        <>
            <RoomLayout $justifycontent="start" $alignitems="start">
                <StickyDiv>
                    <Div $margin="0 0 30px 0">
                        <RoomSearch />
                    </Div>

                    <Div>
                        <RoomNavigate />
                    </Div>
                </StickyDiv>
                <RoomContent width="100%">
                    <Div $alignitems="start" $padding="0">
                        <Div width="100%" $margin="0 0 30px 0">
                            <Div width="100%" $margin="0 0 30px 0">
                                <PolicyNotice
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
                                </PolicyNotice>

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
                                    <SubmitButton
                                        $backgroundColor="bgColor"
                                        $HBackgroundColor="bgColorHo"
                                        $borderRadius={2}
                                        $padding="15px 30px"
                                    >
                                        <P color="wh">작성하기</P>
                                    </SubmitButton>
                                </FlexDiv>
                            </Div>
                        </Div>
                    </Div>
                </RoomContent>
            </RoomLayout>
        </>
    );
};

export default RoomCreate;
