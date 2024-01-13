import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { styled } from "styled-components";
import { theme } from "../../../../styles/theme";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { Date, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }
`;

const BankSupportCreate = () => {
    return (
        <FlexDiv width="100%">
            <Container $alignitems="start">
                <Div width="100%" $margin="0 0 30px 0">
                    <Div $border="1px solid" $borderColor="border" radius={5} width="100%" $margin="30px 0 0 0">
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
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출날짜</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <Date width="100%" />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출 내역</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput width="100%" placeholder="지출 목적 및 사용 내역을 입력하세요." />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출 금액</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput width="100%" placeholder="정확한 지출액을 입력하세요" />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>입금받을 계좌</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput width="100%" placeholder="은행명, 계좌번호, 예금주를 입력해주세요" />
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

export default BankSupportCreate;
