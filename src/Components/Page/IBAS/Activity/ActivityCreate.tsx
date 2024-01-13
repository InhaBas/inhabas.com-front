import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

import DragNDrop from "../../../Common/DragNDrop";
import TextEditor from "../../../Common/TextEditor";

const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }
`;

const ActivityCreate = () => {
    const navigate = useNavigate();
    const moveSlide = () => navigate("/slide");

    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <Container>
                <Div width="100%">
                    <Div $border="1px solid" $borderColor="border" radius={5} width="100%">
                        <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                            <P fontWeight={600}>게시글 작성</P>
                        </Div>
                        <Div width="100%" $padding="20px">
                            <Div width="100%">
                                <TitleTextInput
                                    width="100%"
                                    height="70px"
                                    placeholder="제목을 입력해주세요"
                                ></TitleTextInput>
                            </Div>

                            <DragNDrop />
                        </Div>
                        <Div width="100%" $padding="20px">
                            <TextEditor />
                        </Div>
                    </Div>

                    <FlexDiv width="100%" $margin="30px 0 0 0">
                        <Button
                            $backgroundColor="bgColor"
                            $HBackgroundColor="bgColorHo"
                            $borderRadius={2}
                            $padding="15px 30px"
                            width="400px"
                        >
                            <P color="wh">작성하기</P>
                        </Button>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default ActivityCreate;
