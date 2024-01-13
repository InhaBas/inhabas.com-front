import { theme } from "../../../../styles/theme";

import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import MyNewUserTable from "../../../Component/IBAS/MyInfo/MyNewUserTable";
import MyUserTable from "../../../Component/IBAS/MyInfo/MyUserTable";

const ManageUser = () => {
    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <Container>
                <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                    <FlexDiv
                        width=" 100%"
                        $padding="20px"
                        $justifycontent="start"
                        $borderB={`1px solid ${theme.color.border}`}
                    >
                        <FlexDiv>
                            <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div $margin="0 5px 0 0 ">
                                <P fontWeight={600}>신입부원관리 </P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    (12)
                                </P>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                        <FlexDiv width="100%" $justifycontent="space-around">
                            <MyNewUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>

                <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                    <FlexDiv
                        width=" 100%"
                        $padding="20px"
                        $justifycontent="start"
                        $borderB={`1px solid ${theme.color.border}`}
                    >
                        <FlexDiv>
                            <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div $margin="0 5px 0 0 ">
                                <P fontWeight={600}>동아리원 현황 </P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    (111)
                                </P>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                        <FlexDiv width="100%" $justifycontent="space-around">
                            <MyUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default ManageUser;
