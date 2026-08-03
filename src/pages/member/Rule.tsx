import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useFetch from "../../hooks/useFetch";
import { policyInfo } from "../../recoil/backState";
import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import { H2 } from "../../styles/assets/H";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import Loading from "../../components/common/Loading";
import { media } from "../../styles/theme";

const Hr = styled.hr`
    clear: both;
    margin: 2rem 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
`;

const RulePage = styled(FlexDiv)`
    ${media.mobile} {
        height: auto;
        min-height: 100vh;
        align-items: flex-start;
    }
`;

const RulePanel = styled(Div)`
    ${media.tabletOnly} {
        width: 60%;
        padding: 0 4%;
    }

    ${media.mobile} {
        width: 100%;
        height: auto;
        min-height: 100vh;
        margin: 0;
        padding: 32px 20px;
    }
`;

const RuleHeader = styled(FlexDiv)`
    ${media.mobile} {
        flex-wrap: nowrap;
        align-items: flex-start;
    }
`;

const RuleLogo = styled(FlexDiv)`
    flex-shrink: 0;

    ${media.mobile} {
        width: 34px;
        margin-right: 12px;
    }
`;

const RuleTitle = styled(H2)`
    ${media.mobile} {
        font-size: 22px;
        white-space: normal;
        overflow-wrap: anywhere;
    }
`;

const RuleBody = styled(Div)`
    p {
        white-space: pre-wrap;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }

    ${media.mobile} {
        height: auto;
        max-height: calc(100vh - 150px);
    }
`;

const RuleBackground = styled(Div)`
    ${media.tabletOnly} {
        width: 40%;
    }

    ${media.mobile} {
        display: none;
    }
`;

const Rule = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const movePage = () => {
        navigate("/");
    };

    const [policyData, policyFetchData] = useFetch();
    const [policy, setPolicy] = useRecoilState(policyInfo);
    const [isLoading, setIsLoading] = useState(true);

    // 정책 api 불러오기
    useEffect(() => {
        setIsLoading(true);
        policyFetchData(`/policy/${id}`, "GET");
        setPolicy(null);
    }, [id]);

    useEffect(() => {
        if (policyData) {
            setPolicy(policyData);
            setIsLoading(false);
        }
    }, [policyData]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <RulePage width="100%" height="100vh">
                    <RulePanel
                        width="56%"
                        height="80%"
                        direction="column"
                        $padding="0 5%"
                        $margin="0 auto"
                        $justifycontent="start"
                    >
                        <RuleHeader width="100%" $justifycontent="start">
                            <RuleLogo width="40px" $margin="0 20px 0 0" onClick={() => movePage()} $pointer>
                                <Img src="/images/ibas-main-logo_purple.png" />
                            </RuleLogo>
                            <FlexDiv>
                                <RuleTitle fontSize="xxl" fontWeight={700}>
                                    {policy?.title}
                                </RuleTitle>
                            </FlexDiv>

                            <Hr />
                        </RuleHeader>

                        <RuleBody width="100%" height="85%" overflow="auto">
                            {policy && (
                                <div>
                                    <P
                                        $whiteSpace="pre-wrap"
                                        $lineHeight={2.8}
                                        dangerouslySetInnerHTML={{ __html: policy?.content }}
                                    />
                                </div>
                            )}

                            <FlexDiv width="100%" $margin="50px 0 0 0">
                                <Button
                                    $padding="15px 20px"
                                    $backgroundColor="bgColor"
                                    $HBackgroundColor="bgColorHo"
                                    $borderRadius={3}
                                    onClick={() => movePage()}
                                >
                                    <P color="wh"> 홈화면으로 돌아가기 </P>
                                </Button>
                            </FlexDiv>
                        </RuleBody>
                    </RulePanel>
                    <RuleBackground width="44%" height="100vh" overflow="hidden">
                        <Img src="/images/member-background.jpg" />
                    </RuleBackground>
                </RulePage>
            )}
        </>
    );
};

export default Rule;
