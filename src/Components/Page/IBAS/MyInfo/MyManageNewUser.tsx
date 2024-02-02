import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { theme } from "../../../../styles/theme";

import { totalNewUserInfo } from "../../../../Recoil/backState";

import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import MyNewUserTable from "../../../Component/IBAS/MyInfo/MyNewUserTable";

const MyManageNewUser = () => {
    const navigate = useNavigate();
    const totalNewUser = useRecoilValue(totalNewUserInfo);

    const movePage = (url: string) => {
        navigate(url);
    };

    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <Container>
                <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                    <FlexDiv
                        width=" 100%"
                        $padding="20px"
                        $justifycontent="space-between"
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
                                    ({totalNewUser})
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv $pointer onClick={() => movePage("/staff/member")}>
                            <P color="textColor" fontSize="xs">
                                목록으로
                            </P>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                        <FlexDiv width="100%" $justifycontent="space-around">
                            <MyNewUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default MyManageNewUser;
