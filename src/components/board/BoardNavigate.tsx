import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { theme } from "../../styles/theme";

import useFetch from "../../hooks/useFetch";

import { boardMenuInfo } from "../../recoil/backState";

import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";
import { boardMenuInterface } from "../../types/TypeBoard";

import { GetRoleAuthorization } from "../../functions/authFunctions";
import styled from "styled-components";
import { media } from "../../styles/theme";

const HIDDEN_BOARD_MENUS = ['질문게시판', '자유게시판', '건의사항', '회장단 게시판'];

const NavigateBox = styled(Div)`
    width: 263px;
    border: 2px solid ${theme.color.border};
    padding: 30px 20px 10px;

    ${media.tablet} {
        width: 100%;
    }

    ${media.mobile} {
        padding: 20px 16px 10px;
    }
`;

const MenuRow = styled(FlexDiv)`
    flex-wrap: nowrap;
    align-items: flex-start;
`;

const MenuName = styled(Div)`
    flex: 1 1 auto;
    min-width: 0;
    padding-right: 12px;
`;

const MenuCount = styled(Div)`
    flex: 0 0 auto;
`;

const MenuText = styled(P).attrs({ $whiteSpace: "normal" })`
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;
`;

const BoardNavigate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const url = location.pathname.split("/")[2];
    const { isAuthorizedOverSecretary } = GetRoleAuthorization();

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
            <NavigateBox>
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시판
                    </P>
                </Div>

                <Div width="100%">
                    {menu &&
                        menu.filter((item) => !HIDDEN_BOARD_MENUS.includes(item.menuName)).map((item: any, idx: number) => {
                            return (
                                <Div key={idx} width="100%">
                                    <MenuRow
                                        width="100%"
                                        $padding="15px 0"
                                        $justifycontent="space-between"
                                        $borderT={idx !== 0 ? `1px dashed ${theme.color.border}` : "none"}
                                        onClick={() => movePageEvent(item.url)}
                                        $pointer
                                    >
                                        <MenuName>
                                            <MenuText color="grey" fontSize="sm" fontWeight={400}>
                                                {item.menuName}
                                            </MenuText>
                                        </MenuName>
                                        {item.menuName !== '건의사항' && (
                                        <MenuCount>
                                            <P color="grey" fontSize="sm" fontWeight={400}>
                                                ({item.count})
                                            </P>
                                        </MenuCount>
                                        )}
                                    </MenuRow>
                                </Div>
                            );
                        })}
                </Div>
            </NavigateBox>
        </>
    );
};

export default BoardNavigate;
