import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { media, theme } from "../../styles/theme";

import useFetch from "../../hooks/useFetch";

import { totalPolicyInfo } from "../../recoil/backState";

import { policyInterface } from "../../types/TypeCommon";

import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { TextInput } from "../../styles/assets/Input";
import P from "../../styles/assets/P";
import Loading from "../../components/common/Loading";
import TextEditor from "../../components/common/TextEditor";

const RuleContent = styled(Div)`
    box-sizing: border-box;
    min-width: 0;

    ${media.tablet} {
        padding: 32px !important;
    }

    ${media.mobile} {
        padding: 16px !important;
    }
`;

const MyStaffRuleContainer = () => {
    const editorRef = useRef<any[]>([]);
    const editorTitleRef = useRef<any[]>([]);

    const [policyData1, policyFetchData1] = useFetch();
    const [policyData2, policyFetchData2] = useFetch();
    const [policyData3, policyFetchData3] = useFetch();
    const [policy, setPolicy] = useRecoilState(totalPolicyInfo);
    const [putPolicyData, fetchPutPolicyData] = useFetch();
    const [alertMessage, setAlertMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const changeRule = (idx: number) => {
        let inputData = {
            // title: editorTitleRef.current[idx - 1]?.value,
            content: editorRef.current[idx - 1].getInstance().getMarkdown(),
        };

        fetchPutPolicyData(`/policy/${idx}`, "PUT", "token", inputData);
        setAlertMessage(true);
    };

    // 정책 api 불러오기
    // api 바뀌면 다시 조정
    useEffect(() => {
        setIsLoading(true);
        policyFetchData1("/policy/1", "GET");
        setAlertMessage(false);
    }, [putPolicyData]);
    useEffect(() => {
        setIsLoading(true);
        policyFetchData2("/policy/2", "GET");
        setAlertMessage(false);
    }, [putPolicyData]);
    useEffect(() => {
        setIsLoading(true);
        policyFetchData3("/policy/3", "GET");
        setAlertMessage(false);
    }, [putPolicyData]);

    useEffect(() => {
        setPolicy([policyData1, policyData2, policyData3]);
    }, [policyData1, policyData2, policyData3]);

    useEffect(() => {
        if (policy && policy.length > 0) {
            policy.forEach((item: policyInterface, idx: number) => {
                if (editorRef.current[idx]) {
                    editorRef.current[idx].getInstance().setMarkdown(item?.content);
                }
            });
            setIsLoading(false);
        }
    }, [policy]);

    useEffect(() => {
        if (alertMessage) {
            alert("정상적으로 적용되었습니다.");
        }
    }, [alertMessage]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="30vh">
                    <Loading />
                </FlexDiv>
            ) : (
                policy &&
                policy.map((item: policyInterface, idx: number) => (
                    <Div
                        width="100%"
                        $border="1px solid"
                        $borderColor="border"
                        $margin=" 0 0 20px 0"
                        radius={6}
                        key={`policy${idx}`}
                    >
                        <FlexDiv
                            width=" 100%"
                            $padding="20px"
                            $justifycontent="start"
                            $borderB={`1px solid ${theme.color.border}`}
                        >
                            <FlexDiv>
                                <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                    <Img src="/images/user_purple.svg" />
                                </FlexDiv>
                                <Div>
                                    <P fontWeight={600}>{item?.title} 설정</P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <RuleContent width="100%" $padding="50px">
                            <TextInput
                                defaultValue={item?.title}
                                placeholder="정책 제목을 입력해주세요"
                                width="100%"
                                height="55px"
                                $margin="0 0 30px 0"
                                fontSize="lg"
                                ref={(el: never) => (editorTitleRef.current[idx] = el)}
                            />
                            <TextEditor key={`editor${idx}`} ref={(editor) => (editorRef.current[idx] = editor)} />

                            <FlexDiv width="100%">
                                <Button
                                    $backgroundColor="bgColor"
                                    $HBackgroundColor="bgColorHo"
                                    $padding="10px 15px"
                                    $borderRadius={3}
                                    $margin="30px 0 0 0"
                                    onClick={() => changeRule(idx + 1)}
                                >
                                    <FlexDiv>
                                        <FlexDiv $margin="0 10px 0 0">
                                            <Img src="/images/check_white.svg" />
                                        </FlexDiv>
                                        <FlexDiv>
                                            <P color="wh" fontSize="sm">
                                                적용하기
                                            </P>
                                        </FlexDiv>
                                    </FlexDiv>
                                </Button>
                            </FlexDiv>
                        </RuleContent>
                    </Div>
                ))
            )}
        </>
    );
};

export default MyStaffRuleContainer;
