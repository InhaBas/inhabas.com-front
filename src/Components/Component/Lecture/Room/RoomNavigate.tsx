import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import { lectureRoomInfo, lectureRoomTutorInfo } from "../../../../Recoil/backState";

import { useNavigate } from "react-router-dom";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

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
            <Div width="263px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
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
            </Div>

            <Div width="263px" $margin="10px 0" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
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
            </Div>
        </>
    );
};

export default BoardNavigate;
