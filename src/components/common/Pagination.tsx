import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { paginationPropsInterface } from '../../types/TypeCommon';

const PaginationContainer = styled(FlexDiv)`
  ${media.mobile} {
    flex-wrap: nowrap;
    gap: 4px 0;
    padding: 16px 0;
  }
`;

const PageButton = styled(FlexDiv)`
  width: 45px;
  height: 45px;
  margin: 5px;
  padding: 5px;

  ${media.mobile} {
    flex: 0 0 auto;
    width: 32px;
    height: 32px;
    margin: 1px;
    padding: 2px;
  }
`;

const NavigationButtonWrapper = styled(Div)`
  margin: 0 8px;

  ${media.mobile} {
    flex: 0 0 auto;
    margin: 0;
  }
`;

const NavigationButton = styled(FlexDiv)`
  width: 45px;
  height: 45px;
  margin: 5px;
  padding: 5px;

  ${media.mobile} {
    width: 32px;
    height: 32px;
    margin: 0;
    padding: 2px;
  }
`;

const Pagination = (props: paginationPropsInterface) => {
  const { totalPage } = props;
  // 과도기: onPageChange를 받으면 새 방식(부모가 page를 들고 조회한다), 아니면 옛 방식(paginationFetch로 직접 요청한다).
  // 옛 방식은 회원 관리 표 PR에서 지운다
  const [legacyPage, setLegacyPage] = useState(1);
  const [pageChange, setPageChange] = useState(false);
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);
  const [allLeftHovered, setAllLeftHovered] = useState(false);
  const [allRightHovered, setAllRightHovered] = useState(false);

  const currentPage = props.onPageChange !== undefined ? props.currentPage : legacyPage;

  const goToPage = (page: number) => {
    if (props.onPageChange !== undefined) {
      props.onPageChange(page);
    } else {
      setLegacyPage(page);
      setPageChange(true);
    }
  };

  const makePageNum = () => {
    const startPage = Math.max(1, currentPage - 2); // 현재 페이지를 중앙에 위치시키기 위한 조정

    let pageNumList = [];
    for (let i = startPage; i < startPage + 5 && i <= totalPage; i++) {
      pageNumList.push(
        <PageButton
          onClick={() => goToPage(i)}
          key={`page${i}`}
          display="flex"
          $pointer
          $backgroundColor={i !== currentPage ? 'wh' : 'bgColor'}
          $border={`2px solid ${theme.color.bk}`}
          radius={50}
        >
          <Div>
            <P color={i !== currentPage ? 'textColor' : 'wh'} fontWeight={700}>
              {i}
            </P>
          </Div>
        </PageButton>,
      );
    }

    return pageNumList;
  };

  // 옛 방식 전용. 새 방식에서는 legacyPage를 쓰지 않고, 1페이지 복귀는 부모가 명시적으로 한다
  useEffect(() => {
    setLegacyPage(1);
  }, [totalPage]);

  // 옛 방식 전용. 새 방식에서는 pageChange가 켜지지 않는다
  useEffect(() => {
    if (props.onPageChange !== undefined) return;
    const { fetchUrl, search, size, token, paginationFetch } = props;
    let paginationFetchUrl = fetchUrl;
    if (!paginationFetchUrl.includes('?')) {
      paginationFetchUrl += `?page=${legacyPage - 1}`;
    } else {
      paginationFetchUrl += `&page=${legacyPage - 1}`;
    }
    if (size !== undefined) {
      paginationFetchUrl += `&size=${size}`;
    } else {
      paginationFetchUrl += '&size=10';
    }
    if (search !== undefined) {
      paginationFetchUrl += search;
    }

    if (pageChange === true) {
      if (token) {
        paginationFetch(paginationFetchUrl, 'GET', 'token');
      } else {
        paginationFetch(paginationFetchUrl, 'GET');
      }

      setPageChange(false);
    }
  }, [pageChange]);

  return (
    <PaginationContainer width="100%" $padding="20px 0">
      {totalPage !== 1 && (
        <>
          <NavigationButtonWrapper
            onMouseEnter={() => setAllLeftHovered(true)}
            onMouseLeave={() => setAllLeftHovered(false)}
            onClick={() => {
              if (currentPage !== 1) {
                goToPage(1);
              }
            }}
            $pointer
          >
            <NavigationButton
              radius={50}
              $backgroundColor={allLeftHovered ? 'bgColor' : 'wh'}
              $pointer
            >
              <FlexDiv width="13px">
                {allLeftHovered ? (
                  <Img src="/images/angles-left_white.svg" />
                ) : (
                  <Img src="/images/angles-left_purple.svg" />
                )}
              </FlexDiv>
            </NavigationButton>
          </NavigationButtonWrapper>

          <NavigationButtonWrapper
            onMouseEnter={() => setLeftHovered(true)}
            onMouseLeave={() => setLeftHovered(false)}
            onClick={() => {
              if (currentPage !== 1) {
                goToPage(currentPage - 1);
              }
            }}
            $pointer
          >
            <NavigationButton
              radius={50}
              $backgroundColor={leftHovered ? 'bgColor' : 'wh'}
              $pointer
            >
              <FlexDiv width="10px">
                {leftHovered ? (
                  <Img src="/images/arrow-left_white.svg" />
                ) : (
                  <Img src="/images/arrow-left_purple.svg" />
                )}
              </FlexDiv>
            </NavigationButton>
          </NavigationButtonWrapper>
        </>
      )}

      {makePageNum()}

      {totalPage !== 1 && (
        <>
          <NavigationButtonWrapper
            onMouseEnter={() => setRightHovered(true)}
            onMouseLeave={() => setRightHovered(false)}
            onClick={() => {
              if (currentPage !== totalPage) {
                goToPage(currentPage + 1);
              }
            }}
            $pointer
          >
            <NavigationButton
              radius={50}
              $backgroundColor={rightHovered ? 'bgColor' : 'wh'}
              $pointer
            >
              <FlexDiv width="10px">
                {rightHovered ? (
                  <Img src="/images/arrow-right_white.svg" />
                ) : (
                  <Img src="/images/arrow-right_purple.svg" />
                )}
              </FlexDiv>
            </NavigationButton>
          </NavigationButtonWrapper>

          <NavigationButtonWrapper
            onMouseEnter={() => setAllRightHovered(true)}
            onMouseLeave={() => setAllRightHovered(false)}
            onClick={() => goToPage(totalPage)}
            $pointer
          >
            <NavigationButton
              radius={50}
              $backgroundColor={allRightHovered ? 'bgColor' : 'wh'}
              $pointer
            >
              <FlexDiv width="13px">
                {allRightHovered ? (
                  <Img src="/images/angles-right_white.svg" />
                ) : (
                  <Img src="/images/angles-right_purple.svg" />
                )}
              </FlexDiv>
            </NavigationButton>
          </NavigationButtonWrapper>
        </>
      )}
    </PaginationContainer>
  );
};

export default Pagination;
