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

// curl -X 'GET' \'https://dev.inhabas.com/api/contest/CONTEST/181'

//     {
//   "id": 181,
//   "contestFieldId": 2,
//   "title": "빅데이터",
//   "content": "stringABC",
//   "writerName": "김지성",
//   "association": "string",
//   "topic": "string",
//   "thumbnail": {
//     "id": "b98bd7bf-1e58-42da-b840-8a807d399310",
//     "name": "KakaoTalk_20240330_204240989 (1).jpg",
//     "url": "https://inhabas-bucket.s3.ap-northeast-2.amazonaws.com/CONTEST/b98bd7bf-1e58-42da-b840-8a807d399310_KakaoTalk_20240330_204240989%20%281%29.jpg",
//     "size": 61640,
//     "type": "image/jpeg"
//   },
//   "images": [
//     {
//       "id": "b98bd7bf-1e58-42da-b840-8a807d399310",
//       "name": "KakaoTalk_20240330_204240989 (1).jpg",
//       "url": "https://inhabas-bucket.s3.ap-northeast-2.amazonaws.com/CONTEST/b98bd7bf-1e58-42da-b840-8a807d399310_KakaoTalk_20240330_204240989%20%281%29.jpg",
//       "size": 61640,
//       "type": "image/jpeg"
//     }
//   ],
//   "otherFiles": [],
//   "dateContestStart": "2024-05-01T00:00:00",
//   "dateContestEnd": "2024-11-01T00:00:00",
//   "dateCreated": "2024-04-09T10:45:23",
//   "dateUpdated": "2024-04-20T01:26:55"
// }

    const location = useLocation();
    const contentId = location.pathname.split("/")[4];
    const [detailData, detailDataFetch] = useFetch();
    const [detail, setDetail] = useState<ContestDetailType|null>(null);

    useEffect(() => {
        detailDataFetch(`contest/contest/${contentId}`, 'GET', 'token')
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
                        <Img src="/images/clock_grey.svg" />
                    </FlexDiv>
                    <Div>
                        <P color="grey4" fontSize="sm">
                            작성일시
                            {/* {formatDateMinute({ date: detail?.dateCreated || "" })} */}
                        </P>
                    </Div>
                </FlexDiv>

                {/* 게시글 title */}
                <Div>
                    <H2 fontSize="xxl" fontWeight={800}>
                        게시글 title
                    </H2>
                </Div>

                {/* 주최기관, 개최기간 */}
                <FlexDiv $padding="30px 0" width="100%" $justifycontent="flex-start">
                {/* <FlexDiv $padding="30px 0" width="100%" $borderB="2px solid" $borderColor="border" $justifycontent="flex-start"> */}
                    <Div>
                        <P color="grey4" fontSize="sm">주최기관 |</P>
                    </Div>
                    <Div $margin="0 5px">
                        <P color="grey4" fontSize="sm">시작 ~ 끝</P>
                    </Div>
                </FlexDiv>
                
                {/* 공모전 주제 */}
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="20px">
                    <Div>
                        <P fontSize="lg" fontWeight={800}>공모전 주제</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="50px">
                    <Div>
                        <P fontSize="md">상세 주제</P>
                    </Div>
                </FlexDiv>

                {/* 사진들 */}

                <Div width="100%" $border="2px solid blue" $borderColor="blue" $margin="50px 0">
                    <Img src="/images/sponsor.png" />
                    <P>사진 꽉 채우기</P>
                </Div>
                <Div width="100%" height="200px" $border="2px solid blue" $borderColor="blue" $margin="50px 0">
                    <P>사진 꽉 채우기</P>
                </Div>
                <Div width="100%" height="200px" $border="2px solid blue" $borderColor="blue" $margin="50px 0">
                    <P>사진 꽉 채우기</P>
                </Div>

                <Div>
                    <P>상세설명 쭉 나열</P>
                </Div>

                <div>hi</div>
                <div>hi</div>
                <div>hi</div>
                <div>hi</div>

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
                                게시글 작성
                            </A>
                        </Div>
                    </Button>
                </FlexDiv>
            </Div>
        </>
    )

}

export default ContestDetail;
