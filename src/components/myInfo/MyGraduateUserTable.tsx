import { useMutation, useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { GetRoleAuthorization } from '../../functions/authFunctions';
import { ConvertLabel } from '../../functions/convertLabelFunctions';
import { memberMutations, memberQueries, useOnMemberListChanged } from '../../queries/member';
import { __checkedList } from '../../recoil/frontState';
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

interface MyGraduateUserTableProps {
  // 페이지가 표를 카드로 감싸고 머리글에 인원수를 보여 준다. 인원수는 표가 조회한 결과에서 바로 읽는다
  children: (table: ReactNode, total: number) => ReactNode;
}

const MyGraduateUserTable = ({ children }: MyGraduateUserTableProps) => {
  const { isAuthorizedOverVice, isAuthorizedExceptExecutives, isSecretary } =
    GetRoleAuthorization();
  const { convertRoleLabel, convertTypeLabel } = ConvertLabel();

  const widthList = [50, 100, 150, 200, 200, 130, 130, 50];
  const headerInfo = ['', '이름', '학번', '학과', '전화번호', '역할', '소속', '기수'];

  // checkedList를 같은 페이지 내에서 MyNewUserTable 이라는 컴포넌트가 쓰고 있기 때문에, _checkedList를 사용함
  const [check, setCheck] = useRecoilState(__checkedList);
  const [roleValue, setRoleValue] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const [CategoryValue, setCategoryValue] = useState('');
  const [searchValue, setSearchValue] = useState(''); // 입력 중인 검색어
  const [search, setSearch] = useState(''); // 제출한 검색어
  const [page, setPage] = useState(1);

  const path = useLocation().pathname;
  // 검색 요청은 옛 화면처럼 백엔드 기본값과 같은 10개씩 받는다
  const size = search === '' && path === '/staff/member/graduateStudents' ? 15 : 10;

  const { data: user, isFetching } = useQuery(memberQueries.graduatedList({ page, size, search }));
  const roleMutation = useMutation(memberMutations.updateRole('graduated'));
  const typeMutation = useMutation(memberMutations.updateType('graduated'));
  // 다시 받는 동안에도 막는다. 옛 화면은 이때 본문을 스피너로 가렸고, 막지 않으면 이전 체크로 한 번 더 보낼 수 있다
  const isChanging = roleMutation.isPending || typeMutation.isPending || isFetching;

  const userList =
    user?.data.map((item, idx) => ({
      id: idx + 1,
      name: item.name,
      studentId: item.studentId,
      major: item.major,
      phoneNumber: item.phoneNumber,
      role: convertRoleLabel(item.role),
      type: convertTypeLabel(item.memberType),
      generation: item.generation,
      memberId: item.memberId,
    })) ?? [];

  // 옛 화면처럼 새 응답을 받을 때마다 체크를 지운다. 같은 내용이 다시 오면 data 참조가 그대로라 지우지 않는다
  useEffect(() => {
    setCheck([]);
  }, [user, setCheck]);

  // 이 표나 동아리원 표의 변경이 성공하면 옛 화면처럼 검색 없는 1페이지로 돌아간다
  // 체크도 지운다. 새 응답이 같은 내용이면 위 effect가 돌지 않으므로 성공 시점에 지운다
  useOnMemberListChanged('graduated', () => {
    setCheck([]);
    setPage(1);
    setSearch('');
  });

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
      tmpList.push(...userList.map((item) => item.memberId));
    }
    setCheck(tmpList);
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handleRoleChange = (value: string) => {
    // 선택된 값을 업데이트
    setRoleValue(value);
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handleTypeChange = (value: string) => {
    // 선택된 값을 업데이트
    setTypeValue(value);
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handleCategoryChange = (value: string) => {
    // 선택된 값을 업데이트
    setCategoryValue(value);
  };

  // role 변경. 재조회는 성공한 뒤에 뮤테이션 정의가 한다
  const changeRole = () => {
    if (isChanging) return;
    if (roleValue !== '') {
      roleMutation.mutate({ memberIdList: check, role: roleValue });
    }
  };

  // type 변경. 재조회는 성공한 뒤에 뮤테이션 정의가 한다
  const changeType = () => {
    if (isChanging) return;
    if (typeValue !== '') {
      typeMutation.mutate({ memberIdList: check, type: typeValue });
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const searchStudent = () => {
    // 동작 보존: 옛 화면의 오타를 그대로 둔다. `$size=15`가 검색어에 붙어 결과가 거의 없고, 아래 Enter 키도 동작하지 않는다
    if (searchValue.trim() !== '') {
      setSearch(`${searchValue}$size=15`);
      setPage(1);
    }
  };

  // 엔터키 press 핸들러
  const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Entdsaer') {
      searchStudent();
    }
  };

  return children(
    <Div width="100%">
      {!user ? (
        <FlexDiv width="100%" height="30vh">
          <Loading />
        </FlexDiv>
      ) : (
        <>
          {isSecretary && (
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
              <Div $minWidth="100px" $margin="0 10px 0 0 ">
                <Dropdown
                  label="관리"
                  options={['활동회원', '비활동회원']}
                  value={['BASIC', 'DEACTIVATED']}
                  onChange={handleRoleChange}
                />
              </Div>
              <Button
                $backgroundColor="bgColor"
                $HBackgroundColor="bgColorHo"
                $borderRadius={3}
                $padding="6px 12px"
                height="40px"
                disabled={isChanging}
                onClick={() => changeRole()}
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

          {isAuthorizedOverVice && (
            <FlexDiv $justifycontent="start" $margin="0 0 20px 0">
              <Div $minWidth="100px" $margin="0 10px 0 0 ">
                <Dropdown
                  label="관리"
                  options={['역할', '소속']}
                  value={['ROLE', 'TYPE']}
                  onChange={handleCategoryChange}
                />
              </Div>
              {CategoryValue === 'ROLE' && (
                <Div $minWidth="100px" $margin="0 10px 0 0 ">
                  <Dropdown
                    label="선택"
                    options={['회장', '부회장', '운영진', '총무', '활동회원', '비활동회원']}
                    value={[
                      'CHIEF',
                      'VICE_CHIEF',
                      'EXECUTIVES',
                      'SECRETARY',
                      'BASIC',
                      'DEACTIVATED',
                    ]}
                    onChange={handleRoleChange}
                  />
                </Div>
              )}
              {CategoryValue === 'TYPE' && (
                <Div $minWidth="100px" $margin="0 10px 0 0 ">
                  <Dropdown
                    label="선택"
                    options={['학부생', '대학원생', '교수']}
                    value={['UNDERGRADUATE', 'BACHELOR', 'PROFESSOR']}
                    onChange={handleTypeChange}
                  />
                </Div>
              )}
              <Button
                $backgroundColor="bgColor"
                $HBackgroundColor="bgColorHo"
                $borderRadius={3}
                $padding="6px 12px"
                height="40px"
                disabled={isChanging}
                onClick={() => (CategoryValue === 'TYPE' ? changeType() : changeRole())}
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
                {isAuthorizedExceptExecutives && (
                  <FlexDiv $padding="10px">
                    {userList.length !== 0 && (
                      <Checkbox
                        checked={check.length === userList.length}
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
                    {isAuthorizedExceptExecutives && (
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
                  </FlexDiv>
                ))
              ) : (
                <FlexDiv width="100%" $padding="10px">
                  <Div>
                    <P>회원이 존재하지 않습니다.</P>
                  </Div>
                </FlexDiv>
              )}
            </Div>
          </TableScroll>
          {path === '/staff/member/graduateStudents' && (
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
          {userList.length !== 0 && (
            <Pagination
              currentPage={page}
              totalPage={user.pageInfo.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </Div>,
    user?.pageInfo.totalElements ?? 0,
  );
};

export default MyGraduateUserTable;
