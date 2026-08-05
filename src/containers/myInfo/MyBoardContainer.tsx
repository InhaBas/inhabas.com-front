import { theme } from "../../styles/theme";
import styled from "styled-components";

import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

import MyBoardTable from "../../components/myInfo/MyBoardTable";
import MyCommentTable from "../../components/myInfo/MyCommentTable";
import { media } from "../../styles/theme";

const TableSection = styled(FlexDiv)`
    box-sizing: border-box;
    min-width: 0;

    ${media.tablet} {
        padding: 24px !important;
    }

    ${media.mobile} {
        padding: 16px !important;
    }
`;

const MyBoardContainer = () => {
    return (
        <>
            <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                <FlexDiv
                    width=" 100%"
                    $padding="20px"
                    $justifycontent="start"
                    $borderB={`1px solid ${theme.color.border}`}
                >
                    <FlexDiv>
                        <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                            <Img src="/images/file_purple.svg" />
                        </FlexDiv>
                        <Div>
                            <P fontWeight={600}>내가 작성한 게시글</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                <TableSection width="100%" $justifycontent="space-around" $padding="30px">
                    <MyBoardTable />
                </TableSection>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                <FlexDiv
                    width=" 100%"
                    $padding="20px"
                    $justifycontent="start"
                    $borderB={`1px solid ${theme.color.border}`}
                >
                    <FlexDiv>
                        <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                            <Img src="/images/file_purple.svg" />
                        </FlexDiv>
                        <Div>
                            <P fontWeight={600}>내가 작성한 댓글</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                <TableSection width="100%" $justifycontent="space-around" $padding="30px">
                    <MyCommentTable />
                </TableSection>
            </Div>
        </>
    );
};

export default MyBoardContainer;
