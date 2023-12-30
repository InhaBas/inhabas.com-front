import { styled } from "styled-components"
import Button from "../../styles/assets/Button"
import { Div, FlexDiv } from "../../styles/assets/Div"
import Img from "../../styles/assets/Img"
import { TextArea } from "../../styles/assets/Input"
import P from "../../styles/assets/P"
import { theme } from "../../styles/theme"

const CommentRelativeDiv = styled(Div)`
    position: relative;
`

const CommentAbsoluteDiv = styled(Div)`
    position: absolute;
    right: 20px;
    top: 20px;
`

const CommentInput = () => {
    return (
        <>
            <Div width="100%" $padding="30px 0 0 0" $borderT={`1px solid ${theme.color.border}`}>
                <CommentRelativeDiv width="100%">
                    <TextArea
                        width="100%"
                        $padding="20px"
                        $borderRadius={30}
                        height="150px"
                        $borderColor="border"
                        placeholder="댓글을 남겨보세요!"
                    ></TextArea>

                    <CommentAbsoluteDiv width="14px" $margin="0 10px 0 0">
                        <Img src="/images/pencil_purple.svg" />
                    </CommentAbsoluteDiv>
                </CommentRelativeDiv>
            </Div>
            <FlexDiv $justifycontent="end" width="100%" $margin="30px 0 0 0">
                <Button $backgroundColor="bgColor" $borderRadius={50} $padding="20px 60px">
                    <P color="wh" fontSize="sm" $letterSpacing="1px">
                        댓글등록
                    </P>
                </Button>
            </FlexDiv>
        </>
    )
}

export default CommentInput
