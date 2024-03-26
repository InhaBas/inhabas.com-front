import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { theme } from "../../../../styles/theme";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import useFetch from "../../../../Hooks/useFetch";
import { fileIdList } from "../../../../Recoil/backState";
import { menuId } from "../../../../Recoil/frontState";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { Date, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import DragNDrop from "../../../Common/DragNDrop";

const BankSupportCreate = () => {
    const navigate = useNavigate();
    const currentMenuId = useRecoilValue(menuId);
    const [files, setFiles] = useRecoilState(fileIdList);
    const [infos, setInfos] = useState({
        title: "",
        details: "",
        dateUsed: "",
        outcome: 0,
        account: "",
    });
    const [postSupport, fetchPostSupport] = useFetch();

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
        console.log(inputData);
        fetchPostSupport("/budget/application", "POST", "token", inputData);
    };

    useEffect(() => {
        console.log(postSupport);
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
                                value={infos.dateUsed}
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
                            <P color="wh">작성하기</P>
                        </Button>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default BankSupportCreate;
