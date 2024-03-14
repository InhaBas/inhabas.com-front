import styled from "styled-components";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Button from "../../../../styles/assets/Button";
import Img from "../../../../styles/assets/Img";

import ChangesContent from "../../../Component/IBAS/Scholarship/ChangesContent";
import SeeMoreButton from "../../../Component/IBAS/Scholarship/SeeMoreButton";
import ScholarshipDetailList from "../../../Component/IBAS/Scholarship/ScholarshipDetailList";

const ScholarshipSection = styled(Div)`
    min-height: 100vh;
`

// 연혁 더미데이터
const changesContent = [
    {
        year: 2022,
        contents: [
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
        ]
    },
    {
        year: 2023,
        contents: [
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
        ]
    },
    {
        year: 2023,
        contents: [
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
        ]
    },
    {
        year: 2023,
        contents: [
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
            { date: '03.08', content: 'ABCABCABCABCABCABCABC' },
        ]
    },
];

// 후원, 사용 용도 더미데이터
const supportContent = [
    {
        date: '06.05', content: '최태성 장학회, 동아리 활동비 200만원 지원'
    },
    {
        date: '06.05', content: '최태성 장학회, 동아리 활동비 200만원 지원'
    },
    {
        date: '06.05', content: '최태성 장학회, 동아리 활동비 200만원 지원'
    },
]

