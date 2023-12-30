import { theme } from "../../styles/theme";

import { FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const Pagination = () => {
    return (
        <FlexDiv width="100%" $padding="20px 0">
            <FlexDiv
                width="45px"
                height="45px"
                $padding="5px"
                $margin="5px"
                radius={50}
                $backgroundColor="bgColor"
                $pointer
            >
                <FlexDiv width="10px">
                    <Img src="/images/arrow-left_white.svg" />
                </FlexDiv>
            </FlexDiv>
            <FlexDiv
                width="45px"
                height="45px"
                $padding="5px"
                $margin="5px"
                radius={50}
                $backgroundColor="bgColor"
                $pointer
            >
                <FlexDiv width="10px">
                    <P color="wh" $center fontWeight={700}>
                        1
                    </P>
                </FlexDiv>
            </FlexDiv>
            <FlexDiv
                width="45px"
                height="45px"
                $padding="5px"
                $margin="5px"
                $border={`2px solid ${theme.color.bk}`}
                radius={50}
                $pointer
            >
                <FlexDiv width="10px">
                    <P $center fontWeight={700}>
                        2
                    </P>
                </FlexDiv>
            </FlexDiv>
            <FlexDiv
                width="45px"
                height="45px"
                $padding="5px"
                $margin="5px"
                $border={`2px solid ${theme.color.bk}`}
                radius={50}
                $pointer
            >
                <FlexDiv width="10px">
                    <P $center fontWeight={700}>
                        3
                    </P>
                </FlexDiv>
            </FlexDiv>
            <FlexDiv
                width="45px"
                height="45px"
                $padding="5px"
                $margin="5px"
                radius={50}
                $backgroundColor="bgColor"
                $pointer
            >
                <FlexDiv width="10px">
                    <Img src="/images/arrow-right_white.svg" />
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default Pagination;
