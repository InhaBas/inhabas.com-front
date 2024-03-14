import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { theme } from "../../../styles/theme";

import DragNDrop from "../../Common/DragNDrop";
import Dropdown from "../../Common/Dropdown";
import TextEditor from "../../Common/TextEditor";

import { useRecoilState } from "recoil";
import useFetch from "../../../Hooks/useFetch";
import { selectedFile } from "../../../Recoil/frontState";
import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const BoardCreate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];

    const inputRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pinValue, setPinValue] = useState("");
    const [postData, postFetchData] = useFetch();
    const [files, setFiles] = useRecoilState(selectedFile);

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

        if (check && inputRef.current[1].getInstance().getMarkdown().trim() === "") {
            alert("내용을 입력해주세요");
            check = false;
        }

        if (check) {
            setIsLoading(true); // 로딩 상태 설정
            const inputData = {
                title: inputRef.current[0].value,
                content: inputRef.current[1].getInstance().getMarkdown(),
                pinOption: pinValue !== "" ? pinValue : "0",
            };

            const jsonData = JSON.stringify(inputData);

            const formdata = new FormData();
            formdata.append("form", new Blob([jsonData], { type: "application/json" }));

            for (let i = 0; i < files.length; i++) {
                formdata.append("files", files[i]);
            }

            postFetchData(`/board/${url}`, "POST", "token", formdata, true);
        }
    };

    useEffect(() => {
        if (postData) {
            setIsLoading(false); // 로딩 상태 해제
            alert("글이 정상적으로 등록되었습니다");
            navigate(`/board/${url}`);
        }
    });

    return (
        <FlexDiv width="100%">
            {isLoading && (
                <FlexDiv width="100%" height="100%" $justifycontent="center" $alignitems="center">
                    <FlexDiv width="10%">
                        <Img src="/images/loading.svg" />
                    </FlexDiv>
                </FlexDiv>
            )}
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
                            <Div>
                                <Dropdown
                                    label="상단고정여부"
                                    options={["고정안함", "2주고정", "영구고정"]}
                                    value={["0", "1", "2"]}
                                    onChange={handlePinChange}
                                />
                            </Div>
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
                                ></TextInput>
                            </Div>
                        </Div>

                        <Div width="100%" $padding="20px">
                            <DragNDrop />
                        </Div>
                        <Div width="100%" $padding="20px">
                            <TextEditor ref={(el: never) => (inputRef.current[1] = el)} />
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
                            <P color="wh">작성하기</P>
                        </Button>
                    </FlexDiv>
                </Div>
            </Container>
        </FlexDiv>
    );
};

export default BoardCreate;
