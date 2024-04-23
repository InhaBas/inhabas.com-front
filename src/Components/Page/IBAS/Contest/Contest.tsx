import { useEffect, useState } from "react";
import useFetch from "../../../../Hooks/useFetch";

import { Div, FlexDiv } from "../../../../styles/assets/Div";

import ContestInfo from "../../../Component/Contest/ContestInfo";

import { tokenAccess } from "../../../../Recoil/backState";
import { useRecoilValue } from "recoil";
import { useLocation } from "react-router-dom";

const Contest = () => {
    const [contestData, fetchContestData] = useFetch();
    const accessToken = useRecoilValue(tokenAccess);
    const [infos, setInfos] = useState([]);

    const location = useLocation();
    const url = location.pathname.split("/")[2];

    useEffect(() => {
        fetchContestData(`/contest/${url}?page=0&size=2&orderBy=DATE_CONTEST_END`, 'GET', 'token')
    }, [accessToken])

    useEffect(() => {
        if (contestData) {
            setInfos(contestData?.data)
        }
    }, [contestData])

    return (
        <>
            <Div width="100%" height="600px" $border="2px solid" $borderColor="bk">
                <FlexDiv width="100%" height="100%" $justifycontent="space-around">
                    {infos?.map((data:any) => (
                        <FlexDiv width="45%">
                            <ContestInfo info={data} />
                        </FlexDiv>
                    ))}
                </FlexDiv>
            </Div>
        </>
    )
}

export default Contest;