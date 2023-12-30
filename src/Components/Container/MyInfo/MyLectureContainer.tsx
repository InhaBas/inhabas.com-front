import { theme } from "../../../styles/theme";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import P from "../../../styles/assets/P";
import Pagination from "../../Common/Pagination";
import LectureCard from "../../Component/Lecture/LectureCard";

const MyLectureContainer = () => {
    return (
        <>
            <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                <FlexDiv
                    width=" 100%"
                    $padding="20px"
                    $justifycontent="start"
                    $borderB={`1px solid ${theme.color.border}`}
                >
                    <Div>
                        <P fontWeight={600}>내가 수강 중인 강의</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $justifycontent="space-around" $padding="30px 0 0 0">
                    <LectureCard />
                    <LectureCard />
                    <LectureCard />

                    <Pagination />
                </FlexDiv>
            </Div>
        </>
    );
};

export default MyLectureContainer;
