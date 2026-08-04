import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { media } from "../../styles/theme";

const Article = styled.article`
    position: relative;
    width: 360px;
    height: 360px;
    max-width: 100%;
    overflow: hidden;
    border-radius: 10px;

    ${media.tablet} {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
    }
`;

const ArticleImg = styled(Img)`
    filter: brightness(60%);
    cursor: pointer;
    object-fit: cover;
    &:hover {
        filter: brightness(70%);
    }
`;

const CardImage = styled.div`
    width: 100%;
    height: 100%;
`;

const CardContents = styled.div`
    position: absolute;
    right: 10px;
    bottom: 20px;
    left: 10px;
    padding: 0 10px;
    color: ${({ theme }) => theme.color.wh};
    overflow-wrap: anywhere;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }
`;

const CardTitle = styled(P)`
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.35;
`;

const CardMeta = styled(FlexDiv)`
    justify-content: flex-start;
    gap: 4px;
    min-width: 0;

    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const ActivityCard = ({ imgSrc, title, dateCreated, writerName, id }: any) => {
    const navigate = useNavigate();

    const moveDetail = () => navigate(`/activity/detail/${id}`);

    return (
        <>
            <Article onClick={() => moveDetail()}>
                <CardImage>
                    <ArticleImg src={imgSrc} />
                </CardImage>
                <CardContents>
                    <Div $margin="0 0 15px 0">
                        <CardTitle color="wh" fontSize="xl" fontWeight={800}>
                            {title}
                        </CardTitle>
                    </Div>
                    <CardMeta>
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
                    </CardMeta>
                </CardContents>
            </Article>
        </>
    );
};

export default ActivityCard;
