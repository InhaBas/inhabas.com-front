import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { fileIdList } from "../../../../Recoil/backState";
import { menuId, refetch, selectedFile } from "../../../../Recoil/frontState";

import DragNDrop from "../../../Common/DragNDrop";
import Loading from "../../../Common/Loading";
import TextEditor from "../../../Common/TextEditor";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { DateInput, Label, Radio, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

import { DateFunction } from "../../../../Functions/dateFunction";

interface contestDetailInterface {
    contestFieldId: number | null;
    title: string;
    topic: string;
    association: string;
    dateContestStart: string;
    dateContestEnd: string;
    content: string;
    thumbnail: [
        {
            id: string;
            name: string;
            url: string;
            size: number;
            type: string;
        }
    ];

    id: number;
    dday: number;
    // D-day: number;
}

const ContestCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];
    const paramID = useParams().id;

    const inputRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [postData, postFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const [fileId, setFileList] = useRecoilState(fileIdList);
    const [update, setUpdate] = useState("create");
    const [detail, setDetail] = useState<contestDetailInterface | null>(null);
    const [files, setSelectedFile] = useRecoilState(selectedFile);
    const currentMenuId = useRecoilValue(menuId);
    const setReload = useSetRecoilState(refetch);
    const [contestType, setContestType] = useState<number | null>(null);
    const { formatDateT, formatDateDay } = DateFunction();

    const today = formatDateT();

    useEffect(() => {
        if (paramID) {
            setUpdate("update");
        } else {
            setIsLoading(false);
        }
    }, []);

    let fetchUrl = "";
    if (url === "contest") {
        fetchUrl = "/contest/contest";
    } else if (url === "activity") {
        fetchUrl = "/contest/activity";
    }

    const sendInput = () => {
        let check = true;

        if (check && inputRef.current[0].value === "") {
            alert("공모전 이름을 입력해주세요.");
            check = false;
        }
        if (check && inputRef.current[1].value === "") {
            alert("공모전 주제를 입력해주세요.");
            check = false;
        }
        if (check && inputRef.current[2].value === "") {
            alert("주최기관을 입력해주세요.");
            check = false;
        }
        if (check && inputRef.current[3].value === "") {
            alert("공모전 시작일을 입력해주세요.");
            check = false;
        }
        if (check && inputRef.current[4].value === "") {
            alert("공모전 마감일을 입력해주세요.");
            check = false;
        }

        if (check && inputRef.current[4].value < today) {
            alert(`공모전 마감일은 ${formatDateDay({ date: today })} 이후의 날짜만 등록가능합니다.`);
            check = false;
        }

        let isAnyImg = false;
        for (let i = 0; i < files.length; i++) {
            if (["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(files[i].type)) {
                isAnyImg = true;
            }
        }

        if (check && !isAnyImg) {
            alert("이미지를 1개 이상 업로드해주세요.");
            check = false;
        }

        if (check && inputRef.current[5].getInstance().getMarkdown() === "") {
            alert("내용을 입력해주세요");
            check = false;
        }

        if (check) {
            setIsLoading(true); // 로딩 상태 설정
            const inputData = {
                contestFieldId: contestType === 1 ? "1" : contestType === 2 ? "2" : null,
                title: inputRef.current[0].value,
                topic: inputRef.current[1].value,
                association: inputRef.current[2].value,
                dateContestStart: inputRef.current[3].value + "T00:00:00",
                dateContestEnd: inputRef.current[4].value + "T23:59:59",
                content: inputRef.current[5].getInstance().getMarkdown(),
                files: fileId,
            };
            if (update === "create") {
                postFetchData(`${fetchUrl}`, "POST", "token", inputData);
            } else if (update === "update") {
                postFetchData(`${fetchUrl}/${paramID}`, "POST", "token", inputData);
            }
        }
    };

    useEffect(() => {
        if (postData) {
            setIsLoading(false); // 로딩 상태 해제
            alert("글이 정상적으로 등록되었습니다");
            navigate(`/board/${url}`);
        }
    }, [postData]);

    useEffect(() => {
        if (update == "update") {
            getFetchData(`${fetchUrl}/${paramID}`, "GET", "token");
        }
    }, [update]);

    useEffect(() => {
        if (getData) {
            setDetail(getData);
            setContestType(getData.contestFieldId);
            setIsLoading(false);

            // DragNDrop update 설정
            const files = [
                ...getData.images.map((item: contestDetailInterface | null) => item),
                ...getData.otherFiles.map((item: contestDetailInterface | null) => item),
            ];
            setSelectedFile(files);
            const fileIds = [
                ...getData.images.map((item: contestDetailInterface | null) => item?.id),
                ...getData.otherFiles.map((item: contestDetailInterface | null) => item?.id),
            ];
            setFileList(fileIds);
            // DragNDrop reload true일 때만 불러온 파일들 렌더링 할 있음
            setReload(true);
        }
        return () => {
            setDetail(null);
            // DragNDrop fileList 초기화
            setFileList([]);
        };
    }, [getData]);

    return (
        <FlexDiv width="100%">
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Container $alignitems="start">
                    <Div width="100%" $margin="0 0 30px 0">
                        <FlexDiv
                            $padding="15px 20px"
                            width="100%"
                            $justifycontent="start"
                            radius={5}
                            $border="1px solid"
                            $borderColor="bgColor"
                        >
                            <Div width="25px" height="25px" $margin="0 10px 0 0">
                                <Img src="/images/triangle-warning_purple.svg"></Img>
                            </Div>
                            <Div>
                                <P color="bgColor" fontSize="sm" fontWeight={700}>
                                    웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
                                </P>
                            </Div>
                        </FlexDiv>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 제목</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <TextInput
                                        width="100%"
                                        height="60px"
                                        placeholder="공모전 이름을 입력하세요."
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[0] = el)}
                                        defaultValue={detail?.title}
                                    ></TextInput>
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 종류</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <FlexDiv width="90%" $justifycontent="flex-start" height="50px">
                                        <FlexDiv>
                                            <Radio
                                                name="setHistoryType"
                                                value={"빅데이터"}
                                                onClick={() => {
                                                    setContestType(1);
                                                }}
                                                defaultChecked={detail?.contestFieldId === 1}
                                            />
                                            <Label $margin="0 0 0 5px">빅데이터</Label>
                                        </FlexDiv>
                                        <FlexDiv $margin="0 90px">
                                            <Radio
                                                name="setHistoryType"
                                                value={"IT"}
                                                onClick={() => {
                                                    setContestType(2);
                                                }}
                                                defaultChecked={detail?.contestFieldId === 2}
                                            />
                                            <Label $margin="0 0 0 5px">IT</Label>
                                        </FlexDiv>
                                        {/* null 해결 후 추가 */}

                                        {/* <FlexDiv>
                                            <Radio
                                                name="setHistoryType"
                                                value={"기타"}
                                                onClick={() => {
                                                    setContestType(null);
                                                }}
                                                defaultChecked={detail?.contestFieldId === null}
                                            />
                                            <Label $margin="0 0 0 5px">기타</Label>
                                        </FlexDiv> */}
                                    </FlexDiv>
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 주제</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <TextInput
                                        width="100%"
                                        height="60px"
                                        placeholder="공모전 주제를 적어주세요."
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[1] = el)}
                                        defaultValue={detail?.topic}
                                    ></TextInput>
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 주최기관</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <TextInput
                                        width="100%"
                                        height="60px"
                                        placeholder="주최기관을 입력하세요."
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[2] = el)}
                                        defaultValue={detail?.association}
                                    ></TextInput>
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 모집 시작일</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <DateInput
                                        width="100%"
                                        height="60px"
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[3] = el)}
                                        defaultValue={detail?.dateContestStart?.split("T")[0]}
                                    />
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="space-between"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 모집 마감일</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <DateInput
                                        width="100%"
                                        height="60px"
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[4] = el)}
                                        defaultValue={detail?.dateContestEnd?.split("T")[0]}
                                    />
                                </Div>
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width="100%"
                                $padding="20px"
                                $justifycontent="flex-start"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 포스터 및 첨부파일</P>
                                </Div>
                                <Div $margin="0 0 0 5px">
                                    <P fontSize="xs" color="red" fontWeight={500}>
                                        ※ 첨부파일에 사진 파일이 없을 시 정상적으로 게시글이 등록되지 않습니다.
                                    </P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <DragNDrop fileFetch menuId={currentMenuId} />
                            </Div>
                        </Div>

                        <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FlexDiv
                                width="100%"
                                $padding="20px"
                                $justifycontent="flex-start"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <Div>
                                    <P fontWeight={600}>공모전 상세 설명</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <TextEditor
                                    ref={(el: never) => (inputRef.current[5] = el)}
                                    initialContent={detail?.content}
                                />
                            </Div>
                        </Div>

                        <FlexDiv width="100%" $margin="30px 0 0 0">
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={2}
                                $padding="15px 30px"
                                width="400px"
                                onClick={() => sendInput()}
                            >
                                {update === "create" ? <P color="wh">작성하기</P> : <P color="wh">수정하기</P>}
                            </Button>
                        </FlexDiv>
                    </Div>
                </Container>
            )}
        </FlexDiv>
    );
};

export default ContestCreate;
