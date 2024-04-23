import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { boardMenuInfo } from "../../../Recoil/backState";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import P from "../../../styles/assets/P";
import { boardMenuInterface } from "../../../Types/TypeBoard";

const BoardNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const movePageEvent = (url: string) => {
        navigate(`${url}`);
    };

    const [menu, setMenu] = useRecoilState<boardMenuInterface[]>(boardMenuInfo);
    const [menuData, fetchMenuData] = useFetch();

    useEffect(() => {
        if (url === "alpha" || url === "beta") {
            fetchMenuData("/project/count", "GET", "token");
        } else if (url === "contest" || url === "activity") {
            fetchMenuData("/contest/count", "GET", "token");
        } else {
            fetchMenuData("/board/count", "GET", "token");
        }
    }, []);

    // api 바뀌면 url 요소 추가하기
    useEffect(() => {
        if (menuData) {
            const contents = Object.values(menuData).map((item: any) => ({
                menuName: item.menuName,
                count: item.count,
                url: item.type === "STORAGE" ? "/board/opensource" : `/board/${item.type.toLowerCase()}`,
            }));
            setMenu(contents);
        }
        return () => setMenu([]);
    }, [menuData]);

    return (
        <>
            <Div width="263px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시판
                    </P>
                </Div>

                <Div width="100%">
                    {menu &&
                        menu.map((item: any, idx: number) => {
                            return (
                                <Div key={idx} width="100%">
                                    <FlexDiv
                                        width="100%"
                                        $padding="15px 0"
                                        $justifycontent="space-between"
                                        $borderT={idx !== 0 ? `1px dashed ${theme.color.border}` : "none"}
                                        onClick={() => movePageEvent(item.url)}
                                        $pointer
                                    >
                                        <Div>
                                            <P color="grey" fontSize="sm" fontWeight={400}>
                                                {item.menuName}
                                            </P>
                                        </Div>
                                        <Div>
                                            <P color="grey" fontSize="sm" fontWeight={400}>
                                                ({item.count})
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </Div>
                            );
                        })}
                </Div>
            </Div>
        </>
    );
};

export default BoardNavigate;
