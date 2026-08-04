import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { theme } from "../../styles/theme";

import { lectureRoomInfo, lectureRoomTutorInfo } from "../../recoil/backState";

import { useNavigate } from "react-router-dom";
import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";
import styled from "styled-components";
import { media } from "../../styles/theme";

const NavigateBox = styled.div`
    width: 263px;
    max-width: 100%;
    padding: 30px 20px 10px;
    border: 2px solid ${({ theme }) => theme.color.border};
    box-sizing: border-box;

    ${media.tablet} {
        width: 100%;
    }

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const BoardNavigate = () => {
    const navigate = useNavigate();
    const tempRoomMenu = [
        {
            id: 0,
            group_name: "강의실 홈",
            url: "lecture/room",
        },
        {
            id: 1,
            group_name: "공지사항",
            url: "lecture/room/announce",
        },
        {
            id: 2,
            group_name: "강의 목록",
            url: "lecture/room/lecture/list",
        },
        {
            id: 3,
            group_name: "과제 목록",
            url: "lecture/room/task/list",
        },
    ];
    const tempTutorMenu = [
        {
            id: 0,
            group_name: "출석 관리",
            url: "lecture/room/announce",
        },
        {
            id: 1,
            group_name: "과제 관리",
            url: "lecture/room/announce",
        },
        {
            id: 2,
            group_name: "수강생 관리",
            url: "lecture/room/lecture/list",
        },
        {
            id: 3,
            group_name: "종강하기",
        },
        {
            id: 3,
            group_name: "강의 삭제",
        },
    ];

    const movePageEvent = (url: string) => {
        navigate(`/${url}`);
    };

    const [menu, setMenu] = useRecoilState<any>(lectureRoomInfo);
    const [tutorMenu, setTutorMenu] = useRecoilState<any>(lectureRoomTutorInfo);

    useEffect(() => {
        setMenu(tempRoomMenu);
        setTutorMenu(tempTutorMenu);
    }, []);

    return (
        <>
            <NavigateBox>
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        강의실
                    </P>
                </Div>

                <Div width="100%">
                    {menu?.map((item: any, idx: number) => {
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
                                            {item.group_name}
                                        </P>
                                    </Div>
                                </FlexDiv>
                            </Div>
                        );
                    })}
                </Div>
            </NavigateBox>

            <NavigateBox style={{ margin: "10px 0" }}>
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        강의자 메뉴
                    </P>
                </Div>

                <Div width="100%">
                    {tutorMenu?.map((item: any, idx: number) => {
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
                                            {item.group_name}
                                        </P>
                                    </Div>
                                </FlexDiv>
                            </Div>
                        );
                    })}
                </Div>
            </NavigateBox>
        </>
    );
};

export default BoardNavigate;
