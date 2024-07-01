import { theme } from "../../../styles/theme";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

import MyBoardTable from "../../Component/IBAS/MyInfo/MyBoardTable";
import MyCommentTable from "../../Component/IBAS/MyInfo/MyCommentTable";

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
                <FlexDiv width="100%" $justifycontent="space-around" $padding="30px">
                    <MyBoardTable />
                </FlexDiv>
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
                <FlexDiv width="100%" $justifycontent="space-around" $padding="30px">
                    <MyCommentTable />
                </FlexDiv>
            </Div>
        </>
    );
};

export default MyBoardContainer;
