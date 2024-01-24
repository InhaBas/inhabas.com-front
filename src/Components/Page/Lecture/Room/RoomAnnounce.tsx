import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

import Img from "../../../../styles/assets/Img";
import RoomNavigate from "../../../Component/Lecture/Room/RoomNavigate";
import RoomSearch from "../../../Component/Lecture/Room/RoomSearch";
import RoomTable from "../../../Component/Lecture/Room/RoomTable";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
    margin: 0 50px 0 0;
`;

const RoomAnnounce = () => {
    return (
        <>
            <FlexDiv $justifycontent="start" $alignitems="start" $margin="0 5%">
                <StickyDiv $margin="0 50px 0 0">
                    <Div $margin="0 0 30px 0">
                        <RoomSearch />
                    </Div>

                    <Div>
                        <RoomNavigate />
                    </Div>
                </StickyDiv>
                <Div>
                    <FlexDiv
                        $justifycontent="start"
                        $border="1px solid"
                        $borderColor="border"
                        $margin=" 0 0 20px 0"
                        radius={6}
                    >
                        <FlexDiv
                            width="100%"
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
                            {/* <Pagination /> */}
                        </Div>
                    </FlexDiv>
                </Div>
            </FlexDiv>
        </>
    );
};

export default RoomAnnounce;
