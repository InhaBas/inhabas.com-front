import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { newUserInfo, tokenAccess, totalNewUserInfo, totalPageInfo } from "../../../../Recoil/backState";
import { checkedList } from "../../../../Recoil/frontState";

import { newUserInterface } from "../../../../Types/IBAS/TypeMyinfo";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import Dropdown from "../../../Common/Dropdown";
import Loading from "../../../Common/Loading";
import Pagination from "../../../Common/Pagination";

const MyNewUserTable = () => {
    const { isAuthorizedOverExecutives } = GetRoleAuthorization();

    const widthList = [50, 100, 70, 150, 170, 310, 160];
    const headerInfo = ["", "이름", "학년", "학번", "전화번호", "학과", "지원서보기"];

    const [check, setCheck] = useRecoilState(checkedList);
    const [newUserData, fetchNewUserData] = useFetch();
    const [newUser, setNewUser] = useRecoilState(newUserInfo);
    const setTotalNewUser = useSetRecoilState(totalNewUserInfo);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [passFailValue, setPassFailValue] = useState("");
    const [passFailData, fetchPassFailData] = useFetch();
    const access = useRecoilValue(tokenAccess);
    const [searchValue, setSearchValue] = useState(""); // 검색어
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const path = useLocation().pathname;

    // 지원서 이동 함수
    const moveApplication = (application: number) => {
        navigate(`/staff/member/application/${application}`);
    };

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
            newUser && tmpList.push(...Object.values(newUser).map((item: newUserInterface) => item.memberId));
        }
        setCheck(tmpList);
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handlePassFailChange = (value: string) => {
        // 선택된 값을 업데이트
        setPassFailValue(value);
    };

    // pass/fail Fetch
    const passFail = async () => {
        if (passFailValue !== "") {
            setIsLoading(true);
            try {
                let passFailSend = {
                    memberIdList: check,
                    state: passFailValue,
                };
                await fetchPassFailData("/members/unapproved", "PUT", "token", passFailSend);

                let fetchUrl = "/members/unapproved?page=0";
                if (path === "/staff/member/newStudents") {
                    fetchUrl += "&size=15";
                } else if (path === "/staff/member") {
                    fetchUrl += "&size=10";
                }

                await fetchNewUserData(fetchUrl, "GET", "token");
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false); // 요청이 끝난 후 loading을 false로 설정
            }
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
            fetchNewUserData(`/members/unapproved?search=${searchValue}`, "GET", "token");
        }
    };

    // 엔터키 press 핸들러
    const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchStudent();
        }
    };

    // 회원관리 / 신입생 자세히 보기 페이지 별로 다른 fetch 처리
    useEffect(() => {
        setIsLoading(true);
        let fetchUrl = "/members/unapproved?page=0";
        if (path === "/staff/member/newStudents") {
            fetchUrl += "&size=15";
        } else if (path === "/staff/member") {
            fetchUrl += "&size=10";
        }

        fetchNewUserData(fetchUrl, "GET", "token");
    }, [passFailData, access]);

    // 받아온 데이터 가공
    useEffect(() => {
        if (newUserData) {
            const processedData = newUserData.data.map((item: newUserInterface, idx: number) => ({
                id: idx + 1,
                name: item.name,
                grade: item.grade,
                studentId: item.studentId,
                phoneNumber: item.phoneNumber,
                major: item.major,
                memberId: item.memberId,
            }));

            // totalUser, totalPage set
            setTotalNewUser(newUserData.pageInfo.totalElements);
            setTotalPage(newUserData.pageInfo.totalPages);

            // 신입생 정보 set
            setNewUser(processedData);

            setCheck([] as Number[]);
            setIsLoading(false);
        }
    }, [newUserData, access]);

    // 페이지네이션에서 data get 하면 table에서 다시 데이터 필터링 해주어야 함.

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="30vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Div width="100%">
                    {isAuthorizedOverExecutives && (
                        <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                            <Div $margin="0 10px 0 0 ">
                                <Div width="105px">
                                    <Dropdown
                                        label="승인여부"
                                        options={["합격", "불합격"]}
                                        value={["pass", "fail"]}
                                        onChange={handlePassFailChange}
                                    />
                                </Div>
                            </Div>
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={3}
                                $padding="6px 12px"
                                height="40px"
                                onClick={() => passFail()}
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
                            {isAuthorizedOverExecutives && (
                                <FlexDiv $padding="10px">
                                    {newUser && newUser.length !== 0 && (
                                        <Checkbox
                                            checked={!!newUser && check.length === Object.values(newUser).length}
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
                        {newUser && newUser.length !== 0 ? (
                            Object.values(newUser).map((element: newUserInterface, idx: number) => (
                                <FlexDiv
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-evenly"
                                    $backgroundColor="wh"
                                >
                                    {isAuthorizedOverExecutives && (
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
                                        // memberId가 아닌 경우에만 FlexDiv를 렌더링합니다.
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
                                        return null;
                                    })}

                                    <FlexDiv $padding="10px" $minWidth="160px" $pointer>
                                        <A
                                            $center
                                            color="bgColor"
                                            $hoverColor="textColor"
                                            onClick={() => moveApplication(element.memberId)}
                                        >
                                            지원서보기
                                        </A>
                                    </FlexDiv>
                                </FlexDiv>
                            ))
                        ) : (
                            <FlexDiv width="100%" $padding="10px">
                                <Div>
                                    <P>입부 신청 대기중인 회원이 없습니다.</P>
                                </Div>
                            </FlexDiv>
                        )}
                    </Div>
                    {path === "/staff/member/newStudents" && (
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
                    {newUser && newUser.length !== 0 && (
                        <Pagination
                            totalPage={totalPage}
                            fetchUrl="/members/unapproved"
                            token
                            paginationFetch={fetchNewUserData}
                            size={path === "/staff/member/newStudents" ? 15 : 10}
                        />
                    )}
                </Div>
            )}
        </>
    );
};

export default MyNewUserTable;
