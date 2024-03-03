import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import {
    headerTitleInfo,
    totalGraduateUserInfo,
    totalNewUserInfo,
    totalUserInfo,
    userRole,
} from "../../../../Recoil/backState";

import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import { isAuthorizedOverVice } from "../../../../Functions/authFunctions";
import MyChangeNameUserTable from "../../../Component/IBAS/MyInfo/MyChangeNameUserTable";
import MyGraduateUserTable from "../../../Component/IBAS/MyInfo/MyGraduateUserTable";
import MyNewUserTable from "../../../Component/IBAS/MyInfo/MyNewUserTable";
import MyUserTable from "../../../Component/IBAS/MyInfo/MyUserTable";

const MyManageUser = () => {
    const navigate = useNavigate();
    const totalNewUser = useRecoilValue(totalNewUserInfo);
    const totalUser = useRecoilValue(totalUserInfo);
    const totalGraduateUser = useRecoilValue(totalGraduateUserInfo);
    const role = useRecoilValue(userRole);
    const setTitle = useSetRecoilState(headerTitleInfo);

    const movePage = (url: string) => {
        navigate(url);
    };

    useEffect(() => {
        setTitle({
            name: "회원관리",
            description: "회원을 관리 할 수 있는 페이지입니다.",
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
                                <P fontWeight={600}>신입부원관리 </P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    ({totalNewUser})
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv $pointer onClick={() => movePage("newStudents")}>
                            <P color="textColor" fontSize="xs">
                                더보기
                            </P>
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
                        $justifycontent="space-between"
                        $borderB={`1px solid ${theme.color.border}`}
                    >
                        <FlexDiv>
                            <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div $margin="0 5px 0 0 ">
                                <P fontWeight={600}>동아리원 현황</P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    ({totalUser})
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv $pointer onClick={() => movePage("students")}>
                            <P color="textColor" fontSize="xs">
                                더보기
                            </P>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                        <FlexDiv width="100%" $justifycontent="space-around">
                            <MyUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>

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
                                <P fontWeight={600}>졸업생 현황</P>
                            </Div>
                            <Div>
                                <P color="red" fontSize="xs" fontWeight={800}>
                                    ({totalGraduateUser})
                                </P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv $pointer onClick={() => movePage("graduateStudents")}>
                            <P color="textColor" fontSize="xs">
                                더보기
                            </P>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                        <FlexDiv width="100%" $justifycontent="space-around">
                            <MyGraduateUserTable />
                        </FlexDiv>
                    </FlexDiv>
                </Div>

                {isAuthorizedOverVice && (
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
                                    <P fontWeight={600}>이름 수정 요청 목록</P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv width="100%" $justifycontent="start" $padding="30px">
                            <FlexDiv width="100%" $justifycontent="space-around">
                                <MyChangeNameUserTable />
                            </FlexDiv>
                        </FlexDiv>
                    </Div>
                )}
            </Container>
        </FlexDiv>
    );
};

export default MyManageUser;
