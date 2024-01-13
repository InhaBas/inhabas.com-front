import styled from "styled-components";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import { useNavigate } from "react-router-dom";
import Pagination from "../../../Common/Pagination";

const Article = styled.article`
    position: relative;
    width: 360px;
    height: 360px;
`;

const ArticleImg = styled(Img)`
    filter: brightness(60%);
    cursor: pointer;
    &:hover {
        filter: brightness(70%);
    }
`;

const Activity = () => {
    const navigate = useNavigate();

    const moveDetail = () => navigate("/activity/detail");
    const moveCreate = () => navigate("/activity/create");

    return (
        <>
            <Div width="100%" $padding="0 10%">
                <FlexDiv width="100%" $justifycontent="start" $alignitems="start">
                    <Article onClick={() => moveDetail()}>
                        <Div width="360px" height="360px" overflow="hidden" radius={10}>
                            <ArticleImg src="/images/data-an.png" />
                        </Div>
                        <Div $position="absolute" $bottom="20px" $left="10px" $padding="0 10px">
                            <Div $margin="0 0 15px 0">
                                <P color="wh" fontSize="xl" fontWeight={800}>
                                    2022-2학기 IBAS 을왕리 MT
                                </P>
                            </Div>
                            <FlexDiv>
                                <FlexDiv width="12px" $margin="0 3px 0 0">
                                    <Img src="/images/user_white.svg" />
                                </FlexDiv>
                                <Div>
                                    <P color="wh" fontSize="sm">
                                        윤예진
                                    </P>
                                </Div>
                                <FlexDiv width="12px" $margin="0 5px ">
                                    <Img src="/images/clock_white.svg" />
                                </FlexDiv>
                                <Div>
                                    <P color="wh" fontSize="sm">
                                        2022-04-03 17:02
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </Article>
                </FlexDiv>
                <FlexDiv $margin="50px 0" width="100%" $justifycontent="end">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px"
                        $padding="12px 15px"
                        $borderRadius={30}
                        $HBackgroundColor="bgColorHo"
                        onClick={() => moveCreate()}
                    >
                        <Div width="12px" $margin="0 10px 0 0">
                            <Img src="/images/plus_white.svg" />
                        </Div>
                        <Div $pointer>
                            <P color="wh" fontSize="sm">
                                게시글 등록
                            </P>
                        </Div>
                    </Button>
                </FlexDiv>
                <Pagination />
            </Div>
        </>
    );
};

export default Activity;
