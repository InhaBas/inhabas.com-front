import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { GetRoleAuthorization } from '../../functions/authFunctions';
import { memberMutations, memberQueries, useOnMemberListChanged } from '../../queries/member';
import { checkedList } from '../../recoil/frontState';
import A from '../../styles/assets/A';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { Checkbox, TextInput } from '../../styles/assets/Input';
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

    a,
    p {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
`;

const SearchControls = styled(FlexDiv)`
  min-width: 0;

  ${media.mobile} {
    width: 100%;

    > input {
      width: calc(100% - 54px) !important;
      min-width: 0;
    }
  }
`;

interface MyNewUserTableProps {
  // 페이지가 표를 카드로 감싸고 머리글에 인원수를 보여 준다. 인원수는 표가 조회한 결과에서 바로 읽는다
  children: (table: ReactNode, total: number) => ReactNode;
}

const MyNewUserTable = ({ children }: MyNewUserTableProps) => {
  const { isAuthorizedOverExecutives } = GetRoleAuthorization();

  const widthList = [50, 100, 70, 150, 170, 310, 160];
  const headerInfo = ['', '이름', '학년', '학번', '전화번호', '학과', '지원서보기'];

  const [check, setCheck] = useRecoilState(checkedList);
  const [passFailValue, setPassFailValue] = useState('');
  const [searchValue, setSearchValue] = useState(''); // 입력 중인 검색어
  const [search, setSearch] = useState(''); // 제출한 검색어
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const path = useLocation().pathname;
  // 검색 요청은 옛 화면처럼 백엔드 기본값과 같은 10개씩 받는다
  const size = search === '' && path === '/staff/member/newStudents' ? 15 : 10;

  const { data: newUserData, isFetching } = useQuery(
    memberQueries.unapprovedList({ page, size, search }),
  );
  const passFailMutation = useMutation(memberMutations.updateUnapproved());
  // 다시 받는 동안에도 막는다. 옛 화면은 이때 본문을 스피너로 가렸고, 막지 않으면 이전 체크로 한 번 더 보낼 수 있다
  const isChanging = passFailMutation.isPending || isFetching;

  const newUser =
    newUserData?.data.map((item, idx) => ({
      id: idx + 1,
      name: item.name,
      grade: item.grade,
      studentId: item.studentId,
      phoneNumber: item.phoneNumber,
      major: item.major,
      memberId: item.memberId,
    })) ?? [];

  // 옛 화면처럼 새 응답을 받을 때마다 체크를 지운다
  useEffect(() => {
    setCheck([]);
  }, [newUserData, setCheck]);

  // 합격·불합격이 성공하면 옛 화면처럼 검색 없는 1페이지로 돌아간다
  useOnMemberListChanged('unapproved', () => {
    setPage(1);
    setSearch('');
  });

  // 지원서 이동 함수
  const moveApplication = (application: number) => {
    navigate(`/staff/member/application/${application}`);
  };

  // 단일 체크박스 클릭시 checkedList update
  const checkClickEvent = (e: React.ChangeEvent<HTMLInputElement>, memberId: number) => {
    const targetCheck = e.target.checked;
    if (targetCheck === true) {
      setCheck((prev) => [...prev, memberId]);
    } else {
      setCheck((prev) => prev.filter((item) => item !== memberId));
    }
  };

  // 전체 체크박스 클릭시 checkedList update
  const checkAllClickEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmpList: number[] = [];
    if (e.target.checked) {
      tmpList.push(...newUser.map((item) => item.memberId));
    }
    setCheck(tmpList);
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handlePassFailChange = (value: string) => {
    // 선택된 값을 업데이트
    setPassFailValue(value);
  };

  // 합격·불합격. 재조회는 성공한 뒤에 뮤테이션 정의가 한다
  const passFail = () => {
    if (isChanging) return;
    if (passFailValue !== '') {
      passFailMutation.mutate({ memberIdList: check, state: passFailValue });
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const searchStudent = () => {
    if (searchValue.trim() !== '') {
      setSearch(searchValue);
      setPage(1);
    }
  };

  // 엔터키 press 핸들러
  const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchStudent();
    }
  };

  return children(
    <>
      {!newUserData ? (
        <FlexDiv width="100%" height="30vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Div width="100%">
          {isAuthorizedOverExecutives && (
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
              <Div $margin="0 10px 0 0 ">
                <Div width="105px">
                  <Dropdown
                    label="승인여부"
                    options={['합격', '불합격']}
                    value={['pass', 'fail']}
                    onChange={handlePassFailChange}
                  />
                </Div>
              </Div>
              <Button
                $backgroundColor="bgColor"
                $HBackgroundColor="bgColorHo"
                $borderRadius={3}
                $padding="6px 12px"
                height="40px"
                disabled={isChanging}
                onClick={() => passFail()}
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
                {isAuthorizedOverExecutives && (
                  <FlexDiv $padding="10px">
                    {newUser.length !== 0 && (
                      <Checkbox
                        checked={check.length === newUser.length}
                        onChange={checkAllClickEvent}
                      />
                    )}
                  </FlexDiv>
                )}
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
              {newUser.length !== 0 ? (
                newUser.map((element, idx: number) => (
                  <FlexDiv
                    key={`contentItem${idx}`}
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-evenly"
                    $backgroundColor="wh"
                  >
                    {isAuthorizedOverExecutives && (
                      <FlexDiv $padding="10px">
                        <Checkbox
                          checked={check.includes(element.memberId) ? true : false}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            checkClickEvent(e, element.memberId)
                          }
                        />
                      </FlexDiv>
                    )}

                    {Object.entries(element).map(([key, value], idx: number) => {
                      // memberId가 아닌 경우에만 FlexDiv를 렌더링합니다.
                      if (key !== 'memberId') {
                        return (
                          <FlexDiv
                            key={`itemValue${idx}`}
                            $minWidth={`${widthList[idx]}px`}
                            $padding="10px"
                          >
                            <A $center fontWeight={idx === 0 ? 800 : 500}>
                              {value}
                            </A>
                          </FlexDiv>
                        );
                      }
                      return null;
                    })}

                    <FlexDiv $padding="10px" $minWidth="160px" $pointer>
                      <A
                        $center
                        color="bgColor"
                        $hoverColor="textColor"
                        onClick={() => moveApplication(element.memberId)}
                      >
                        지원서보기
                      </A>
                    </FlexDiv>
                  </FlexDiv>
                ))
              ) : (
                <FlexDiv width="100%" $padding="10px">
                  <Div>
                    <P>입부 신청 대기중인 회원이 없습니다.</P>
                  </Div>
                </FlexDiv>
              )}
            </Div>
          </TableScroll>
          {path === '/staff/member/newStudents' && (
            <FlexDiv width="100%" $justifycontent="end" $margin="30px 0">
              <SearchControls>
                <TextInput
                  width="300px"
                  placeholder="이름이나 학번을 입력하세요"
                  $borderRadius="3px 0 0px 3"
                  onKeyDown={enterKeyDown}
                  onChange={handleSearchChange}
                />
                <Button
                  $backgroundColor="bgColor"
                  $HBackgroundColor="bgColorHo"
                  $padding="13px 20px"
                  $borderRadius="0 3px 3px 0"
                  onClick={searchStudent}
                >
                  <FlexDiv width="14px">
                    <Img src="/images/search_white.svg" />
                  </FlexDiv>
                </Button>
              </SearchControls>
            </FlexDiv>
          )}
          {newUser.length !== 0 && (
            <Pagination
              currentPage={page}
              totalPage={newUserData.pageInfo.totalPages}
              onPageChange={setPage}
            />
          )}
        </Div>
      )}
    </>,
    newUserData?.pageInfo.totalElements ?? 0,
  );
};

export default MyNewUserTable;
