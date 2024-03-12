import styled from "styled-components";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

const ScholarshipSection = styled(Div)`
    min-height: 100vh;
`

const Scholarship = () => {
    return (
        <>
            <ScholarshipSection $position="relative" $top="73px" width="100%" $backgroundColor="bklayer">
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
            </ScholarshipSection>
        </>
    );
}

export default Scholarship;