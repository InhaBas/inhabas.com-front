import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { changeNameTotalPageInfo, changeNameUserInfo, tokenAccess } from "../../../../Recoil/backState";
import { checkOne } from "../../../../Recoil/frontState";

import { changeNameUserInterface } from "../../../../Types/IBAS/TypeMyinfo";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import { ConvertLabel } from "../../../../Functions/convertLabelFunctions";

import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { Checkbox } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import Dropdown from "../../../Common/Dropdown";
import Loading from "../../../Common/Loading";
import Pagination from "../../../Common/Pagination";

const MyChangeNameUserTable = () => {
    const { isAuthorizedOverVice } = GetRoleAuthorization();
    const { convertStatusLabel } = ConvertLabel();

    const widthList = [50, 100, 150, 200, 200, 200, 100];
    const headerInfo = ["", "이름", "학번", "학과", "변경 전 이름", "변경 후 이름", "현황"];

    const [user, fetchUser] = useFetch();
    const [userList, setUserList] = useRecoilState(changeNameUserInfo);
    const [totalPage, setTotalPage] = useRecoilState(changeNameTotalPageInfo);

    const [check, setCheck] = useRecoilState(checkOne);
    const [value, setValue] = useState("");
    const [nameChangeData, fetchNameChangeData] = useFetch();
    const access = useRecoilValue(tokenAccess);
    const [isLoading, setIsLoading] = useState(true);

    // 단일 체크박스 클릭시 checkedList update
    const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
        const targetCheck = e.target.checked;
        if (targetCheck === true) {
            setCheck(memberId);
        }
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handleValueChange = (value: string) => {
        // 선택된 값을 업데이트
        setValue(value);
    };

    // change Name fetch
    const acceptName = async () => {
        if (value !== "") {
            setIsLoading(true);
            const acceptSend = {
                id: check,
                status: value,
            };
            await fetchNameChangeData("/myInfo/request", "PUT", "token", acceptSend);

            await fetchUser("/myInfo/requests", "GET", "token");
        }
    };

    // 이름 변경 요청한 동아리원 현황 조회 fetch,
    useEffect(() => {
        setIsLoading(true);
        fetchUser("/myInfo/requests", "GET", "token");
    }, [access, nameChangeData]);

    // fetch된 data로 동아리원 List 만들 data 가공
    useEffect(() => {
        if (user) {
            const contents = user.data.map((item: changeNameUserInterface, idx: number) => ({
                id: item.id,
                idxNum: idx + 1,
                name: item.beforeName,
                studentId: item.studentId,
                major: item.major,
                beforeName: item.beforeName,
                afterName: item.afterName,
                status: convertStatusLabel(item.status),
            }));

            setTotalPage(user.pageInfo.totalPages);
            setUserList(contents);
            setCheck(0);
            setIsLoading(false);
        }
    }, [user, access]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="30vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Div width="100%">
                    {isAuthorizedOverVice && (
                        <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
                            <Div $minWidth="100px" $margin="0 10px 0 0 ">
                                <Dropdown
                                    label="승인 여부"
                                    options={["승인", "거절"]}
                                    value={["pass", "fail"]}
                                    onChange={handleValueChange}
                                />
                            </Div>

                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={3}
                                $padding="6px 12px"
                                height="40px"
                                onClick={() => {
                                    acceptName();
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
                            <FlexDiv $padding="10px" width="40px"></FlexDiv>
                            {headerInfo.map((item: string, idx: number) => (
                                <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                    <P $center fontWeight={700}>
                                        {item}
                                    </P>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        {userList && userList.length !== 0 ? (
                            userList.map((element: changeNameUserInterface, idx: number) => (
                                <FlexDiv
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-evenly"
                                    $backgroundColor="wh"
                                >
                                    {isAuthorizedOverVice && (
                                        <FlexDiv $padding="10px">
                                            <Checkbox
                                                checked={check === element.id ? true : false}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    checkClickEvent(e, element.id)
                                                }
                                            />
                                        </FlexDiv>
                                    )}

                                    {Object.entries(element).map(([key, value], idx: number) => {
                                        if (key !== "id") {
                                            let color = "bk";
                                            let fontStyle: React.CSSProperties = {};

                                            if (key === "status") {
                                                if (value === "거절") {
                                                    color = "#f56642";
                                                    fontStyle.fontStyle = "italic";
                                                } else if (value === "승인") {
                                                    color = "#155724";
                                                    fontStyle.fontStyle = "italic";
                                                }
                                            }
                                            return (
                                                <FlexDiv
                                                    key={`itemValue${idx}`}
                                                    $minWidth={`${widthList[idx - 1]}px`}
                                                    $padding="10px"
                                                >
                                                    <P
                                                        $center
                                                        style={{ color: color, ...fontStyle }}
                                                        fontWeight={idx === 1 ? 800 : 500}
                                                    >
                                                        {value}
                                                    </P>
                                                </FlexDiv>
                                            );
                                        }
                                    })}
                                </FlexDiv>
                            ))
                        ) : (
                            <FlexDiv width="100%" $padding="10px">
                                <Div>
                                    <P>이름 수정을 요청한 회원이 존재하지 않습니다.</P>
                                </Div>
                            </FlexDiv>
                        )}
                    </Div>

                    {userList && userList.length !== 0 && (
                        <Pagination
                            totalPage={totalPage}
                            fetchUrl="/myInfo/requests"
                            token
                            paginationFetch={fetchUser}
                            size={10}
                        />
                    )}
                </Div>
            )}
        </>
    );
};

export default MyChangeNameUserTable;
