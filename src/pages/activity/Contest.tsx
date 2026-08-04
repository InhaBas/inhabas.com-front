import { Div, FlexDiv } from "../../styles/assets/Div";

import Dropdown from "../../components/common/Dropdown";
import ContestInfo from "../../components/activity/ContestInfo";

import { useRecoilState, useRecoilValue } from "recoil";
import { contestListDataInfo } from "../../recoil/backState";
import { contestOrder } from "../../recoil/frontState";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import A from "../../styles/assets/A";
import Button from "../../styles/assets/Button";
import Img from "../../styles/assets/Img";

import { GetRoleAuthorization } from "../../functions/authFunctions";
import { media } from "../../styles/theme";

const ContestContainer = styled.div`
    position: relative;
    width: 100%;
    min-width: 0;

    &,
    * {
        box-sizing: border-box;
    }
`;

const ContestToolbar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: -50px 0 24px;

    ${media.tablet} {
        margin: 0 0 24px;
    }
`;

const ContestGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 360px));
    justify-content: space-between;
    gap: 50px 24px;
    width: 100%;

    ${media.tablet} {
        gap: 32px 20px;
    }

    ${media.mobile} {
        grid-template-columns: minmax(0, 1fr);
        gap: 24px;
    }
`;

const ContestAction = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin: 40px 0 10px;
`;

const Contest = () => {
    const infos = useRecoilValue(contestListDataInfo);
    const [order, setOrder] = useRecoilState(contestOrder);
    const { isAuthorizedOverBasic } = GetRoleAuthorization();

    const navigate = useNavigate();

    return (
        <ContestContainer>
                <ContestToolbar>
                    <Dropdown
                        label={order === "&orderBy=ALL" ? "전체보기" : "진행중"}
                        options={["전체보기", "모집중"]}
                        value={["&orderBy=ALL", "&orderBy=DUE_DATE"]}
                        onChange={(v) => setOrder(v)}
                        purple
                    />
                </ContestToolbar>
                {infos && infos.length > 0 ? (
                    <ContestGrid>
                        {infos.map((info: any) => (
                            <ContestInfo key={info.id} info={info} />
                        ))}
                    </ContestGrid>
                ) : (
                    <FlexDiv width="100%">게시글이 존재하지 않습니다</FlexDiv>
                )}
                {isAuthorizedOverBasic && (
                    <ContestAction>
                            <Button
                                display="flex"
                                $backgroundColor="bgColor"
                                $margin="0 10px 0 0"
                                $padding="12px 15px"
                                $borderRadius={30}
                                $HBackgroundColor="bgColorHo"
                                onClick={() => {
                                    navigate(`/board/contest/create`);
                                }}
                            >
                                <FlexDiv height="15px">
                                    <Div width="12px" height="12px" $margin="0 10px 0 0">
                                        <Img src="/images/plus_white.svg" />
                                    </Div>
                                </FlexDiv>
                                <Div $pointer height="15px">
                                    <A color="wh" fontSize="sm" $hoverColor="wh">
                                        게시글 작성
                                    </A>
                                </Div>
                            </Button>
                    </ContestAction>
                )}
        </ContestContainer>
    );
};

export default Contest;
