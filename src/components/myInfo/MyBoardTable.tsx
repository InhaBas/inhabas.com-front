import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { DateFunction } from '../../functions/dateFunction';
import { myInfoQueries } from '../../queries/myInfo';
import { Div, FlexDiv } from '../../styles/assets/Div';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';

const TableScroll = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  -webkit-overflow-scrolling: touch;

  ${media.tablet} {
    & > div {
      width: 680px;
    }

    & > div > div {
      height: auto !important;
      min-height: 45px;
      flex-wrap: nowrap;
    }

    p {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
`;

const MyBoardTable = () => {
  const widthList = [15, 65, 15];
  const headerInfo = ['게시판 유형', '제목', '작성일'];

  const { formatDateDay } = DateFunction();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { data: boardListData } = useQuery(myInfoQueries.boardList({ page, size: 7 }));

  const boardList =
    boardListData?.data.map((item) => ({
      type: item.menuName,
      title: item.title,
      dateCreated: formatDateDay({ date: item.dateCreated }),

      id: item.id,
      menuType: item.menuType === 'STORAGE' ? 'opensource' : item.menuType.toLowerCase(),
    })) ?? [];

  return (
    <>
      {!boardListData ? (
        <FlexDiv width="100%" height="30vh">
          <Loading />
        </FlexDiv>
      ) : (
        <>
          <TableScroll>
            <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
              <FlexDiv
                width="100%"
                height="45px"
                $borderT={`1px solid ${theme.color.grey1}`}
                $justifycontent="space-between"
                $backgroundColor="wh"
              >
                {headerInfo.map((item: string, idx: number) => (
                  <FlexDiv
                    key={`headerInfo${idx}`}
                    $minWidth={`${widthList[idx]}%`}
                    $padding="10px"
                    $justifycontent={idx === 1 ? 'start' : 'center'}
                  >
                    <Div>
                      <P fontWeight={700}>{item}</P>
                    </Div>
                  </FlexDiv>
                ))}
              </FlexDiv>
              {boardList.length !== 0 ? (
                boardList.map((element: object, idx: number) => (
                  <FlexDiv
                    key={`contentItem${idx}`}
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                  >
                    {Object.values(element)
                      .slice(0, 3)
                      .map((item: any, idx: number) => (
                        <FlexDiv
                          $pointer={idx === 1 ? true : false}
                          key={`itemValue${idx}`}
                          $minWidth={`${widthList[idx]}%`}
                          $padding="10px"
                          $justifycontent={idx === 1 ? 'start' : 'center'}
                        >
                          {idx === 1 ? (
                            <Div>
                              <P
                                color="bgColor"
                                fontWeight={700}
                                onClick={() =>
                                  navigate(
                                    `/board/${
                                      (element as { menuType: string }).menuType
                                    }/detail/${(element as { id: number }).id}`,
                                  )
                                }
                              >
                                {item}
                              </P>
                            </Div>
                          ) : (
                            <Div>
                              <P>{item}</P>
                            </Div>
                          )}
                        </FlexDiv>
                      ))}
                  </FlexDiv>
                ))
              ) : (
                <FlexDiv
                  width="100%"
                  height="45px"
                  $borderT={`1px solid ${theme.color.grey1}`}
                  $padding="0 18px"
                  $backgroundColor="wh"
                >
                  <Div>
                    <P>게시글이 존재하지 않습니다</P>
                  </Div>
                </FlexDiv>
              )}
            </Div>
          </TableScroll>
          {boardList.length !== 0 && (
            <Pagination
              currentPage={page}
              totalPage={boardListData.pageInfo.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
};

export default MyBoardTable;
