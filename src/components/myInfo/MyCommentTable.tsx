import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';

import { myInfoQueries } from '../../queries/myInfo';
import A from '../../styles/assets/A';
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

    p,
    a {
      white-space: normal;
      overflow-wrap: anywhere;
    }
  }
`;

const MyCommentTable = () => {
  const headerInfo = ['게시판 유형', '댓글 내용', '작성일'];
  const widthList = [15, 65, 15];

  const [page, setPage] = useState(1);
  const { data: commentListData } = useQuery(myInfoQueries.commentList({ page, size: 7 }));

  // 아래 표는 Object.values(element).slice(3, 6)으로 menuName·content·dateCreated를 꺼내므로 키 순서를 바꾸지 않는다
  const commentList =
    commentListData?.data.map((item) => ({
      id: item.id,
      menuId: item.menuId,
      menuType: item.menuType,
      menuName: item.menuName,
      content: item.content,
      dateCreated: item.dateCreated.split('T')[0],
      isDeleted: item.isDeleted,
    })) ?? [];

  return (
    <>
      {!commentListData ? (
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
              {commentList.length === 0 ? (
                <FlexDiv
                  width="100%"
                  height="45px"
                  $borderT={`1px solid ${theme.color.grey1}`}
                  $padding="0 18px"
                  $backgroundColor="wh"
                >
                  <Div>
                    <P>내가 작성한 댓글이 존재하지 않습니다</P>
                  </Div>
                </FlexDiv>
              ) : (
                commentList.map((element: object, idx: number) => (
                  <FlexDiv
                    key={`contentItem${idx}`}
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                  >
                    {Object.values(element)
                      .slice(3, 6)
                      .map((item: any, idx: number) => (
                        <FlexDiv
                          key={`itemValue${idx}`}
                          width={`${widthList[idx]}%`}
                          $padding="10px"
                          $justifycontent={idx === 1 ? 'space-between' : 'center'}
                        >
                          {idx === 1 ? (
                            <FlexDiv width="100%" $justifycontent="space-between">
                              <Div width="90%">
                                <P fontWeight={700}>
                                  {(element as { isDeleted: boolean }).isDeleted
                                    ? `${item} (삭제)`
                                    : item}
                                </P>
                              </Div>
                              <Div width="10%">
                                <A
                                  color="bgColor"
                                  href={`/board/${(
                                    element as { menuType: string }
                                  ).menuType.toLowerCase()}/detail/${
                                    (element as { id: number }).id
                                  }`}
                                >
                                  원문보기 ▶
                                </A>
                              </Div>
                            </FlexDiv>
                          ) : (
                            <Div>
                              <P>{item}</P>
                            </Div>
                          )}
                        </FlexDiv>
                      ))}
                  </FlexDiv>
                ))
              )}

              {/* <Pagination /> */}
              {commentList.length !== 0 && (
                <Pagination
                  currentPage={page}
                  totalPage={commentListData.pageInfo.totalPages}
                  onPageChange={setPage}
                />
              )}
            </Div>
          </TableScroll>
        </>
      )}
    </>
  );
};

export default MyCommentTable;
