import styled from "styled-components";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Button from "../../../../styles/assets/Button";

import ChangesContent from "../../../Component/IBAS/Scholarship/ChangesContent";
import SeeMoreButton from "../../../Component/IBAS/Scholarship/SeeMoreButton";

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


            </ScholarshipSection>
        </>
    );
}

export default Scholarship;