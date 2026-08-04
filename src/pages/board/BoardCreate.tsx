import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import useFetch from "../../hooks/useFetch";

import { boardDetailData, fileIdList, tokenAccess } from "../../recoil/backState";
import { menuId, refetch, selectedFile } from "../../recoil/frontState";

import { boardDetailInterface } from "../../types/TypeBoard";

import { media, theme } from "../../styles/theme";

import DragNDrop from "../../components/common/DragNDrop";
import Dropdown from "../../components/common/Dropdown";

import Button from "../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { DateInput, TextInput } from "../../styles/assets/Input";
import P from "../../styles/assets/P";
import Loading from "../../components/common/Loading";
import TextEditor from "../../components/common/TextEditor";

import { tokenInterface } from "../../types/TypeCommon";

import { jwtDecode } from "jwt-decode";

const PolicyNotice = styled(FlexDiv)`
    padding: 15px 20px;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
    border: 1px solid ${theme.color.bgColor};
    border-radius: 5px;

    ${media.mobile} {
        align-items: flex-start;
        padding: 14px 16px;
    }
`;

const PolicyIcon = styled(Div)`
    flex: 0 0 25px;
`;

const PolicyText = styled(P).attrs({ $whiteSpace: "normal" })`
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;
    line-height: 1.5;
`;

const FormCard = styled(Div)`
    min-width: 0;
`;

const FormHeader = styled(FlexDiv)`
    width: 100%;
    padding: 20px;
    justify-content: space-between;
    border-bottom: 1px solid ${theme.color.border};

    ${media.mobile} {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
        padding: 16px;
    }
`;

const FormSection = styled(Div)`
    width: 100%;
    min-width: 0;
    padding: 20px;

    ${media.mobile} {
        padding: 12px;
    }
`;

const ResponsiveTextInput = styled(TextInput)`
    max-width: 100%;

    ${media.mobile} {
        height: 52px;
        font-size: ${theme.fontSize.lg};
    }
`;

const ResponsiveDateInput = styled(DateInput)`
    max-width: 100%;
    box-sizing: border-box;

    ${media.mobile} {
        height: 52px;
        font-size: ${theme.fontSize.lg};
    }
`;

const SubmitButton = styled(Button)`
    width: 400px;
    max-width: 100%;

    ${media.mobile} {
        width: 100%;
    }
`;

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


    const access = useRecoilValue(tokenAccess);
    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

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

    useEffect(() => {
        if (update === 'update') {
            if (detail?.writerId !== userId) {
                alert('본인이 작성한 글만 수정 가능합니다.')
                navigate(-1)
            }
        }
    }, [detail])


    return (
        <FlexDiv width="100%">
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Container $alignitems="start">
                    <Div width="100%" $margin="0 0 30px 0">
                        <PolicyNotice>
                            <PolicyIcon width="25px" height="25px" $margin="0 10px 0 0">
                                <Img src="/images/triangle-warning_purple.svg"></Img>
                            </PolicyIcon>
                            <Div width="100%">
                                <PolicyText color="bgColor" fontSize="sm" fontWeight={700}>
                                    웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
                                </PolicyText>
                            </Div>
                        </PolicyNotice>

                        <FormCard width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
                            <FormHeader>
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
                            </FormHeader>
                            <FormSection>
                                <Div width="100%">
                                    <ResponsiveTextInput
                                        width="100%"
                                        height="60px"
                                        placeholder="제목을 입력해주세요"
                                        fontSize="xl"
                                        $borderRadius={5}
                                        ref={(el: never) => (inputRef.current[0] = el)}
                                        defaultValue={detail?.title}
                                    ></ResponsiveTextInput>
                                </Div>
                            </FormSection>

                            {(url === "sponsor" || url === "usage") && (
                                <FormSection>
                                    <Div width="100%">
                                        <ResponsiveDateInput
                                            width="100%"
                                            height="60px"
                                            fontSize="xl"
                                            $borderRadius={5}
                                            placeholder="후원 날짜를 입력해주세요"
                                            ref={(el: never) => (inputRef.current[2] = el)}
                                            defaultValue={detail?.dateHistory?.split("T")[0]}
                                        />
                                    </Div>
                                </FormSection>
                            )}

                            <FormSection>
                                <DragNDrop fileFetch menuId={currentMenuId} />
                            </FormSection>
                            <FormSection>
                                <TextEditor
                                    ref={(el: never) => (inputRef.current[1] = el)}
                                    initialContent={detail?.content}
                                />
                            </FormSection>
                        </FormCard>

                        <FlexDiv width="100%" $margin="30px 0 0 0">
                            <SubmitButton
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={2}
                                $padding="15px 30px"
                                onClick={() => sendInput()}
                            >
                                {update === "create" ? <P color="wh">작성하기</P> : <P color="wh">수정하기</P>}
                            </SubmitButton>
                        </FlexDiv>
                    </Div>
                </Container>
            )}
        </FlexDiv>
    );
};

export default BoardCreate;
