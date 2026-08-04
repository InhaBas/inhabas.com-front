import styled from "styled-components";
import { media, theme } from "../../styles/theme";

import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";

import Img from "../../styles/assets/Img";
import RoomNavigate from "../../components/lecture/RoomNavigate";
import RoomSearch from "../../components/lecture/RoomSearch";
import RoomTable from "../../components/lecture/RoomTable";

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

const RoomList = () => {
    return (
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
                    <FlexDiv
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
                            <FlexDiv>
                                <FlexDiv $margin="0 10px 0 0">
                                    <Img src="/images/announce_purple.svg" />
                                </FlexDiv>
                                <Div>
                                    <P fontWeight={600}>공지사항</P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <Div width="100%">
                            <RoomTable />
                        </Div>
                    </FlexDiv>

                    <FlexDiv
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
                            <FlexDiv>
                                <FlexDiv $margin="0 10px 0 0">
                                    <Img src="/images/book_purple.svg" />
                                </FlexDiv>
                                <Div>
                                    <P fontWeight={600}>강의 목록</P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <Div width="100%">
                            <RoomTable />
                        </Div>
                    </FlexDiv>

                    <FlexDiv
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
                            <FlexDiv>
                                <FlexDiv $margin="0 10px 0 0">
                                    <Img src="/images/task_purple.svg" />
                                </FlexDiv>
                                <Div>
                                    <P fontWeight={600}>과제</P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <Div width="100%">
                            <RoomTable />
                        </Div>
                    </FlexDiv>
                </RoomContent>
            </RoomLayout>
        </>
    );
};

export default RoomList;
