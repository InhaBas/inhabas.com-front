import { useNavigate } from "react-router-dom";

import { theme } from "../../styles/theme";

import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

type NavigateTableProp = {
    url?: string;
    header?: string[];
    width: number[];
    contents: any[];
    pinnedContents?: any[];
};

// navigate url, headerInfo, widthList, contents를 props로 받아올 것
// contents 에서 첫 요소는 idx + 1을, 두번째 요소는 데이터 id 값을, 3번째 요소는 title을 받아와야 함
const NavigateTable = (props: NavigateTableProp) => {
    const { contents, url, width, header, pinnedContents } = props;
    const navigate = useNavigate();

    const movePage = (url: string, idx: number) => {
        navigate(`${url}/${idx}`);
    };

    return (
        <Div width="100%">
            <FlexDiv
                width="100%"
                height="45px"
                $borderT={`1px solid ${theme.color.grey1}`}
                $borderB={`1px solid ${theme.color.grey1}`}
                $justifycontent="space-between"
                $padding="0 18px"
            >
                {header &&
                    header.map((item: string, idx: number) => (
                        <FlexDiv
                            key={`headerInfo${idx}`}
                            width={width && `${width[idx]}px`}
                            // $justifycontent={idx === 2 ? "start" : "center"}
                            $margin={idx === 0 ? "0 10px 0 0" : "0"}
                        >
                            <Div>
                                <P fontWeight={idx === 0 ? 800 : 500} color={idx === 0 ? "grey3" : "bk"}>
                                    {item}
                                </P>
                            </Div>
                        </FlexDiv>
                    ))}
            </FlexDiv>
            {pinnedContents &&
                pinnedContents.map((element: object, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $padding="0 18px"
                        style={{ backgroundColor: "#fff7e4" }}
                    >
                        <FlexDiv width={width && `${width[0]}px`} $margin="0 10px 0 0">
                            <Div width="17px" height="17px">
                                <Img src="/images/tack_grey.svg" />
                            </Div>
                        </FlexDiv>
                        {Object.entries(element).map(([key, value], idx) => (
                            <FlexDiv
                                key={`itemValue${idx}`}
                                width={width && `${width[idx + 1]}px`}
                                $justifycontent={idx === 1 ? "start" : "center"}
                                onClick={() => url && idx === 2 && movePage(url, (element as { id: number }).id)}
                                $pointer={url && idx === 1 ? true : false}
                            >
                                <Div>
                                    {key !== "id" && (
                                        <A
                                            $hoverColor={idx === 1 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                            fontWeight={idx === 1 ? 700 : idx === 0 ? 900 : 500}
                                            color={idx === 0 ? "grey3" : "bk"}
                                        >
                                            {value}
                                        </A>
                                    )}
                                </Div>
                            </FlexDiv>
                        ))}
                    </FlexDiv>
                ))}
            {contents.length !== 0 ? (
                contents.map((element: object, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $padding="0 18px"
                        $backgroundColor="wh"
                    >
                        {Object.entries(element).map(([key, value], idx) => (
                            <FlexDiv
                                key={`itemValue${idx}`}
                                width={width && `${width[idx]}px`}
                                $justifycontent={idx === 2 ? "start" : "center"}
                                onClick={() => url && idx === 2 && movePage(url, (element as { id: number }).id)}
                                $pointer={url && idx === 2 ? true : false}
                                $margin={idx === 0 ? "0 10px 0 0" : "0"}
                            >
                                <Div>
                                    {key !== "id" && (
                                        <A
                                            $hoverColor={idx === 2 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                            fontWeight={idx === 2 ? 700 : idx === 0 ? 900 : 500}
                                            color={idx === 0 ? "grey3" : "bk"}
                                        >
                                            {value}
                                        </A>
                                    )}
                                </Div>
                            </FlexDiv>
                        ))}
                    </FlexDiv>
                ))
            ) : (
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $padding="0 18px"
                    $backgroundColor="wh"
                >
                    <Div>
                        <P>게시글이 존재하지 않습니다</P>
                    </Div>
                </FlexDiv>
            )}
        </Div>
    );
};

export default NavigateTable;
