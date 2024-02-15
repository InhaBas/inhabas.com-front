import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import { headerTitleInfo, totalUserInfo } from "../../../../Recoil/backState";

import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import MyUserTable from "../../../Component/IBAS/MyInfo/MyUserTable";

const MyManageExistUser = () => {
    const navigate = useNavigate();
    const totalUser = useRecoilValue(totalUserInfo);
    const setTitle = useSetRecoilState(headerTitleInfo);

    const movePage = (url: string) => {
        navigate(url);
    };

    useEffect(() => {
        setTitle({
            name: "동아리원 관리",
            description: "동아리원을 관리 할 수 있는 페이지입니다.",
        });

        return () =>
            setTitle({
                name: "",
                description: "",
            });
    }, []);

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
                                <P fontWeight={600}>동아리원 현황 </P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    ({totalUser})
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
                            <MyUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default MyManageExistUser;
