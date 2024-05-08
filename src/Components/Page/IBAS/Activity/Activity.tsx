import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../../Hooks/useFetch";

import styled from "styled-components";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import Pagination from "../../../Common/Pagination";

import { useRecoilState } from "recoil";
import { totalPageInfo } from "../../../../Recoil/backState";

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

export interface activityInterface {
    id: number;
    title: string;
    writerName: string;
    dateCreated: string;
    dateUpdated: string;
    thumbnail: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    } | null;
}

const ActivityComponent = ({ imgSrc, title, dateCreated, writerName, id }: any) => {

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
                                {dateCreated?.split('T')[0]} {dateCreated?.split('T')[1]}
                            </P>
                        </Div>
                    </FlexDiv>
                </Div>
            </Article>
        </>
    )
}

const Activity = () => {
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [activityListData, fetchActivityListData] = useFetch();
    const [detail, setDetail] = useState<activityInterface[] | null>(null);

    useEffect(() => {
        fetchActivityListData('/club/activities?page=0&size=6', 'GET', 'token')
    }, [])

    useEffect(() => {
        if (activityListData) {
            setDetail(activityListData.data)
            setTotalPage(activityListData.pageInfo.totalPages)
        }
    }, [activityListData])

    const moveCreate = () => navigate("/activity/create");

    return (
        <>
            <FlexDiv width="100%">
                <FlexDiv width="75%" $justifycontent="space-between" $margin="50px 0 0 0">
                    {detail?.slice(0, 3)?.map(({thumbnail, title, dateCreated, writerName, id}) => (
                        <Div width="25%">
                            <ActivityComponent
                            imgSrc = {thumbnail?.url}
                            title = {title}
                            dateCreated = {dateCreated}
                            writerName = {writerName}
                            id = {id}
                            />
                        </Div>
                    ))}
                    {detail?.slice(0, 3).length === 2 ? (<Div width="25%"/>) : ''}
                </FlexDiv>
                <FlexDiv width="75%" $justifycontent="space-between" $margin="50px 0 0 0">
                    {detail?.slice(3, 6)?.map(({thumbnail, title, dateCreated, writerName, id}) => (
                        <Div width="25%">
                            <ActivityComponent
                            imgSrc = {thumbnail?.url}
                            title = {title}
                            dateCreated = {dateCreated}
                            writerName = {writerName}
                            id = {id}
                            />
                        </Div>
                    ))}
                    {detail?.slice(3, 6).length === 2 ? (<Div width="25%"/>) : ''}
                </FlexDiv>
                <Pagination
                    totalPage={totalPage}
                    fetchUrl='/club/activities'
                    paginationFetch={fetchActivityListData}
                    size={6}
                />
                <FlexDiv $margin="50px 0" width="75%" $justifycontent="end">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
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
            </FlexDiv>
        </>
    );
};

export default Activity;