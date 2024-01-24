import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { SearchInput } from "../../../styles/assets/Input";

import LectureCard from "../../Component/Lecture/LectureCard";

const LectureList = () => {
    return (
        <FlexDiv width="100%">
            <Container>
                <FlexDiv width="100%" $justifycontent="end">
                    <Div>
                        <SearchInput placeholder="검색어를 입력하세요" />
                    </Div>
                    <Button display="flex" $borderRadius={2} width="53px" height="40px" $backgroundColor="bgColor">
                        <FlexDiv width="100%" height="100%">
                            <FlexDiv width="15px">
                                <Img src="/images/search_white.svg" />
                            </FlexDiv>
                        </FlexDiv>
                    </Button>
                </FlexDiv>
                <LectureCard />
                <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px 0 0"
                        $padding="12px 15px"
                        $borderRadius={30}
                    >
                        <Div width="12px" $margin="0 10px 0 0">
                            <Img src="/images/plus_white.svg" />
                        </Div>
                        <Div $pointer>
                            <A color="wh" fontSize="sm" href="/lecture/create" $hoverColor="wh">
                                강의 개설 신청
                            </A>
                        </Div>
                    </Button>
                </FlexDiv>
                {/* <Pagination /> */}
            </Container>
        </FlexDiv>
    );
};

export default LectureList;
