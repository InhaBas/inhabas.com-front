import { Div, FlexDiv } from "../../../../styles/assets/Div";

import ContestInfo from "../../../Component/Contest/ContestInfo";
import Dropdown from "../../../Common/Dropdown";

import { useRecoilValue } from "recoil";
import { contestListDataInfo } from "../../../../Recoil/backState";

const Contest = () => {
    const infos = useRecoilValue(contestListDataInfo)

    return (
        <>
            <Div width="100%" $position="relative">
                <Div $position="absolute" $top="-45px" $right="0px" width="100px">
                    <Dropdown
                        label="전체보기"
                        options={["전체보기", "진행중"]}
                        // value={["", ...Object?.values(bankYears)?.sort((a, b) => b-a)?.map((bankYear) => String(bankYear))]}
                        onChange={() => console.log('a')}
                        purple
                    />
                </Div>
                <Div width="100%" height="100%">
                    {infos && infos?.length === 4 && (
                        <>
                            <FlexDiv width="100%" $justifycontent="space-between">
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[0]} />
                                </FlexDiv>
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[1]} />
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv width="100%" $justifycontent="space-between" $margin="50px 0 0 0">
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[2]} />
                                </FlexDiv>
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[3]} />
                                </FlexDiv>
                            </FlexDiv>
                        </>
                    )}
                    {infos && infos?.length === 3 && (
                        <>
                            <FlexDiv width="100%" $justifycontent="space-between">
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[0]} />
                                </FlexDiv>
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[1]} />
                                </FlexDiv>
                            </FlexDiv>
                            <Div width="100%" $margin="50px 0 0 0">
                                <FlexDiv width="45%">
                                    <ContestInfo info={infos[2]} />
                                </FlexDiv>
                            </Div>
                        </>
                    )}
                    {infos && infos?.length === 2 && (
                        <FlexDiv width="100%" $justifycontent="space-between">
                            <FlexDiv width="45%">
                                <ContestInfo info={infos[0]} />
                            </FlexDiv>
                            <FlexDiv width="45%">
                                <ContestInfo info={infos[1]} />
                            </FlexDiv>
                        </FlexDiv>
                    )}
                    {infos && infos?.length === 1 && (
                        <Div width="720px">
                            <FlexDiv width="45%">
                                <ContestInfo info={infos[0]} />
                            </FlexDiv>
                        </Div>
                    )}
                </Div>
            </Div>
        </>
    )
}

export default Contest;