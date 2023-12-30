import { theme } from "../../../styles/theme";

import A from "../../../styles/assets/A";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const MyInfoContainer = () => {
    const widthList = [150, 500, 150];

    const contents = [
        {
            title: "이름",
            content: "윤예진",
        },
        {
            title: "학번",
            content: "12192355",
        },
        {
            title: "학과",
            content: "글로벌금융학과",
        },
        {
            title: "학년",
            content: "4학년",
        },
        {
            title: "이메일",
            content: "yyj11kr@naver.com",
        },
        {
            title: "전화번호",
            content: "010-8888-8888",
        },
        {
            title: "권한",
            content: "활동회원",
        },
        {
            title: "역할",
            content: "운영팀",
        },
        {
            title: "자기소개",
            content: "아직 등록된 자기 소개가 없습니다.",
        },
    ];

    return (
        <>
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
                        <Div>
                            <P fontWeight={600}>내정보 상세보기</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                <Div width="100%" $padding="50px">
                    <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                        {contents.map((element: object, idx: number) => (
                            <FlexDiv
                                key={`contentItem${idx}`}
                                width="100%"
                                height="45px"
                                $borderT={`1px solid ${theme.color.grey1}`}
                                $justifycontent="start"
                                $backgroundColor="wh"
                            >
                                {Object.values(element).map((item: any, idx: number) => (
                                    <FlexDiv
                                        key={`itemValue${idx}`}
                                        $minWidth={`${widthList[idx]}px`}
                                        $padding="10px 40px"
                                    >
                                        <A fontWeight={idx === 0 ? 900 : 500}>{item}</A>
                                    </FlexDiv>
                                ))}
                            </FlexDiv>
                        ))}
                    </Div>

                    <FlexDiv width="100%" $margin="30px 0 0 0">
                        <FlexDiv width="20px" height="20px" $margin="0 10px 0 0">
                            <Img src="/images/check_grey.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P color="grey3" fontSize="sm">
                                회장단의 경우 권한이 이양되기 전까지 회원탈퇴를 할 수 없습니다. 회장에게 권한 이양을
                                요청하세요
                            </P>
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </Div>
        </>
    );
};

export default MyInfoContainer;
