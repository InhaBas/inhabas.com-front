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
            {/* 추후에 width 변경 */}
            <Div width="360px" height="600px" $border="1px solid" $borderColor="border">
            {/* <Div $minWidth="370px" width="100%" height="600px" $border="1px solid" $borderColor="border"> */}
                    {/* 사진 영역 */}
                    <Div $minWidth="100%" width="100%" height="70%" $border="1px solid" $borderColor="border">
                        <Button width="100%" height="100%" onClick={() => navigate(`/board/contest/detail/${data?.id}`)}>
                            <Img src={data?.thumbnailUrl} width='100%' />
                            {/* <Img src={data?.thumbnailUrl} width='100%' /> */}
                        </Button>
                    </Div>
                    {/* 내용 영역 */}
                    <Div height="30%"width="100%">
                        {/* 윗 내용 */}
                        <FlexDiv height="70%" width="100%" $padding="20px 0">
                        {/* <FlexDiv height="70%" width="100%" $padding="20px" $border="1px solid" $borderColor="border"> */}
                            {/* 마감 날짜 */}
                            <Div width="20%" height="100%" $margin="0 10px">
                            {/* <Div width="30%" height="100%" $border="1px solid" $borderColor="border"> */}
                                <FlexDiv width="100%">
                                    <Div>
                                        <P color="blue" fontSize="sm" fontWeight={600}>{data?.endMonth}월</P>
                                    </Div>
                                </FlexDiv>
                                <FlexDiv width="100%" $margin="8px 0 0 0">
                                    <Div>
                                        <P color="TextPrimary" fontSize="xl" fontWeight={800}>{data?.endDay}</P>
                                    </Div>
                                </FlexDiv>
                                <FlexDiv width="100%" $margin="5px 0 0 0">
                                    <Div $border="2px solid" $borderColor="red" $padding="3px" radius={5}>
                                        <P color="red" fontWeight={700}>마감</P>
                                    </Div>
                                </FlexDiv>
                            </Div>
                            {/* 공모전 정보 */}
                            <Div width="70%" height="100%">
                            {/* <Div width="70%" height="100%" $border="1px solid" $borderColor="border"> */}
                                <Div width="100%">
                                    <P fontSize="lg" fontWeight={700}>{data?.title}</P>
                                </Div>
                                <Div $margin="5px 0 0 0">
                                    <P color="grey">{data?.topic}</P>
                                </Div>
                            </Div>
                        </FlexDiv>
                        {/* 아랫 내용 */}
                        <FlexDiv height="30%" width="100%" $border="1px solid" $borderColor="border" $justifycontent="flex-start" $padding="15px">
                            <Div>
                                <P fontSize="sm" color="TextPrimary">기간</P>
                            </Div>
                            <Div $margin="0 0 0 15px">
                                <P fontSize="sm" color="grey" fontWeight={600}>{`${data?.dateStart}~${data?.dateEnd}`}</P>
                            </Div>
                        </FlexDiv>
                    </Div>
                </Div>
        </>
    )
}

export default ContestInfo;