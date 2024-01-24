import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import useFetch from "../../../../Hooks/useFetch";

import { newUserInfo, totalNewUserInfo, totalPageInfo } from "../../../../Recoil/backState";
import { theme } from "../../../../styles/theme";

import { checkedList } from "../../../../Recoil/frontState";
import { newUserInterface } from "../../../../Types/IBAS/TypeMember";
import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox, Select } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import Pagination from "../../../Common/Pagination";

const MyNewUserTable = () => {
    const widthList = [50, 100, 70, 150, 170, 310, 160];
    const headerInfo = ["", "이름", "학년", "학번", "전화번호", "학과", "지원서보기"];

    const [check, setCheck] = useRecoilState(checkedList);
    const [newUserData, fetchNewUserData] = useFetch();
    const [newUser, setNewUser] = useRecoilState(newUserInfo);
    const setTotalNewUser = useSetRecoilState(totalNewUserInfo);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [passFailValue, setPassFailValue] = useState("");
    const [passFailData, fetchPassFailData] = useFetch();

    const navigate = useNavigate();

    const moveApplication = (application: number) => {
        navigate(`/staff/member/application/${application}`);
    };

    const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
        const targetCheck = e.target.checked;
        if (targetCheck === true) {
            setCheck((prev) => [...prev, memberId]);
        } else {
            setCheck((prev) => prev.filter((item) => item !== memberId));
        }
    };

    const checkAllClickEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tmpList: number[] = [];
        if (e.target.checked) {
            newUser && tmpList.push(...Object.values(newUser).map((item: newUserInterface) => item.memberId));
        }
        setCheck(tmpList);
    };

    const handlePassFailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 선택된 값을 업데이트
        setPassFailValue(e.target.value);
    };

    const passFail = () => {
        if (passFailValue !== "") {
            let passFailSend = {
                memberIdList: check,
                state: passFailValue,
            };
            fetchPassFailData("/members/unapproved", "PUT", "token", passFailSend);
        }
    };

    useEffect(() => {
        fetchNewUserData("/members/unapproved?page=0&size=10", "GET", "token");
    }, [passFailData]);

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

            setTotalNewUser(newUserData.pageInfo.totalElements);
            setTotalPage(newUserData.pageInfo.totalPages);
            setNewUser(processedData);
        }
    }, [newUserData]);

    // 페이지네이션에서 data get 하면 table에서 다시 데이터 필터링 해주어야 함.

    useEffect(() => console.log(newUser.length), [newUser]);
    return (
        <Div width="100%">
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                <Div width="100px" $margin="0 10px 0 0 ">
                    <Select
                        name="approved"
                        $borderRadius={3}
                        required
                        defaultValue="nothing"
                        onChange={handlePassFailChange}
                    >
                        <option value="nothing" disabled hidden>
                            승인여부
                        </option>
                        <option value="pass">합격</option>
                        <option value="fail">불합격</option>
                    </Select>
                </Div>
                <Button
                    $backgroundColor="bgColor"
                    $HBackgroundColor="bgColorHo"
                    $borderRadius={3}
                    $padding="6px 12px"
                    height="40px"
                >
                    <FlexDiv $margin="0 5px 0 0" onClick={() => passFail()}>
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
            <Div width="100%">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                    $borderB={`2px solid ${theme.color.grey1}`}
                >
                    <FlexDiv $padding="10px">
                        {newUser && newUser.length !== 0 && (
                            <Checkbox
                                checked={!!newUser && check.length === Object.values(newUser).length}
                                onChange={checkAllClickEvent}
                            />
                        )}
                    </FlexDiv>
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
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv $padding="10px">
                                <Checkbox
                                    checked={check.includes(element.memberId) ? true : false}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        checkClickEvent(e, element.memberId)
                                    }
                                />
                            </FlexDiv>

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
            {newUser && newUser.length !== 0 && (
                <Pagination
                    totalPage={totalPage}
                    fetchUrl="/members/unapproved"
                    token
                    paginationFetch={fetchNewUserData}
                />
            )}
        </Div>
    );
};

export default MyNewUserTable;
