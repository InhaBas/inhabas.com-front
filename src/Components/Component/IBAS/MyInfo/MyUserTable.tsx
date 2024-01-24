import { theme } from "../../../../styles/theme";

import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

const MyUserTable = () => {
    const widthList = [50, 100, 150, 400, 200];

    const headerInfo = ["", "이름", "학번", "학과", "역할", "기수"];
    const contents = [
        {
            idx: 1,
            name: "윤예진",
            studentNumber: "12192355",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
            role: "운영팀",
            기수: "99기",
        },
        {
            idx: 2,
            name: "윤예진",
            studentNumber: "12192355",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
            role: "운영팀",
            기수: "99기",
        },

        {
            idx: 3,
            name: "윤예진",
            studentNumber: "12192355",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
            role: "운영팀",
            기수: "99기",
        },

        {
            idx: 4,
            name: "윤예진",
            studentNumber: "12192355",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
            role: "운영팀",
            기수: "99기",
        },

        {
            idx: 5,
            name: "윤예진",
            studentNumber: "12192355",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
            role: "운영팀",
            기수: "99기",
        },
    ];
    return (
        <>
            <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                <FlexDiv width="100%" height="45px" $justifycontent="space-between" $backgroundColor="wh">
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
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
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <A $center fontWeight={idx === 0 ? 800 : 500}>
                                    {item}
                                </A>
                            </FlexDiv>
                        ))}
                    </FlexDiv>
                ))}
            </Div>
            {/* <Pagination /> */}
        </>
    );
};

export default MyUserTable;
