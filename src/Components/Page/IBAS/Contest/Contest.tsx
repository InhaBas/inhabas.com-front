import { Div, FlexDiv } from "../../../../styles/assets/Div";

import Dropdown from "../../../Common/Dropdown";
import ContestInfo from "../../../Component/Contest/ContestInfo";

import { useRecoilState, useRecoilValue } from "recoil";
import { contestListDataInfo } from "../../../../Recoil/backState";
import { contestOrder } from "../../../../Recoil/frontState";

const Contest = () => {
    const infos = useRecoilValue(contestListDataInfo);
    const [order, setOrder] = useRecoilState(contestOrder);

    return (
        <>
            <Div width="100%" $position="relative">
                <Div $position="absolute" $top="-50px" $right="10px" width="100px">
                    <Dropdown
                        label={order === "&orderBy=ALL" ? "전체보기" : "진행중"}
                        options={["전체보기", "모집중"]}
                        value={["&orderBy=ALL", "&orderBy=DUE_DATE"]}
                        onChange={(v) => setOrder(v)}
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
                    {infos && infos?.length === 0 && <FlexDiv width="720px">게시글이 존재하지 않습니다</FlexDiv>}
                </Div>
            </Div>
        </>
    );
};

export default Contest;
