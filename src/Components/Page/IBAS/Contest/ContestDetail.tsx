import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Img from "../../../../styles/assets/Img";
import { H2 } from "../../../../styles/assets/H";
import Button from "../../../../styles/assets/Button";
import A from "../../../../styles/assets/A";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../../../../Hooks/useFetch";

interface ContestDetailType {
    id: number;
    contestFieldId: number;
    title: string;
    content: string;
    writerName: string;
    association: string;
    topic: string;
    thumbnail: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    };
    images: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    }[];
    otherFiles: any[]; // 이 부분은 다른 파일의 구조를 알 수 없으므로 any로 지정했습니다.
    dateContestStart: string;
    dateContestEnd: string;
    dateCreated: string;
    dateUpdated: string;
}

const ContestDetail = () => {
    const location = useLocation();
    const contentId = location.pathname.split("/")[4];
    const [detailData, detailDataFetch] = useFetch();
    const [detail, setDetail] = useState<ContestDetailType|null>(null);

    useEffect(() => {
        detailDataFetch(`/contest/contest/${contentId}`, 'GET')
    }, [])

    useEffect(() => {
        setDetail(detailData);
        console.log(detailData)
    }, [detailData])

    return (
        <>
            {/* 컨테이너 */}
            <Div width="73%" $margin="50px 0 100px 0" direction="column">
                {/* 작성 info */}
                <FlexDiv $margin="50px 0 30px 0">
                    <FlexDiv width="12px" $margin="0 5px 0 0">
                        <Img src="/images/user_grey.svg" />
                    </FlexDiv>
                    <Div>
                        <P color="grey4" fontSize="sm">
                            By {detail?.writerName} |
                        </P>
                    </Div>
                    <FlexDiv width="12px" $margin="0 5px ">
                        <Img src="/images/calendar_grey.svg" />
                    </FlexDiv>
                    <FlexDiv>
                        <P color="grey4" fontSize="sm">
                            {detail?.dateCreated.split('T')[0]} {detail?.dateCreated.split('T')[1]}
                        </P>
                    </FlexDiv>
                </FlexDiv>

                {/* 게시글 title */}
                <Div>
                    <H2 fontSize="xxl" fontWeight={800}>
                        {detail?.title}
                    </H2>
                </Div>

                {/* 주최기관, 개최기간 */}
                <FlexDiv $padding="30px 0" width="100%" $justifycontent="flex-start">
                    <Div $margin="0 5px 0 0" width="12px">
                        <Img src="/images/building_grey.svg" />
                    </Div>
                    <Div $margin="0 5px 0 0">
                        <P color="grey4" fontSize="sm"> {detail?.association} |</P>
                    </Div>
                    <Div $margin="0 5px 0 0" width="12px">
                        <Img src="/images/calendar_grey.svg" />
                    </Div>
                    <Div>
                        <P color="grey4" fontSize="sm">{detail?.dateContestStart.split('T')[0]} ~ {detail?.dateContestEnd.split('T')[0]}</P>
                    </Div>
                </FlexDiv>
                
                {/* 공모전 주제 */}
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="20px">
                    <Div>
                        <P fontSize="xl" fontWeight={800}>공모전 주제</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="50px">
                    <Div>
                        <P fontSize="xl">{detail?.topic}</P>
                    </Div>
                </FlexDiv>

                {/* 사진들 */}
                {detail?.images?.map((image) => (
                    <Div width="100%" $margin="50px 0">
                        <Img src={image.url} />
                    </Div>
                ))}

                <Div>
                    <P>{detail?.content}</P>
                </Div>

                <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px 0 0"
                        $padding="12px 15px"
                        $borderRadius={30}
                        $HBackgroundColor="bgColorHo"
                        // onClick={() => navigate(`/board/${url}/create`)}
                    >
                        <FlexDiv height="15px">
                            <Div width="12px" height="12px" $margin="0 10px 0 0">
                                <Img src="/images/plus_white.svg" />
                            </Div>
                        </FlexDiv>
                        <Div $pointer height="15px">
                            <A color="wh" fontSize="sm" $hoverColor="wh">
                                게시글 수정
                            </A>
                        </Div>
                    </Button>
                </FlexDiv>
            </Div>
        </>
    )

}

export default ContestDetail;
