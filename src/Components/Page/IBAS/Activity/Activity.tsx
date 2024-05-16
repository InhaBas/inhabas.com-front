import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../../Hooks/useFetch";

import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import Pagination from "../../../Common/Pagination";
import ActivityCard from "../../../Component/IBAS/Activity/ActivityCard";

import { useRecoilState } from "recoil";
import { totalPageInfo } from "../../../../Recoil/backState";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";

import { ActivityInterface } from "../../../../Types/IBAS/TypeIBAS";

const Activity = () => {
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [activityListData, fetchActivityListData] = useFetch();
    const [detail, setDetail] = useState<ActivityInterface[] | null>(null);
    const { isAuthorizedOverSecretary } = GetRoleAuthorization();

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
                            <ActivityCard
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
                            <ActivityCard
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
                <Div width="100%" $margin="50px 0 0 0">
                    <Pagination
                        totalPage={totalPage}
                        fetchUrl='/club/activities'
                        paginationFetch={fetchActivityListData}
                        size={6}
                    />
                </Div>
                { isAuthorizedOverSecretary && (
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
                )}
            </FlexDiv>
        </>
    );
};

export default Activity;