import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import Loading from '../../components/common/Loading';
import TextEditor from '../../components/common/TextEditor';
import { policyMutations, policyQueries } from '../../queries/policy';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';

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
  const appliedPolicies = useRef<unknown[]>([]);

  const { data: policy1 } = useQuery(policyQueries.detail({ id: '1' }));
  const { data: policy2 } = useQuery(policyQueries.detail({ id: '2' }));
  const { data: policy3 } = useQuery(policyQueries.detail({ id: '3' }));
  const policies = useMemo(
    () => (policy1 && policy2 && policy3 ? [policy1, policy2, policy3] : null),
    [policy1, policy2, policy3],
  );
  const updateMutation = useMutation(policyMutations.update());

  const changeRule = (idx: number) => {
    let inputData = {
      // title: editorTitleRef.current[idx - 1]?.value,
      content: editorRef.current[idx - 1].getInstance().getMarkdown(),
    };

    updateMutation.mutate(
      { id: String(idx), body: inputData },
      {
        onSuccess: () => {
          alert('정상적으로 적용되었습니다.');
        },
      },
    );
  };

  /*
    조회 결과를 에디터 초기값으로 넣는다. 수정 뒤 재조회가 끝나면 옛 화면처럼 3개 모두 새 값으로 덮어쓴다.
    재조회는 회칙마다 따로 끝난다. 새로 받은 회칙만 넣어야 방금 저장한 에디터가 아직 옛 값인 캐시로 돌아가지 않는다
  */
  useEffect(() => {
    policies?.forEach((item, idx) => {
      if (appliedPolicies.current[idx] === item) return;
      appliedPolicies.current[idx] = item;
      editorRef.current[idx]?.getInstance().setMarkdown(item.content);
    });
  }, [policies]);

  return (
    <>
      {!policies ? (
        <FlexDiv width="100%" height="30vh">
          <Loading />
        </FlexDiv>
      ) : (
        policies.map((item, idx) => (
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
                  <P fontWeight={600}>{item.title} 설정</P>
                </Div>
              </FlexDiv>
            </FlexDiv>
            <RuleContent width="100%" $padding="50px">
              <TextInput
                defaultValue={item.title}
                placeholder="정책 제목을 입력해주세요"
                width="100%"
                height="55px"
                $margin="0 0 30px 0"
                fontSize="lg"
                ref={(el: never) => (editorTitleRef.current[idx] = el)}
              />
              <TextEditor
                key={`editor${idx}`}
                ref={(editor) => (editorRef.current[idx] = editor)}
              />

              <FlexDiv width="100%">
                <Button
                  $backgroundColor="bgColor"
                  $HBackgroundColor="bgColorHo"
                  $padding="10px 15px"
                  $borderRadius={3}
                  $margin="30px 0 0 0"
                  disabled={updateMutation.isPending}
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
