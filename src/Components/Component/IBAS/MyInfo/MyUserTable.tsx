import { useRecoilState, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";
import { totalUserInfo, userInfo } from "../../../../Recoil/backState";

import { useEffect } from "react";
import { userInterface } from "../../../../Types/IBAS/TypeMember";
import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

const MyUserTable = () => {
    const widthList = [50, 100, 150, 200, 200, 130, 130, 50];
    const headerInfo = ["", "이름", "학번", "학과", "전화번호", "역할", "소속", "기수"];

    const [user, fetchUser] = useFetch();
    const [userList, setUserList] = useRecoilState(userInfo);
    const setTotalUser = useSetRecoilState(totalUserInfo);

    // 역할에 대한 레이블 변환
    // 예: 비활동회원, 활동회원, ...
    const convertRoleLabel = (role: string) => {
        let roleLabel = "";
        switch (role) {
            case "CHIEF":
                roleLabel = "회장";
                break;
            case "VICE_CHIEF":
                roleLabel = "부회장";
                break;
            case "EXECUTIVES":
                roleLabel = "운영팀";
                break;
            case "SECRETARY":
                roleLabel = "총무";
                break;
            case "BASIC":
                roleLabel = "활동회원";
                break;
            case "DEACTIVATED":
                roleLabel = "비활동회원";
                break;
            default:
                roleLabel = "알 수 없음";
        }
        return roleLabel;
    };

    // 소속에 대한 레이블 변환
    // 예: 대학원생, 학부생, ...
    const convertTypeLabel = (type: string) => {
        let typeLabel = "";
        switch (type) {
            case "UNDERGRADUATE":
                typeLabel = "학부생";
                break;
            case "BACHELOR":
                typeLabel = "학사";
                break;
            case "GRADUATED":
                typeLabel = "대학원생";
                break;
            case "PROFESSOR":
                typeLabel = "교수";
                break;
            case "OTHER":
                typeLabel = "기타";
                break;
            default:
                typeLabel = "알 수 없음";
        }
        return typeLabel;
    };

    // 동아리원 현황 조회 fetch
    useEffect(() => {
        fetchUser("/members?page=0&size=10", "GET", "token");
    }, []); // 권한 바뀔 때 마다 재패치

    // fetch된 data로 동아리원 List 만들 data 가공
    useEffect(() => {
        if (user) {
            const contents = user.data.map((item: userInterface, idx: number) => ({
                id: idx + 1,
                name: item.name,
                studentId: item.studentId,
                major: item.major,
                phoneNumber: item.phoneNumber,
                role: convertRoleLabel(item.role),
                type: convertTypeLabel(item.type),
                generation: item.generation,
            }));

            setUserList(contents);
            setTotalUser(user.pageInfo.totalElements);
        }
    }, [user]);

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
                {userList &&
                    userList.map((element: object, idx: number) => (
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
