import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { SupportStatusFilter } from '../../api/bankSupport';
import BankSupportTable, { BankSupportRow } from '../../components/budget/BankSupportTable';
import Dropdown from '../../components/common/Dropdown';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { DateFunction } from '../../functions/dateFunction';
import { bankSupportQueries } from '../../queries/bankSupport';
import A from '../../styles/assets/A';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { media } from '../../styles/theme';

const SupportPage = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 0;

  &,
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
`;

const SupportContent = styled(Div)`
  min-width: 0;

  ${media.tablet} {
    width: 100%;
  }
`;

const SupportActions = styled(FlexDiv)`
  min-width: 0;

  ${media.mobile} {
    justify-content: flex-start;
    margin-top: 16px;
  }
`;

const BankSupport = () => {
  const { formatDateDay } = DateFunction();
  const navigate = useNavigate();

  const [statusValue, setStatusValue] = useState<SupportStatusFilter>('');
  const [page, setPage] = useState(1);
  const { data: bankListData } = useQuery(
    bankSupportQueries.list({ status: statusValue, page, size: 10 }),
  );

  const moveCreate = () => {
    navigate('/bank/support/create');
  };

  // select 값 선택에 따른 state 변경 이벤트
  const handleStatusChange = (value: string) => {
    // 선택된 값을 업데이트하고 1페이지로 돌아간다
    setStatusValue(value as SupportStatusFilter);
    setPage(1);
  };

  const bankList: BankSupportRow[] = bankListData
    ? bankListData.data.map((item, idx) => ({
        number: bankListData.pageInfo.pageNumber * bankListData.pageInfo.pageSize + idx + 1,
        title: item.title,
        applicantName: item.applicantName,
        dateCreated: formatDateDay({ date: item.dateCreated }),
        status:
          item.status === 'PENDING'
            ? '승인 대기'
            : item.status === 'APPROVED'
              ? '승인 완료'
              : item.status === 'REJECTED'
                ? '승인 거절'
                : item.status === 'COMPLETED'
                  ? '처리 완료'
                  : 'error',
        id: item.id,
      }))
    : [];

  return (
    <>
      {!bankListData ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <SupportPage>
          <Container $alignitems="start">
            <SupportContent width="80%">
              <Div>
                <Dropdown
                  label="전체보기"
                  options={['전체보기', '승인 대기', '승인 완료', '승인 거절', '처리 완료']}
                  value={['', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']}
                  onChange={handleStatusChange}
                  purple
                />
              </Div>
              <BankSupportTable bankList={bankList} />
              <SupportActions width="100%" $justifycontent="end" $margin="20px 0 0 0">
                <Button
                  $backgroundColor="bgColor"
                  $margin="0 10px 0 0"
                  $padding="12px 15px"
                  $borderRadius={30}
                  $HBackgroundColor="bgColorHo"
                  onClick={() => moveCreate()}
                >
                  <FlexDiv width="100%">
                    <Div width="12px" height="12px" $margin="0 10px 0 0">
                      <Img src="/images/plus_white.svg" />
                    </Div>
                    <Div $pointer>
                      <A color="wh" fontSize="sm" $hoverColor="wh">
                        신청하기
                      </A>
                    </Div>
                  </FlexDiv>
                </Button>
              </SupportActions>
              {bankList.length !== 0 && (
                <Pagination
                  currentPage={page}
                  totalPage={bankListData.pageInfo.totalPages}
                  onPageChange={setPage}
                />
              )}
            </SupportContent>
          </Container>
        </SupportPage>
      )}
    </>
  );
};

export default BankSupport;
