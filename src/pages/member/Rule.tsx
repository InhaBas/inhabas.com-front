import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Loading from '../../components/common/Loading';
import { policyQueries } from '../../queries/policy';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import { H2 } from '../../styles/assets/H';
import Img from '../../styles/assets/Img';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';

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
  // 라우트가 rule/:id라 id는 항상 있다
  const { id = '' } = useParams();

  const movePage = () => {
    navigate('/');
  };

  // 정책 api 불러오기. id가 바뀌면 새 응답이 올 때까지 다시 로딩을 보여 준다
  const { data: policy } = useQuery(policyQueries.detail({ id }));

  return (
    <>
      {!policy ? (
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
                  {policy.title}
                </RuleTitle>
              </FlexDiv>

              <Hr />
            </RuleHeader>

            <RuleBody width="100%" height="85%" overflow="auto">
              <div>
                <P
                  $whiteSpace="pre-wrap"
                  $lineHeight={2.8}
                  dangerouslySetInnerHTML={{ __html: policy.content }}
                />
              </div>

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
