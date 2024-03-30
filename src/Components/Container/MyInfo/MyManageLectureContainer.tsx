import { theme } from "../../../styles/theme";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import P from "../../../styles/assets/P";

const MyManageLectureContainer = () => {
    return (
        <>
            <Div width="100%" $border="1px solid" $borderColor="border" radius={6}>
                <FlexDiv
                    width=" 100%"
                    $padding="20px"
                    $justifycontent="start"
                    $borderB={`1px solid ${theme.color.border}`}
                >
                    <Div>
                        <P fontWeight={600}>개설 강의 관리</P>
                    </Div>
                </FlexDiv>
                {/* <FlexDiv width="100%" $justifycontent="space-around" $padding="30px 0 0 0">
                    <LectureCard />
                    <LectureCard />
                    <LectureCard /> */}

                {/* <Pagination /> */}

                <FlexDiv
                    width="100%"
                    height="80px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $padding="0 18px"
                    $backgroundColor="wh"
                >
                    <Div>
                        <P>개설한 강의가 존재하지 않습니다</P>
                    </Div>
                </FlexDiv>
                {/* </FlexDiv> */}
            </Div>
        </>
    );
};

export default MyManageLectureContainer;
