import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { _totalPageInfo, tokenAccess, totalUserInfo, userInfo, userRole } from "../../../../Recoil/backState";
import { _checkedList, refetch } from "../../../../Recoil/frontState";

import { userInterface } from "../../../../Types/IBAS/TypeMember";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox, Select } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import Pagination from "../../../Common/Pagination";

const MyUserTable = () => {
    const widthList = [50, 100, 150, 200, 200, 130, 130, 50];
    const headerInfo = ["", "이름", "학번", "학과", "전화번호", "역할", "소속", "기수"];

    const [user, fetchUser] = useFetch();
    const [userList, setUserList] = useRecoilState(userInfo);
    // totalPageInfo를 같은 페이지 내에서 MyNewUserTable 이라는 컴포넌트가 쓰고 있기 때문에, _totalPageInfo을 사용함
    const [totalPage, setTotalPage] = useRecoilState(_totalPageInfo);
    const setTotalUser = useSetRecoilState(totalUserInfo);
    const role = useRecoilValue(userRole);
    // checkedList를 같은 페이지 내에서 MyNewUserTable 이라는 컴포넌트가 쓰고 있기 때문에, _checkedList를 사용함
    const [check, setCheck] = useRecoilState(_checkedList);
    const [roleValue, setRoleValue] = useState("");
    const [roleChangeData, fetchRoleChangeData] = useFetch();
    const [reload, setReload] = useRecoilState(refetch);
    const access = useRecoilValue(tokenAccess);

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

    // 체크 박스 선택
    const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
        const targetCheck = e.target.checked;
        if (targetCheck === true) {
            setCheck((prev) => [...prev, memberId]);
        } else {
            setCheck((prev) => prev.filter((item) => item !== memberId));
        }
    };

    // 체크 박스 전체 선택
    const checkAllClickEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tmpList: number[] = [];
        if (e.target.checked) {
            userList && tmpList.push(...userList.map((item: userInterface) => item.memberId));
        }
        setCheck(tmpList);
    };

    // select 변경 시 state set
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 선택된 값을 업데이트
        setRoleValue(e.target.value);
    };

    const changeRole = () => {
        if (roleValue !== "") {
            const typeSend = {
                memberIdList: check,
                role: roleValue,
            };
            fetchRoleChangeData("/members/approved", "PUT", "token", typeSend);
            setReload(true);
        }
    };

    // 동아리원 현황 조회 fetch
    useEffect(() => {
        fetchUser("/members?page=0&size=10", "GET", "token");
        setReload(false);
    }, [reload, access]); // role 바뀔 때 마다 reFetch, type 바뀔때도 적용시켜주어야 함

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
                memberId: item.memberId,
            }));

            setUserList(contents);
            setTotalUser(user.pageInfo.totalElements);
            setTotalPage(user.pageInfo.totalPages);
        }
    }, [user, access]);

    return (
        <Div width="100%">
            {role === "SECRETARY" && (
                <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                    <Div $minWidth="100px" $margin="0 10px 0 0 ">
                        <Select
                            name="approved"
                            $borderRadius={3}
                            required
                            defaultValue="nothing"
                            onChange={handleTypeChange}
                        >
                            <option value="nothing" disabled hidden>
                                관리
                            </option>
                            <option value="BASIC">활동회원</option>
                            <option value="DEACTIVATED">비활동회원</option>
                        </Select>
                    </Div>
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        $padding="6px 12px"
                        height="40px"
                        onClick={() => changeRole()}
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
            )}

            <Div width="100%">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                    $borderB={`1.5px solid ${theme.color.grey1}`}
                >
                    {role === "SECRETARY" && (
                        <FlexDiv $padding="10px">
                            {user && (
                                <Checkbox
                                    checked={!!user && check.length === userList.length}
                                    onChange={checkAllClickEvent}
                                />
                            )}
                        </FlexDiv>
                    )}
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
                        </FlexDiv>
                    ))}
                </FlexDiv>
                {userList &&
                    userList.map((element: userInterface, idx: number) => (
                        <FlexDiv
                            key={`contentItem${idx}`}
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            {role === "SECRETARY" && (
                                <FlexDiv $padding="10px">
                                    <Checkbox
                                        checked={check.includes(element.memberId) ? true : false}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            checkClickEvent(e, element.memberId)
                                        }
                                    />
                                </FlexDiv>
                            )}
                            {Object.entries(element).map(([key, value], idx: number) => {
                                if (key !== "memberId") {
                                    return (
                                        <FlexDiv
                                            key={`itemValue${idx}`}
                                            $minWidth={`${widthList[idx]}px`}
                                            $padding="10px"
                                        >
                                            <A $center fontWeight={idx === 0 ? 800 : 500}>
                                                {value}
                                            </A>
                                        </FlexDiv>
                                    );
                                }
                            })}
                        </FlexDiv>
                    ))}
            </Div>
            <Pagination totalPage={totalPage} fetchUrl="/members" token paginationFetch={fetchUser} />
        </Div>
    );
};

export default MyUserTable;
