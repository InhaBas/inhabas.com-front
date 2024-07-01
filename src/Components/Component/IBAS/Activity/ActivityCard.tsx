import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

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

const ActivityCard = ({ imgSrc, title, dateCreated, writerName, id }: any) => {
    const navigate = useNavigate();

    const moveDetail = () => navigate(`/activity/detail/${id}`);

    return (
        <>
            <Article onClick={() => moveDetail()}>
                <Div width="360px" height="360px" overflow="hidden" radius={10}>
                    <ArticleImg src={imgSrc} />
                </Div>
                <Div $position="absolute" $bottom="20px" $left="10px" $padding="0 10px">
                    <Div $margin="0 0 15px 0">
                        <P color="wh" fontSize="xl" fontWeight={800}>
                            {title}
                        </P>
                    </Div>
                    <FlexDiv>
                        <FlexDiv width="12px" $margin="0 3px 0 0">
                            <Img src="/images/user_white.svg" />
                        </FlexDiv>
                        <Div>
                            <P color="wh" fontSize="sm">
                                {writerName}
                            </P>
                        </Div>
                        <FlexDiv width="12px" $margin="0 5px ">
                            <Img src="/images/clock_white.svg" />
                        </FlexDiv>
                        <Div>
                            <P color="wh" fontSize="sm">
                                {dateCreated?.split("T")[0]}
                            </P>
                        </Div>
                    </FlexDiv>
                </Div>
            </Article>
        </>
    );
};

export default ActivityCard;
