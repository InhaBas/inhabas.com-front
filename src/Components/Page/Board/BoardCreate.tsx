import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { boardDetailData, fileIdList } from "../../../Recoil/backState";
import { menuId, refetch, selectedFile } from "../../../Recoil/frontState";

import { boardDetailInterface } from "../../../Types/TypeBoard";

import { theme } from "../../../styles/theme";

import DragNDrop from "../../Common/DragNDrop";
import Dropdown from "../../Common/Dropdown";

import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { Date, TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";
import Loading from "../../Common/Loading";
import TextEditor from "../../Common/TextEditor";

const BoardCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];
    const paramID = useParams().id;

    const inputRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pinValue, setPinValue] = useState("");
    const [postData, postFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const [files, setFiles] = useRecoilState(selectedFile);
    const [update, setUpdate] = useState("create");
    const [detail, setDetail] = useRecoilState(boardDetailData);
    const setSelectedFile = useSetRecoilState(selectedFile);
    const fileSelected = useRecoilValue(selectedFile);
    const currentMenuId = useRecoilValue(menuId);
    const [fileId, setFileList] = useRecoilState(fileIdList);
    const setReload = useSetRecoilState(refetch);

    useEffect(() => {
        if (paramID) {
            setUpdate("update");
        } else {
            setIsLoading(false);
        }
    }, []);

    let fetchUrl = "";
    if (url === "alpha") {
        fetchUrl = "/project/alpha";
    } else if (url === "beta") {
        fetchUrl = "/project/beta";
    } else if (url === "sponsor") {
        fetchUrl = "/scholarship/sponsor";
    } else if (url === "usage") {
        fetchUrl = "/scholarship/usage";
    } else if (url === "opensource") {
        fetchUrl = "/board/storage";
    } else {
        fetchUrl = `/board/${url}`;
    }

    // select 값 선택에 따른 state 변경 이벤트
    const handlePinChange = (value: string) => {
        // 선택된 값을 업데이트
        setPinValue(value);
    };

    const sendInput = () => {
        let check = true;

        if (check && inputRef.current[0].value === "") {
            alert("제목을 입력해주세요");
            check = false;
        }
        if (check && (url === "sponsor" || url === "usage") && inputRef.current[2].value === "") {
            alert("날짜를 입력해주세요");
            check = false;
        }

        if (check && inputRef.current[1].getInstance().getMarkdown().trim() === "") {
            alert("내용을 입력해주세요");
            check = false;
        }

        if (check) {
            setIsLoading(true); // 로딩 상태 설정
            const inputData = {
                title: inputRef.current[0].value,
                content: inputRef.current[1].getInstance().getMarkdown(),
                files: fileId,
                ...(url !== "sponsor" && url !== "usage" && { pinOption: pinValue !== "" ? pinValue : "0" }),
                ...((url === "sponsor" || url === "usage") && { dateHistory: inputRef.current[2].value + "T00:00:00" }),
            };

            const formdata = new FormData();

            for (let i = 0; i < files.length; i++) {
                formdata.append("files", files[i]);
            }

            if (update === "create") {
                // postFetchData(`${fetchUrl}`, "POST", "token", formdata, true);
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
            setIsLoading(false);

            // DragNDrop update 설정
            const files = [
                ...getData.images.map((item: boardDetailInterface) => item),
                ...getData.otherFiles.map((item: boardDetailInterface) => item),
            ];
            setSelectedFile(files);
            const fileIds = [
                ...getData.images.map((item: boardDetailInterface) => item.id),
                ...getData.otherFiles.map((item: boardDetailInterface) => item.id),
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
                                    <P fontWeight={600}>게시글 작성</P>
                                </Div>
                                {(url === "notice" || url === "executive") && (
                                    <Div>
                                        <Dropdown
                                            label="상단고정여부"
                                            options={["고정안함", "2주고정", "영구고정"]}
                                            value={["0", "1", "2"]}
                                            onChange={handlePinChange}
                                        />
                                    </Div>
                                )}
                            </FlexDiv>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <TextInput
                                        width="100%"
                                        height="60px"
                                        placeholder="제목을 입력해주세요"
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[0] = el)}
                                        defaultValue={detail?.title}
                                    ></TextInput>
                                </Div>
                            </Div>

                            {(url === "sponsor" || url === "usage") && (
                                <Div width="100%" $padding="20px">
                                    <Div width="100%">
                                        <Date
                                            width="100%"
                                            height="60px"
                                            fontSize="xl"
                                            $borderRadius={5}
                                            ref={(el: never) => (inputRef.current[2] = el)}
                                            defaultValue={detail?.dateHistory}
                                        />
                                    </Div>
                                </Div>
                            )}

                            <Div width="100%" $padding="20px">
                                <DragNDrop fileFetch menuId={currentMenuId} />
                            </Div>
                            <Div width="100%" $padding="20px">
                                <TextEditor
                                    ref={(el: never) => (inputRef.current[1] = el)}
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

export default BoardCreate;
