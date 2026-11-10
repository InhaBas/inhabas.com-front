import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { GetRoleAuthorization } from '../../functions/authFunctions';
import { ConvertLabel } from '../../functions/convertLabelFunctions';
import { myInfoMutations, myInfoQueries } from '../../queries/myInfo';
import { checkOne } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { Checkbox } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import Dropdown from '../common/Dropdown';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';

const TableScroll = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;

  & > div {
    width: max(100%, 1050px);
    min-width: 1050px;
  }

  & > div > div {
    flex-wrap: nowrap;
  }

  ${media.tablet} {
    & > div > div {
      height: auto !important;
      min-height: 45px;
      align-items: stretch;
    }

    p {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
`;

const MyChangeNameUserTable = () => {
  const { isAuthorizedOverVice } = GetRoleAuthorization();
  const { convertStatusLabel } = ConvertLabel();

  const widthList = [50, 100, 150, 200, 200, 200, 100];
  const headerInfo = ['', '이름', '학번', '학과', '변경 전 이름', '변경 후 이름', '현황'];

  const [check, setCheck] = useRecoilState(checkOne);
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const { data: user, isFetching } = useQuery(myInfoQueries.nameRequestList({ page, size: 10 }));
  const acceptMutation = useMutation(myInfoMutations.handleNameRequest());
  // 다시 받는 동안에도 막는다. 옛 화면은 이때 본문을 스피너로 가렸고, 막지 않으면 이전 체크로 한 번 더 보낼 수 있다
  const isChanging = acceptMutation.isPending || isFetching;

  const userList =
    user?.data.map((item, idx) => ({
      id: item.id,
      idxNum: idx + 1,
      name: item.beforeName,
      studentId: item.studentId,
      major: item.major,
      beforeName: item.beforeName,
      afterName: item.afterName,
      status: convertStatusLabel(item.status),
    })) ?? [];

  // 옛 화면처럼 새 응답을 받을 때마다 체크를 지운다. 같은 내용이 다시 오면 data 참조가 그대로라 지우지 않는다
  useEffect(() => {
    setCheck(0);
  }, [user, setCheck]);

  // 단일 체크박스 클릭시 checkedList update
  const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
    const targetCheck = e.target.checked;
    if (targetCheck === true) {
      setCheck(memberId);
    }
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handleValueChange = (value: string) => {
    // 선택된 값을 업데이트
    setValue(value);
  };

  // 이름 변경 승인·거절. 성공하면 옛 화면처럼 1페이지로 돌아가고, 응답 내용과 관계없이 체크를 지운다
  const acceptName = () => {
    if (isChanging) return;
    if (value !== '') {
      acceptMutation.mutate(
        { id: check, status: value },
        {
          onSuccess: () => {
            setCheck(0);
            setPage(1);
          },
        },
      );
    }
  };

  return (
    <>
      {!user ? (
        <FlexDiv width="100%" height="30vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Div width="100%">
          {isAuthorizedOverVice && (
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
              <Div $minWidth="100px" $margin="0 10px 0 0 ">
                <Dropdown
                  label="승인 여부"
                  options={['승인', '거절']}
                  value={['pass', 'fail']}
                  onChange={handleValueChange}
                />
              </Div>

              <Button
                $backgroundColor="bgColor"
                $HBackgroundColor="bgColorHo"
                $borderRadius={3}
                $padding="6px 12px"
                height="40px"
                disabled={isChanging}
                onClick={() => {
                  acceptName();
                }}
              >
                <FlexDiv $margin="0 5px 0 0">
                  <FlexDiv width="15px" $margin="0 10px 0 0">
                    <Img src="/images/check_white.svg" />
                  </FlexDiv>
                  <FlexDiv>
                    <P color="wh" fontSize="sm">
                      적용
                    </P>
                  </FlexDiv>
                </FlexDiv>
              </Button>
            </FlexDiv>
          )}

          <TableScroll>
            <Div width="100%">
              <FlexDiv
                width="100%"
                height="45px"
                $justifycontent="space-evenly"
                $backgroundColor="wh"
                $borderB={`1.5px solid ${theme.color.grey1}`}
              >
                <FlexDiv $padding="10px" width="40px"></FlexDiv>
                {headerInfo.map((item: string, idx: number) => (
                  <FlexDiv
                    key={`headerInfo${idx}`}
                    $minWidth={`${widthList[idx]}px`}
                    $padding="10px"
                  >
                    <P $center fontWeight={700}>
                      {item}
                    </P>
                  </FlexDiv>
                ))}
              </FlexDiv>
              {userList.length !== 0 ? (
                userList.map((element, idx: number) => (
                  <FlexDiv
                    key={`contentItem${idx}`}
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-evenly"
                    $backgroundColor="wh"
                  >
                    {isAuthorizedOverVice && (
                      <FlexDiv $padding="10px">
                        <Checkbox
                          checked={check === element.id ? true : false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            checkClickEvent(e, element.id)
                          }
                        />
                      </FlexDiv>
                    )}

                    {Object.entries(element).map(([key, value], idx: number) => {
                      if (key !== 'id') {
                        let color = 'bk';
                        let fontStyle: React.CSSProperties = {};

                        if (key === 'status') {
                          if (value === '거절') {
                            color = '#f56642';
                            fontStyle.fontStyle = 'italic';
                          } else if (value === '승인') {
                            color = '#155724';
                            fontStyle.fontStyle = 'italic';
                          }
                        }
                        return (
                          <FlexDiv
                            key={`itemValue${idx}`}
                            $minWidth={`${widthList[idx - 1]}px`}
                            $padding="10px"
                          >
                            <P
                              $center
                              style={{ color: color, ...fontStyle }}
                              fontWeight={idx === 1 ? 800 : 500}
                            >
                              {value}
                            </P>
                          </FlexDiv>
                        );
                      }
                      return null;
                    })}
                  </FlexDiv>
                ))
              ) : (
                <FlexDiv width="100%" $padding="10px">
                  <Div>
                    <P>이름 수정을 요청한 회원이 존재하지 않습니다.</P>
                  </Div>
                </FlexDiv>
              )}
            </Div>
          </TableScroll>

          {userList.length !== 0 && (
            <Pagination
              currentPage={page}
              totalPage={user.pageInfo.totalPages}
              onPageChange={setPage}
            />
          )}
        </Div>
      )}
    </>
  );
};

export default MyChangeNameUserTable;
