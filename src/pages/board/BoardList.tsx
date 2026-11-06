import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import BoardNavigate from '../../components/board/BoardNavigate';
import BoardSearch from '../../components/board/BoardSearch';
import Loading from '../../components/common/Loading';
import NavigateTable from '../../components/common/NavigateTable';
import Pagination from '../../components/common/Pagination';
import { GetRoleAuthorization } from '../../functions/authFunctions';
import { DateFunction } from '../../functions/dateFunction';
import { boardQueries } from '../../queries/board';
import { contestQueries } from '../../queries/contest';
import { contestOrder } from '../../recoil/frontState';
import A from '../../styles/assets/A';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { media } from '../../styles/theme';
import Contest from '../activity/Contest';

const StickyDiv = styled(Div)`
  position: sticky;
  top: 50px;
  flex: 0 0 auto;
  width: 293px;

  ${media.tablet} {
    position: static;
    top: auto;
    width: 100%;
    padding: 0;
    margin-bottom: 30px;
  }
`;

const BoardContainer = styled(Container)`
  flex-wrap: nowrap;

  ${media.tablet} {
    flex-direction: column;
  }
`;

const BoardContent = styled(Div)`
  flex: 1 1 auto;
  min-width: 0;
  width: calc(100% - 293px);
  padding: 0 15px;

  ${media.tablet} {
    width: 100%;
    padding: 0;
  }
`;

const BOARD_PAGE_SIZE = 10;
const CONTEST_PAGE_SIZE = 4;

const BoardList = () => {
  const headerInfo = ['no.', '', '제목', '작성자', '작성일'];
  const widthList = [45, 0, 450, 120, 120];

  const { formatDateDay } = DateFunction();

  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname.split('/')[2];
  const isContestBoard = ['contest', 'activity'].includes(url);
  const [contestOrderBy, setContestOrderBy] = useRecoilState(contestOrder);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(''); // 제출한 검색어
  const {
    isAuthorizedOverSecretary,
    isAuthorizedOverDeactivate,
    isAuthorizedOverBasic,
    isAuthorizedOverExecutives,
  } = GetRoleAuthorization();

  // 게시판(라우트가 달라도 같은 BoardList가 남는다)이나 공모전 정렬이 바뀌면 1페이지로 돌아가고 검색을 푼다.
  // 옛 화면도 이때 검색 없이 첫 페이지를 다시 조회했다
  const filterKey = `${url}${contestOrderBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
    setSearch('');
  }

  const { data: boardListData } = useQuery({
    ...boardQueries.list({ board: url, page, size: BOARD_PAGE_SIZE, search }),
    enabled: !isContestBoard,
  });
  const { data: contestListData } = useQuery({
    ...contestQueries.list({
      contestType: url === 'activity' ? 'activity' : 'contest',
      page,
      size: CONTEST_PAGE_SIZE,
      search,
      orderBy: contestOrderBy === '&orderBy=DUE_DATE' ? 'DUE_DATE' : 'ALL',
    }),
    enabled: isContestBoard,
  });
  const listData = isContestBoard ? contestListData : boardListData;

  const boardList =
    !isContestBoard && boardListData
      ? boardListData.data.map((item, idx) => ({
          number: boardListData.pageInfo.pageNumber * boardListData.pageInfo.pageSize + idx + 1,
          id: item.id,
          title: item.title,
          writerName: item.writerName,
          dateCreated: formatDateDay({ date: item.dateCreated }),
          isPinned: item.isPinned,
        }))
      : [];
  const boardPinnedList =
    !isContestBoard && boardListData
      ? boardListData.pinnedData?.map((item) => ({
          id: item.id,
          title: item.title,
          writerName: item.writerName,
          dateCreated: formatDateDay({ date: item.dateCreated }),
          isPinned: item.isPinned,
        }))
      : [];
  const contestList = isContestBoard && contestListData ? contestListData.data : [];

  const checkWritingAuthorization = () => {
    // 총무
    if (['sponsor', 'usage', 'notice', 'executive'].includes(url) && isAuthorizedOverSecretary) {
      return true;
    }
    // 비활동 회원
    else if (['free', 'question', 'suggest'].includes(url) && isAuthorizedOverDeactivate) {
      return true;
    }
    // 활동 회원
    else if (['opensource', 'contest', 'alpha', 'beta'].includes(url) && isAuthorizedOverBasic) {
      return true;
    }
    // 회장단
    else if (['notice'].includes(url) && isAuthorizedOverExecutives) {
      return true;
    }
    return false;
  };

  // 검색은 1페이지부터 보여 준다
  const handleSearch = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  useEffect(() => {
    setContestOrderBy('&orderBy=ALL');
  }, [url]);

  return (
    <>
      {!listData ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <BoardContainer $alignitems="start">
          <StickyDiv $padding="0 15px">
            <Div width="100%" $margin="0 0 30px 0">
              <BoardSearch onSearch={handleSearch} />
            </Div>
            {url !== 'sponsor' && url !== 'usage' && (
              <Div width="100%">
                <BoardNavigate />
              </Div>
            )}
          </StickyDiv>
          <BoardContent>
            <Suspense fallback={<Img src="/images/loading.svg" />}>
              {['contest', 'activity'].includes(url) ? (
                <Contest contests={contestList} />
              ) : (
                <NavigateTable
                  width={widthList}
                  header={headerInfo}
                  contents={boardList}
                  pinnedContents={boardPinnedList}
                  url="detail"
                />
              )}
            </Suspense>
            {/* 공모전 게시판의 게시글 작성은 Contest 컴포넌트에서 따로 작성 */}
            {checkWritingAuthorization() && contestList.length === 0 && (
              <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                <Button
                  display="flex"
                  $backgroundColor="bgColor"
                  $margin="0 10px 0 0"
                  $padding="12px 15px"
                  $borderRadius={30}
                  $HBackgroundColor="bgColorHo"
                  onClick={() => {
                    navigate(`/board/${url}/create`);
                  }}
                >
                  <FlexDiv height="15px">
                    <Div width="12px" height="12px" $margin="0 10px 0 0">
                      <Img src="/images/plus_white.svg" />
                    </Div>
                  </FlexDiv>
                  <Div $pointer height="15px">
                    <A color="wh" fontSize="sm" $hoverColor="wh">
                      게시글 작성
                    </A>
                  </Div>
                </Button>
              </FlexDiv>
            )}
            {/* 게시판 */}
            {boardList.length !== 0 && (
              <Pagination
                currentPage={page}
                totalPage={listData.pageInfo.totalPages}
                onPageChange={setPage}
              />
            )}
            {/* 공모전 */}
            {contestList.length !== 0 && (
              <Pagination
                currentPage={page}
                totalPage={listData.pageInfo.totalPages}
                onPageChange={setPage}
              />
            )}
          </BoardContent>
        </BoardContainer>
      )}
    </>
  );
};

export default BoardList;
