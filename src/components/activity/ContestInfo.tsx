import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { theme } from "../../styles/theme";
import styled from "styled-components";
import { media } from "../../styles/theme";

const ContestCardButton = styled(Button)`
    display: block;
    width: 100%;
    height: auto;
    max-width: 360px;
    margin: 0 auto;
    text-align: left;
`;

const ContestCard = styled.div`
    width: 360px;
    max-width: 100%;
    min-height: 600px;
    border: 1px solid ${({ theme }) => theme.color.border};
    overflow: hidden;

    &,
    * {
        box-sizing: border-box;
    }

    ${media.mobile} {
        width: 100%;
        min-height: 0;
    }
`;

const Poster = styled.div`
    width: 100%;
    aspect-ratio: 6 / 7;
    border-bottom: 1px solid ${({ theme }) => theme.color.border};

    img {
        object-fit: cover;
    }
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 180px;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const CardMain = styled.div`
    flex: 1;
    padding: 30px 10.5%;
`;

const CardLine = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    min-width: 0;

    & + & {
        margin-top: 5px;
    }

    > :last-child {
        min-width: 0;
        flex: 1;
    }
`;

const StatusRow = styled.div`
    padding: 5px 0 20px;
`;

const PeriodRow = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border-top: 1px solid ${({ theme }) => theme.color.border};

    > :last-child {
        min-width: 0;
        flex: 1;
    }
`;

const ContestInfo = ({ info }: { info: any }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const data = {
        thumbnailUrl: info?.thumbnail?.url,
        dateEnd: info?.dateContestEnd?.split("T")[0],
        dateStart: info?.dateContestStart?.split("T")[0],
        endMonth: info?.dateContestEnd?.split("T")[0]?.split("-")[1],
        endDay: info?.dateContestEnd?.split("T")[0]?.split("-")[2],
        title: info?.title,
        topic: info?.topic,
        id: info?.id,
        dday: info?.dday,
    };

    return (
        <>
            <ContestCardButton onClick={() => navigate(`/board/${url}/detail/${data?.id}`)}>
                <ContestCard>
                    {/* 사진 영역 */}
                    <Poster>
                        <Img src={data?.thumbnailUrl} width="100%" />
                    </Poster>
                    {/* 내용 영역 */}
                    <CardBody>
                        {/* 윗 내용 */}
                        <CardMain>
                            {/* 월, 제목 */}
                            <CardLine>
                                <Div>
                                    <P color="textColor" fontSize="sm" fontWeight={600} >
                                        {data?.endMonth}월
                                    </P>
                                </Div>
                                {/* <Div $margin="0 0 0 20px"> */}
                                <Div>
                                    <P fontSize="lg" fontWeight={700}>
                                        {data?.title}
                                    </P>
                                </Div>
                            </CardLine>
                            {/* 일, 내용 */}
                            <CardLine>
                                <Div>
                                    <P color="TextPrimary" fontSize="xl" fontWeight={600}>
                                        {data?.endDay}
                                    </P>
                                </Div>
                                <Div>
                                    <P color="grey">{data?.topic}</P>
                                </Div>
                            </CardLine>
                        </CardMain>
                        {/* 진행 상태 */}
                        <StatusRow>
                            <FlexDiv width="100%">
                                {data?.dday < 0 && (
                                    <Div $border="1px solid" $borderColor="grey3" $padding="3px" radius={5}>
                                        <P color="grey3" fontSize="sm">
                                            마감
                                        </P>
                                    </Div>
                                )}
                                {data?.dday > 0 && (
                                    <Div $border="1px solid" $borderColor="blue" $padding="3px" radius={5}>
                                        <P color="blue" fontSize="sm">
                                            모집중
                                        </P>
                                    </Div>
                                )}
                                {data?.dday === 0 && (
                                    <Div $border="1px solid" $borderColor="red" $padding="3px" radius={5}>
                                        <P color="red" fontSize="sm">
                                            오늘마감
                                        </P>
                                    </Div>
                                )}
                            </FlexDiv>
                        </StatusRow>
                        {/* 아랫 내용 */}
                        <PeriodRow>
                            <Div>
                                <P fontSize="sm" color="textColor">
                                    기간
                                </P>
                            </Div>
                            <Div>
                                <P
                                    fontSize="sm"
                                    color="grey"
                                    fontWeight={600}
                                >{`${data?.dateStart}~${data?.dateEnd}`}</P>
                            </Div>
                        </PeriodRow>
                    </CardBody>
                </ContestCard>
            </ContestCardButton>
        </>
    );
};

export default ContestInfo;