const Scholarship = () => {
    return (
        <>
            <ScholarshipSection $position="relative" width="100%" $backgroundColor="bk">
                {/* 배너부분 */}
                <FlexDiv $position="flex" width="100%" height="100vh" direction="column">
                    <Div $margin="0 0 0 0">
                        <P color="wh" fontWeight={600} fontSize="xxxl">
                            최태성 장학회
                        </P>
                    </Div>
                    <Div $margin="20px 0 0 0">
                        <P color="wh" fontWeight={200} fontSize="xxl">
                            최태성 장학회로부터<br/>
                        </P>
                    </Div>
                    <Div $margin="0 0 0 0">
                        {/* textAlign : center가 적용된 P가 있으면 좋을듯 */}
                        <P color="wh" fontWeight={200} fontSize="xxl">
                            인하대학교 IBAS활동 지원을 받고 있습니다.
                        </P>
                    </Div>
                </FlexDiv>

                {/* 히스토리 부분 */}
                <FlexDiv $position="flex" width="100%" height="100vh" direction="column">
                    <Div width="70%">
                        {/* 히스토리 */}
                        <Div>
                            <Div $borderT="2px solid white" $padding="5px">
                                <P fontSize="xxxl" color="wh">
                                    History
                                </P>
                            </Div>
                            <Div $margin="5px 0 0 0">
                                <P color="wh">
                                    최태성 장학회 설립 연도 및 소개글 
                                </P>
                            </Div>
                        </Div>
                    </Div>
                </FlexDiv>

                {/* 연혁 */}
                <FlexDiv $position="flex" width="100%" height="auto" direction="column">
                    <Div width="70%">
                        <Div $borderT="2px solid white" $margin="20px 0 5px 0">
                            <P fontSize="xxxl" color="wh">
                                연혁
                            </P>
                        </Div>
                        <Button>
                            <FlexDiv>
                                <SeeMoreButton></SeeMoreButton>
                            </FlexDiv>
                        </Button>
                        <Div $margin="20px 0 0 15px" $borderL="grey solid 2px">
                            <Div $position="relative" $left="-7.5px" $top="-10px">
                                {
                                    changesContent.map(({ year, contents }) => (
                                        ChangesContent({year, contents})
                                    ))
                                }
                            </Div>
                        </Div>
                        <Div $position="relative" width="0px" height="0px" $left="5.5px" $top="-15px" $borderT="20px solid grey" $borderL="10px solid transparent" $borderR="10px solid transparent"/>
                    </Div>
                </FlexDiv>

                {/* 후원내용 */}
                <FlexDiv width="100%" height="40vh" $margin="70px 0 0 0">
                    <FlexDiv width="70%" height="100%" $justifycontent="space-between">
                        {/* 왼쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" direction="column" $justifycontent="space-between">
                            <FlexDiv $left="0px" width="100%" $justifycontent="flex-between" $alignitems="flex-end">
                                {/* 타이틀 부분 */}
                                <Div $borderT="2px solid white" $left="0px">
                                    <P fontSize="xxxl" color="wh">
                                        후원내용
                                    </P>
                                </Div>
                                {/* 버튼 영역 */}
                                <FlexDiv $margin="0 0 0 20px" $justifycontent="space-between" width="240px">
                                    <Button width="56px" height="24px" $borderRadius={20} $backgroundColor="grey">
                                        <P color="wh" >
                                            2023
                                        </P>
                                    </Button>
                                    <Button width="56px" height="24px" $borderRadius={20} $backgroundColor="grey">
                                        <P color="wh">
                                            2023
                                        </P>
                                    </Button>
                                    <Button width="56px" height="24px" $borderRadius={20} $backgroundColor="grey">
                                        <P color="wh">
                                            2023
                                        </P>
                                    </Button>
                                    <Button width="56px" height="24px" $borderRadius={20} $backgroundColor="grey">
                                        <P color="wh">
                                            2023
                                        </P>
                                    </Button>
                                </FlexDiv>
                            </FlexDiv>
                            {/* 자세한 내용들 */}
                            <Div width="100%" height="65%">
                                <ScholarshipDetailList contents={supportContent}/>
                            </Div>
                            <Div width="100%">
                                <Button>
                                    <FlexDiv $justifycontent="flex-start">
                                        <SeeMoreButton></SeeMoreButton>
                                    </FlexDiv>
                                </Button>
                            </Div>
                        </FlexDiv>
                        {/* 오른쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" $border="white 2px solid">
                            {/* 사진 컨테이너 */}
                            <Div width="100%" height="100%" $border="2px solid white" $backgroundColor="wh">
                                <Img src="/images/history.jpg"></Img>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>

                {/* 장학금 사용 용도 */}
                <FlexDiv width="100%" height="40vh" $margin="50px 0 0 0">
                    <FlexDiv width="70%" height="100%" $justifycontent="space-between">
                        {/* 타이틀 부분 */}
                        <FlexDiv width="100%" $justifycontent="flex-end">
                            <FlexDiv $borderT="2px solid white" $left="0px">
                                <P fontSize="xxxl" color="wh">
                                    장학금 사용 용도
                                </P>
                            </FlexDiv>
                        </FlexDiv>
                        {/* 왼쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" $border="white 2px solid">
                            {/* 사진 컨테이너 */}
                            <Div width="100%" height="100%" $border="2px solid white" $backgroundColor="wh">
                                <Img src="/images/history.jpg"></Img>
                            </Div>
                        </FlexDiv>
                        {/* 오른쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" direction="column">
                            {/* 자세한 내용들 */}
                            <Div width="100%" height="65%" $margin="0 0 20px 0">
                                <ScholarshipDetailList contents={supportContent}/>
                            </Div>
                            <Div width="100%">
                                <Button>
                                    <FlexDiv $justifycontent="flex-start">
                                        <SeeMoreButton></SeeMoreButton>
                                    </FlexDiv>
                                </Button>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>

                {/* Thanks for 부분 */}
                <FlexDiv width="100%" height="100vh">
                    <Div width="70%">
                        <Div>
                            <Div $borderT="2px solid white" $padding="5px">
                                <P fontSize="xxxl" color="wh">
                                    Thanks for
                                </P>
                            </Div>
                            <Div $margin="5px 0 0 0">
                                <P color="wh">
                                    해당 내용 첨부
                                </P>
                            </Div>
                        </Div>
                    </Div>
                </FlexDiv>

                {/* 연락 정보 부분 */}
                <FlexDiv $position="flex" width="100%" height="100vh" direction="column">
                    <Div width="70%">
                        {/* 타이틀 부분 */}
                        <Div>
                            <Div $borderT="2px solid white" $padding="5px">
                                <P fontSize="xxxl" color="wh">
                                    How to contact
                                </P>
                            </Div>
                            <Div width="100%" $margin="5px 0 0 0">
                                <P fontSize="xxl" color="wh" $center>
                                    최태성 장학회 연락 정보
                                </P>
                            </Div>
                        </Div>
                        {/* 상세 연락 사항 부분 */}
                        <FlexDiv
                        direction="column"
                        $justifycontent="space-around"
                        $alignitems="start"
                        width="350px"
                        height="180px"
                        >
                            <FlexDiv>
                                <Div width="17px" height="15px" $margin="0 5px 0 0">
                                    <Img src="/images/user_white.svg" />
                                </Div>
                                <Div>
                                    <P fontSize="sm" color="wh">
                                        이름
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv>
                                <Div width="17px" height="15px" $margin="0 5px 0 0">
                                    <Img src="/images/location_white.svg" />
                                </Div>
                                <Div>
                                    <P fontSize="sm" color="wh">
                                        인하대학교 22212 인천광역시 미추홀구 인하로 100
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv>
                                <Div width="17px" height="15px" $margin="0 5px 0 0">
                                    <Img src="/images/phone_white.svg" />
                                </Div>
                                <Div>
                                    <P fontSize="sm" color="wh">
                                        번호
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv>
                                <Div width="17px" height="15px" $margin="0 5px 0 0">
                                    <Img src="/images/envelope_white.svg" />
                                </Div>
                                <Div>
                                    <P fontSize="sm" color="wh">
                                        이메일
                                    </P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                    </Div>
                </FlexDiv>
            </ScholarshipSection>
        </>
    );
}

export default Scholarship;