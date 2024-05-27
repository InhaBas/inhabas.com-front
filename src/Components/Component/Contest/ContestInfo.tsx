import { Div, FlexDiv } from "../../../styles/assets/Div";
import P from "../../../styles/assets/P";
import Img from "../../../styles/assets/Img";
import Button from "../../../styles/assets/Button";
import { theme } from "../../../styles/theme";
import { useLocation, useNavigate } from "react-router-dom";

const ContestInfo = ({ info }: {info: any}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const data = {
        thumbnailUrl: info?.thumbnail?.url,
        dateEnd: info?.dateContestEnd?.split('T')[0],
        dateStart: info?.dateContestStart?.split('T')[0],
        endMonth: info?.dateContestEnd?.split('T')[0]?.split('-')[1],
        endDay: info?.dateContestEnd?.split('T')[0]?.split('-')[2],
        title: info?.title,
        topic: info?.topic,
        id: info?.id,
        dday: info?.dday
    }

    return (
        <>
            {/* 추후에 width 변경 */}
            <Div width="360px" height="600px" $border="1px solid" $borderColor="border">
                {/* 사진 영역 */}
                <Div $minWidth="100%" width="100%" height="70%" $border="1px solid" $borderColor="border">
                    <Button width="100%" height="100%" onClick={() => navigate(`/board/${url}/detail/${data?.id}`)}>
                        <Img src={data?.thumbnailUrl} width='100%' />
                    </Button>
                </Div>
                {/* 내용 영역 */}
                <FlexDiv height="30%" width="100%">
                    {/* 윗 내용 */}
                    <Div height="45%" width="70%" $padding="30px 0">
                        {/* 월, 제목 */}
                        <FlexDiv width="100%" $justifycontent="flex-start">
                            <Div >
                                <P color="textColor" fontSize="sm" fontWeight={600}>{data?.endMonth}월</P>
                            </Div>
                            <Div $margin="0 0 0 20px">
                                <P fontSize="lg" fontWeight={700}>{data?.title}</P>
                            </Div>
                        </FlexDiv>
                        {/* 일, 내용 */}
                        <FlexDiv $margin="5px 0 0 3px" width="100%" $justifycontent="flex-start">
                            <Div>
                                <P color="TextPrimary" fontSize="xl" fontWeight={600}>{data?.endDay}</P>
                            </Div>
                            <Div $margin="0 0 0 23px">
                                <P color="grey">{data?.topic}</P>
                            </Div>
                        </FlexDiv>
                    </Div>
                    {/* 진행 상태 */}
                    <Div width="100%" $margin="0 0 20px 0" $padding="5px 0">
                        <FlexDiv width="39%">
                            {(data?.dday < 0) &&
                                (
                                    <Div $border="2px solid" $borderColor="red" $padding="3px" radius={5}>
                                        <P color="red" fontWeight={700}>마감</P>
                                    </Div>
                                )
                            }
                            {(data?.dday > 0) &&
                                (
                                    <Div $border="2px solid" $borderColor="blue" $padding="3px" radius={5}>
                                        <P color="blue" fontWeight={700}>모집중</P>
                                    </Div>
                                )
                            }
                            {(data?.dday === 0) &&
                                (
                                    <Div $border="2px solid" $borderColor="red" $padding="3px" radius={5}>
                                        <P color="red" fontWeight={700}>오늘마감</P>
                                    </Div>
                                )
                            }
                        </FlexDiv>
                    </Div>
                    {/* 아랫 내용 */}
                    <FlexDiv height="30%" width="100%" $borderT={`1px solid ${theme.color.border}`} $justifycontent="flex-start" $padding="15px">
                        <Div>
                            <P fontSize="sm" color="textColor">기간</P>
                        </Div>
                        <Div $margin="0 0 0 15px">
                            <P fontSize="sm" color="grey" fontWeight={600}>{`${data?.dateStart}~${data?.dateEnd}`}</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
            </Div>
        </>
    )
}

export default ContestInfo;