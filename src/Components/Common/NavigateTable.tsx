import { theme } from "../../styles/theme";

import { useNavigate } from "react-router-dom";
import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";

type NavigateTableProp = {
    url?: string;
    header: string[];
    width: number[];
    contents: any[];
};

// navigate url, headerInfo, widthList, contents를 props로 받아올 것
const NavigateTable = (props: NavigateTableProp) => {
    const { contents, url, width, header } = props;
    const navigate = useNavigate();

    const movePage = (url: string, idx: number) => {
        navigate(`${url}/${idx}`);
    };

    return (
        <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
            <FlexDiv
                width="100%"
                height="45px"
                $borderT={`1px solid ${theme.color.grey1}`}
                $justifycontent="space-between"
                $padding="0 18px"
            >
                {header &&
                    header.map((item: string, idx: number) => (
                        <FlexDiv
                            key={`headerInfo${idx}`}
                            width={width && `${width[idx]}px`}
                            $justifycontent={idx === 0 || idx === 1 ? "start" : "center"}
                        >
                            <Div>
                                <P fontWeight={idx === 0 ? 800 : 500} color={idx === 0 ? "grey3" : "bk"}>
                                    {item}
                                </P>
                            </Div>
                        </FlexDiv>
                    ))}
            </FlexDiv>
            {contents &&
                contents.map((element: object, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $padding="0 18px"
                        $backgroundColor="wh"
                    >
                        {Object.values(element).map((item, idx) => (
                            <FlexDiv
                                key={`itemValue${idx}`}
                                width={width && `${width[idx]}px`}
                                $justifycontent={idx === 0 || idx === 1 ? "start" : "center"}
                                onClick={() => url && idx === 1 && movePage(url, (element as { id: number }).id)}
                                $pointer={url && idx === 1 ? true : false}
                            >
                                <Div>
                                    <A
                                        $hoverColor={idx === 1 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                        fontWeight={idx === 1 ? 700 : idx === 0 ? 900 : 500}
                                        color={idx === 0 ? "grey3" : "bk"}
                                    >
                                        {item}
                                    </A>
                                </Div>
                            </FlexDiv>
                        ))}
                    </FlexDiv>
                ))}
        </Div>
    );
};

export default NavigateTable;
