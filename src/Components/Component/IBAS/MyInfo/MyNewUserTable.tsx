import { theme } from "../../../../styles/theme";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox, Select } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

import Pagination from "../../../Common/Pagination";

const MyNewUserTable = () => {
    const widthList = [50, 100, 70, 150, 170, 310, 160];

    const headerInfo = ["", "이름", "학년", "학번", "전화번호", "학과", "지원서보기"];
    const contents = [
        {
            idx: 1,
            name: "윤예진",
            grade: "1학년",
            studentId: "12192355",
            phone: "010-3398-1112",
            major: "문화콘텐츠문화경영학과스마트모빌리티",
        },
    ];
    return (
        <Div width="100%">
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                <Div width="100px" $margin="0 10px 0 0 ">
                    <Select name="subject" $borderRadius={3} required>
                        <option value="" disabled selected hidden>
                            승인여부
                        </option>
                        <option>합격</option>
                        <option>불합격</option>
                    </Select>
                </Div>
                <Button
                    $backgroundColor="bgColor"
                    $HBackgroundColor="bgColorHo"
                    $borderRadius={3}
                    $padding="6px 12px"
                    height="40px"
                >
                    <FlexDiv $margin="0 5px 0 0">
                        <FlexDiv width="15px" $margin="0 10px 0 0">
                            <Img src="/images/check_white.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P color="wh" fontSize="sm">
                                적용
                            </P>
                        </FlexDiv>
                    </FlexDiv>
                </Button>
            </FlexDiv>
            <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                <FlexDiv width="100%" height="45px" $justifycontent="space-between" $backgroundColor="wh">
                    <FlexDiv $padding="10px">
                        <Checkbox />
                    </FlexDiv>
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
                        <FlexDiv $padding="10px">
                            <Checkbox />
                        </FlexDiv>
                        {Object.values(element).map((item: any, idx: number) => (
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <A $center fontWeight={idx === 0 ? 800 : 500}>
                                    {item}
                                </A>
                            </FlexDiv>
                        ))}
                        <FlexDiv $padding="10px" $minWidth="160px">
                            <A $center color="bgColor" $hoverColor="textColor" href="/">
                                지원서보기
                            </A>
                        </FlexDiv>
                    </FlexDiv>
                ))}
            </Div>
            <Pagination />
        </Div>
    );
};

export default MyNewUserTable;
