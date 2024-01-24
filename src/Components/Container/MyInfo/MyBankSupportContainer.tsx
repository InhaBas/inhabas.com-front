import { theme } from "../../../styles/theme";

import A from "../../../styles/assets/A";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const MyBankSupportContainer = () => {
    const widthList = [100, 400, 100, 150, 150, 150];

    const headerInfo = ["진행상황", "신청명", "    ", "작성일", "검토일", "입금일"];
    const contents = [
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
        },
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
        },
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
        },
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
        },
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
        },
        {
            progress: "처리 완료",
            title: "AWS ec2요금",
            orignId: "1",
            writeDate: "2022-09-09",
            reviewDate: "2023-09-09",
            depositDate: "2024-09-09",
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
                            <Img src="/images/money_purple.svg" />
                        </FlexDiv>
                        <Div>
                            <P fontWeight={600}>예산신청 내역</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>

                <Div width="100%" $padding="50px">
                    <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            {headerInfo.map((item: string, idx: number) => (
                                <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                    <P fontWeight={700}>{item}</P>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        {contents.map((element: object, idx: number) => (
                            <FlexDiv
                                key={`contentItem${idx}`}
                                width="100%"
                                height="45px"
                                $borderT={`1px solid ${theme.color.grey1}`}
                                $justifycontent="space-between"
                                $backgroundColor="wh"
                            >
                                {Object.values(element).map((item: any, idx: number) => (
                                    <FlexDiv
                                        key={`itemValue${idx}`}
                                        $minWidth={`${widthList[idx]}px`}
                                        $padding="10px"
                                        $pointer={idx === 2 ? true : false}
                                    >
                                        {idx === 2 ? (
                                            <A color="bgColor" href="/bank/support/detail">
                                                원문보기 ▶
                                            </A>
                                        ) : (
                                            <A>{item}</A>
                                        )}
                                    </FlexDiv>
                                ))}
                            </FlexDiv>
                        ))}

                        {/* <Pagination /> */}
                    </Div>
                </Div>
            </Div>
        </>
    );
};

export default MyBankSupportContainer;
