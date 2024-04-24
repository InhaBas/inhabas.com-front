import { useEffect, useState } from "react";
import useFetch from "../../../../Hooks/useFetch";

import { Div, FlexDiv } from "../../../../styles/assets/Div";

import ContestInfo from "../../../Component/Contest/ContestInfo";

import { useRecoilValue } from "recoil";

import { contestListDataInfo } from "../../../../Recoil/backState";

const Contest = () => {
    const infos = useRecoilValue(contestListDataInfo)
    
    return (
        <>
            <Div width="100%" height="600px">
                <FlexDiv width="100%" height="100%" $justifycontent="space-around">
                    {infos && infos?.length === 2 && infos?.map((data:any) => (
                        <FlexDiv width="45%">
                            <ContestInfo info={data} />
                        </FlexDiv>
                    ))}
                    {infos && infos?.length === 1 && infos?.map((data:any) => (
                        <FlexDiv width="90%">
                            <ContestInfo info={data} />
                            <Div width="360px" />
                        </FlexDiv>
                    ))}
                </FlexDiv>
            </Div>
        </>
    )
}

export default Contest;