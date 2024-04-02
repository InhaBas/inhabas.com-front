import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { theme } from "../../../../styles/theme";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useFetch from "../../../../Hooks/useFetch";
import { bankDetailDataInfo, fileIdList, tokenAccess } from "../../../../Recoil/backState";
import { menuId, refetch, selectedFile } from "../../../../Recoil/frontState";
import { supportDetailInterface } from "../../../../Types/TypeBank";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { Date, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import DragNDrop from "../../../Common/DragNDrop";

const BankSupportCreate = () => {
    const navigate = useNavigate();
    const paramID = useParams().id;
    const currentMenuId = useRecoilValue(menuId);
    const [isLoading, setIsLoading] = useState(true);
    const [update, setUpdate] = useState("create");
    const [getData, getFetchData] = useFetch();
    const [files, setFiles] = useRecoilState(fileIdList);
    const [detail, setDetail] = useRecoilState(bankDetailDataInfo);
    const access = useRecoilValue(tokenAccess);
    const setSelectedFile = useSetRecoilState(selectedFile);
    const [fileId, setFileList] = useRecoilState(fileIdList);
    const setReload = useSetRecoilState(refetch);

    const [infos, setInfos] = useState({
        title: "",
        details: "",
        dateUsed: "",
        outcome: 0,
        account: "",
    });
    const [postSupport, fetchPostSupport] = useFetch();

    useEffect(() => {
        if (paramID) {
            setUpdate("update");
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (update == "update") {
            getFetchData(`/budget/application/${paramID}`, "GET", "token");
        }
    }, [update, access]);

    useEffect(() => {
        if (getData) {
            setDetail(getData);
            setInfos((prev) => ({
                ...prev,
                title: getData.title,
                details: getData.details,
                dateUsed: getData.dateUsed,
                outcome: getData.outcome,
                account: getData.account,
            }));

            setIsLoading(false);

            // DragNDrop update 설정
            const files = [...getData.receipts.map((item: supportDetailInterface) => item)];
            setSelectedFile(files);
            const fileIds = [...getData.receipts.map((item: supportDetailInterface) => item.id)];
            setFiles(fileIds);
            // DragNDrop reload true일 때만 불러온 파일들 렌더링 할 있음
            setReload(true);
        }
        return () => {
            setDetail(null);
            // DragNDrop fileList 초기화
            setFiles([]);
        };
    }, [getData]);

    const checkIsCompletedContents = () => {
        if (infos.title === "") {
            alert("제목을 입력해주세요");
            return false;
        }

        if (infos.dateUsed === "") {
            alert("지출일을 입력해주세요");
            return false;
        }

        if (infos.details === "") {
            alert("지출내역을 입력해주세요");
            return false;
        }

        if (infos.outcome === 0) {
            alert("올바른 지출액을 입력해주세요");
            return false;
        }

        if (infos.account === "") {
            alert("입금받을 계좌를 입력해주세요");
            return false;
        }

        if (files.length === 0) {
            alert("증빙자료를 첨부해주세요");
            return false;
        }

        return true;
    };

    const clickPostEvent = () => {
        // 필요한 정보가 다 채워졌는지 확인
        if (checkIsCompletedContents() === false) {
            return;
        }

        // 파일 담기
        const inputData = {
            dateUsed: (infos.dateUsed += "T00:00:00"),
            title: infos.title,
            details: infos.details,
            outcome: Number(infos.outcome),
            account: infos.account,
            files: files,
        };
        {
            update === "create"
                ? fetchPostSupport("/budget/application", "POST", "token", inputData)
                : fetchPostSupport(`/budget/application/${paramID}`, "POST", "token", inputData);
        }
    };

    useEffect(() => {
        if (postSupport) {
            alert("예산 지원 신청이 정상적으로 등록되었습니다.");
            // setReload(true);
            setFiles([]);
            navigate(`/bank/support`);
        }
    }, [postSupport]);

    return (
        <FlexDiv width="100%">
            <Container $alignitems="start">
                <Div width="100%" $margin="0 0 30px 0">
                    <Div $border="1px solid" $borderColor="border" radius={5} width="100%" $margin="30px 0 0 0">
                        <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                            <P fontWeight={600}>게시글 제목</P>
                        </Div>
                        <Div width="100%" $padding="20px">
                            <Div width="100%">
                                <TextInput
                                    width="100%"
                                    height="60px"
                                    placeholder="제목을 입력해주세요"
                                    fontSize="xl"
                                    $borderRadius={5}
                                    value={infos.title}
                                    onChange={(e: any) => setInfos((prev) => ({ ...prev, title: e.target.value }))}
                                ></TextInput>
                            </Div>
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출일</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <Date
                                width="100%"
                                value={infos.dateUsed?.split("T")[0]}
                                onChange={(e: any) => setInfos((prev) => ({ ...prev, dateUsed: e.target.value }))}
                            />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출 내역</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput
                                width="100%"
                                placeholder="지출 목적 및 사용 내역을 입력하세요"
                                value={infos.details}
                                onChange={(e: any) => setInfos((prev) => ({ ...prev, details: e.target.value }))}
                            />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>지출 금액</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput
                                width="100%"
                                placeholder="정확한 지출액을 입력하세요"
                                value={infos.outcome}
                                onChange={(e: any) => setInfos((prev) => ({ ...prev, outcome: e.target.value }))}
                            />
                        </Div>
                    </Div>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>입금받을 계좌</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <TextInput
                                width="100%"
                                placeholder="은행명, 계좌번호, 예금주를 입력해주세요"
                                value={infos.account}
                                onChange={(e: any) => setInfos((prev) => ({ ...prev, account: e.target.value }))}
                            />
                        </Div>
                    </Div>

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <Div>
                                <P fontWeight={600}>증빙자료(영수증) 업로드</P>
                            </Div>
                        </FlexDiv>
                        <Div width="100%" $padding="20px">
                            <Div width="100%" $padding="20px">
                                <DragNDrop fileFetch menuId={currentMenuId} onlyImg />
                            </Div>
                        </Div>
                    </Div>

                    <FlexDiv width="100%" $margin="30px 0 0 0">
                        <Button
                            $backgroundColor="bgColor"
                            $HBackgroundColor="bgColorHo"
                            $borderRadius={2}
                            $padding="15px 30px"
                            width="400px"
                            onClick={() => clickPostEvent()}
                        >
                            {update === "create" ? <P color="wh">작성하기</P> : <P color="wh">수정하기</P>}
                        </Button>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default BankSupportCreate;
