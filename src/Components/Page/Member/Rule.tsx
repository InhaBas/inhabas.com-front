import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useFetch from "../../../Hooks/useFetch";
import { policyInfo } from "../../../Recoil/backState";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const Hr = styled.hr`
    clear: both;
    margin: 2rem 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
`;

const Rule = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const movePage = () => {
        navigate("/");
    };

    const [policyData, policyFetchData] = useFetch();
    const [policy, setPolicy] = useRecoilState(policyInfo);

    // 정책 api 불러오기
    useEffect(() => {
        policyFetchData(`/policy/${id}`, "GET");

        setPolicy(null);
    }, []);

    useEffect(() => {
        setPolicy(policyData);
    }, [policyData]);

    return (
        <>
            <FlexDiv width="100%" height="100vh">
                <FlexDiv
                    width="56%"
                    height="80%"
                    direction="column"
                    $padding="0 5%"
                    $margin="0 auto"
                    $justifycontent="start"
                >
                    <FlexDiv width="100%" $justifycontent="start">
                        <FlexDiv width="40px" $margin="0 20px 0 0" onClick={() => movePage()} $pointer>
                            <Img src="/images/ibas-main-logo_purple.png" />
                        </FlexDiv>
                        <FlexDiv>
                            <H2 fontSize="xxl" fontWeight={700}>
                                {policy?.title}
                            </H2>
                        </FlexDiv>
                    </FlexDiv>
                    <Hr />
                    <Div width="100%" height="80%" overflow="scroll">
                        {policy && (
                            <div>
                                <P
                                    $whiteSpace="pre-wrap"
                                    $lineHeight={2.8}
                                    dangerouslySetInnerHTML={{ __html: policy?.content }}
                                />
                            </div>
                        )}
                    </Div>
                </FlexDiv>
                <Div width="44%" height="100vh" overflow="hidden">
                    <Img src="/images/member-background.jpg" />
                </Div>
            </FlexDiv>
        </>
    );
};

export default Rule;
