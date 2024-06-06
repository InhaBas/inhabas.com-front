import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { _totalPageInfo, tokenAccess, totalUserInfo, userInfo, userRole } from "../../../../Recoil/backState";
import { _checkedList, refetch } from "../../../../Recoil/frontState";

import { userInterface } from "../../../../Types/IBAS/TypeMyinfo";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import { ConvertLabel } from "../../../../Functions/convertLabelFunctions";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import Dropdown from "../../../Common/Dropdown";
import Loading from "../../../Common/Loading";
import Pagination from "../../../Common/Pagination";

const MyUserTable = () => {
    const { isAuthorizedOverVice, isAuthorizedExceptExecutives } = GetRoleAuthorization();
    const { convertRoleLabel, convertTypeLabel } = ConvertLabel();

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
    const [typeValue, setTypeValue] = useState("");
    const [CategoryValue, setCategoryValue] = useState("");
    const [roleChangeData, fetchRoleChangeData] = useFetch();
    const [typeChangeData, fetchTypeChangeData] = useFetch();
    const [reload, setReload] = useRecoilState(refetch);
    const access = useRecoilValue(tokenAccess);
    const [searchValue, setSearchValue] = useState(""); // 검색어
    const [isLoading, setIsLoading] = useState(true);

    const path = useLocation().pathname;

    // 단일 체크박스 클릭시 checkedList update
    const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
        const targetCheck = e.target.checked;
        if (targetCheck === true) {
            setCheck((prev) => [...prev, memberId]);
        } else {
            setCheck((prev) => prev.filter((item) => item !== memberId));
        }
    };

    // 전체 체크박스 클릭시 checkedList update
    const checkAllClickEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tmpList: number[] = [];
        if (e.target.checked) {
            userList && tmpList.push(...userList.map((item: userInterface) => item.memberId));
        }
        setCheck(tmpList);
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handleRoleChange = (value: string) => {
        // 선택된 값을 업데이트
        setRoleValue(value);
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handleTypeChange = (value: string) => {
        // 선택된 값을 업데이트
        setTypeValue(value);
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handleCategoryChange = (value: string) => {
        // 선택된 값을 업데이트
        setCategoryValue(value);
    };

    // role Fetch
    const changeRole = () => {
        if (roleValue !== "") {
            const roleSend = {
                memberIdList: check,
                role: roleValue,
            };
            fetchRoleChangeData("/members/approved/role", "PUT", "token", roleSend);
            setReload(true);
        }
    };

    // type Fetch
    const changeType = () => {
        if (typeValue !== "") {
            const typeSend = {
                memberIdList: check,
                type: typeValue,
            };
            fetchTypeChangeData("/members/approved/type", "PUT", "token", typeSend);
            setReload(true);
        }
    };

    // 검색어 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    // 검색 버튼 클릭 핸들러
    const searchStudent = () => {
        // 검색어를 이용하여 API 호출

        if (searchValue.trim() !== "") {
            fetchUser(`/members/notGraduated?search=${searchValue}`, "GET", "token");
        }
    };

    // 엔터키 press 핸들러
    const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchStudent();
        }
    };

    // 동아리원 현황 조회 fetch, 회원관리 / 재학생 자세히 보기 페이지 별로 다른 fetch 처리
    useEffect(() => {
        setIsLoading(true);
        let fetchUrl = "/members/notGraduated?page=0";
        if (path === "/staff/member/students") {
            fetchUrl += "&size=15";
        } else if (path === "/staff/member") {
            fetchUrl += "&size=10";
        }

        fetchUser(fetchUrl, "GET", "token");

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
                type: convertTypeLabel(item.memberType),
                generation: item.generation,
                memberId: item.memberId,
            }));

            setUserList(contents);
            setTotalUser(user.pageInfo.totalElements);
            setTotalPage(user.pageInfo.totalPages);
            setCheck([] as Number[]);
            setIsLoading(false);
        }
    }, [user, access]);

    return (
        <Div width="100%">
            {isLoading ? (
                <FlexDiv width="100%" height="30vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <>
                    {role === "SECRETARY" && (
                        <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                            <Div $minWidth="100px" $margin="0 10px 0 0 ">
                                <Dropdown
                                    label="관리"
                                    options={["활동회원", "비활동회원"]}
                                    value={["BASIC", "DEACTIVATED"]}
                                    onChange={handleRoleChange}
                                />
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
                    {isAuthorizedOverVice && (
                        <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                            <Div $minWidth="100px" $margin="0 10px 0 0 ">
                                <Dropdown
                                    label="관리"
                                    options={["역할", "소속"]}
                                    value={["ROLE", "TYPE"]}
                                    onChange={handleCategoryChange}
                                />
                            </Div>
                            {CategoryValue === "ROLE" && (
                                <Div $minWidth="100px" $margin="0 10px 0 0 ">
                                    <Dropdown
                                        label="선택"
                                        options={["회장", "부회장", "운영진", "총무", "활동회원", "비활동회원"]}
                                        value={[
                                            "CHIEF",
                                            "VICE_CHIEF",
                                            "EXECUTIVES",
                                            "SECRETARY",
                                            "BASIC",
                                            "DEACTIVATED",
                                        ]}
                                        onChange={handleRoleChange}
                                    />
                                </Div>
                            )}
                            {CategoryValue === "TYPE" && (
                                <Div $minWidth="100px" $margin="0 10px 0 0 ">
                                    <Dropdown
                                        label="선택"
                                        options={["졸업생", "대학원생", "교수"]}
                                        value={["GRADUATED", "BACHELOR", "PROFESSOR"]}
                                        onChange={handleTypeChange}
                                    />
                                </Div>
                            )}
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={3}
                                $padding="6px 12px"
                                height="40px"
                                onClick={() => {
                                    CategoryValue === "TYPE" ? changeType() : changeRole();
                                }}
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
                            $justifycontent="space-evenly"
                            $backgroundColor="wh"
                            $borderB={`1.5px solid ${theme.color.grey1}`}
                        >
                            {isAuthorizedExceptExecutives && (
                                <FlexDiv $padding="10px">
                                    {userList && userList.length !== 0 && (
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
                        {userList && userList.length !== 0 ? (
                            userList.map((element: userInterface, idx: number) => (
                                <FlexDiv
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-evenly"
                                    $backgroundColor="wh"
                                >
                                    {isAuthorizedExceptExecutives && (
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
                            ))
                        ) : (
                            <FlexDiv width="100%" $padding="10px">
                                <Div>
                                    <P>회원이 존재하지 않습니다.</P>
                                </Div>
                            </FlexDiv>
                        )}
                    </Div>
                    {path === "/staff/member/students" && (
                        <FlexDiv width="100%" $justifycontent="end" $margin="30px 0">
                            <FlexDiv>
                                <TextInput
                                    width="300px"
                                    placeholder="이름이나 학번을 입력하세요"
                                    $borderRadius="3px 0 0px 3"
                                    onKeyDown={enterKeyDown}
                                    onChange={handleSearchChange}
                                />
                                <Button
                                    $backgroundColor="bgColor"
                                    $HBackgroundColor="bgColorHo"
                                    $padding="13px 20px"
                                    $borderRadius="0 3px 3px 0"
                                    onClick={searchStudent}
                                >
                                    <FlexDiv width="14px">
                                        <Img src="/images/search_white.svg" />
                                    </FlexDiv>
                                </Button>
                            </FlexDiv>
                        </FlexDiv>
                    )}
                    {userList && userList.length !== 0 && (
                        <Pagination
                            totalPage={totalPage}
                            fetchUrl="/members/notGraduated"
                            token
                            paginationFetch={fetchUser}
                            size={path === "/staff/member/students" ? 15 : 10}
                        />
                    )}
                </>
            )}
        </Div>
    );
};

export default MyUserTable;
