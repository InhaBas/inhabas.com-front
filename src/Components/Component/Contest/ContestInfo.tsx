import { Div, FlexDiv } from "../../../styles/assets/Div";
import P from "../../../styles/assets/P";
import Img from "../../../styles/assets/Img";
import Button from "../../../styles/assets/Button";
import { useNavigate } from "react-router-dom";

const ContestInfo = ({ info }: {info: any}) => {

    const navigate = useNavigate();

    const data = {
        thumbnailUrl: info?.thumbnail?.url,
        dateEnd: info?.dateContestEnd?.split('T')[0],
        dateStart: info?.dateContestStart?.split('T')[0],
        endMonth: info?.dateContestEnd?.split('T')[0]?.split('-')[1],
        endDay: info?.dateContestEnd?.split('T')[0]?.split('-')[2],
        title: info?.title,
        topic: info?.topic,
        id: info?.id,
    }
    return (
        <>
            <Div width="100%" height="600px" $border="1px solid" $borderColor="border">
                    {/* 사진 영역 */}
                    <Div width="100%" height="70%" $border="1px solid" $borderColor="border">
                        <Button width="100%" height="100%" onClick={() => navigate(`/board/contest/detail/${data?.id}`)}>
                            <Img src={data?.thumbnailUrl} width='100%' height='100%' />
                        </Button>
                    </Div>
                    {/* 내용 영역 */}
                    <Div height="30%"width="100%">
                        {/* 윗 내용 */}
                        <FlexDiv height="70%" width="100%" $padding="20px" $border="1px solid" $borderColor="border">
                            {/* 마감 날짜 */}
                            <Div width="30%" height="100%" $border="1px solid" $borderColor="border">
                                <FlexDiv width="100%">
                                    <Div>
                                        <P color="blue" fontWeight={600}>{data?.endMonth}</P>
                                    </Div>
                                </FlexDiv>
                                <FlexDiv width="100%" $margin="10px 0 0 0">
                                    <Div>
                                        <P color="primary" fontSize="lg" fontWeight={800}>{data?.endDay}</P>
                                    </Div>
                                </FlexDiv>
                                <FlexDiv width="100%">
                                    <Div>
                                        <P>마감</P>
                                    </Div>
                                </FlexDiv>
                            </Div>
                            {/* 공모전 정보 */}
                            <Div width="70%" height="100%" $border="1px solid" $borderColor="border">
                                <Div width="100%">
                                    <P fontSize="md" fontWeight={700}>{data?.title}</P>
                                </Div>
                                <Div>
                                    <P>{data?.topic}</P>
                                </Div>
                                <Div>
                                    <P>마감</P>
                                </Div>
                            </Div>
                        </FlexDiv>
                        {/* 아랫 내용 */}
                        <FlexDiv height="30%" width="100%" $border="1px solid" $borderColor="border" $justifycontent="flex-start" $padding="15px">
                            <Div>
                                <P>기간</P>
                            </Div>
                            <Div $margin="0 0 0 15px">
                                <P>{`${data?.dateStart}~${data?.dateEnd}`}</P>
                            </Div>
                        </FlexDiv>
                    </Div>
                </Div>
        </>
    )
}

export default ContestInfo;