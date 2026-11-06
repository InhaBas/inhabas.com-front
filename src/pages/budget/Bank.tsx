import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';

import BankTable from '../../components/budget/BankTable';
import Dropdown from '../../components/common/Dropdown';
import Loading from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import { bankHistoryQueries, useOnBankHistoryChanged } from '../../queries/bankHistory';
import { Div, FlexDiv } from '../../styles/assets/Div';
import { H2 } from '../../styles/assets/H';
import { media } from '../../styles/theme';

const BankPage = styled(FlexDiv)`
  min-width: 0;

  &,
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
`;

const BankContent = styled(FlexDiv)`
  width: 100%;
  min-width: 0;
  padding: 80px;

  ${media.tablet} {
    padding: 48px 24px;
  }

  ${media.mobile} {
    padding: 32px 16px;
  }
`;

const BankInner = styled(FlexDiv)`
  width: 90vw;
  max-width: 90vw;
  min-width: 0;

  ${media.tablet} {
    width: 100%;
    max-width: 100%;
  }
`;

const BankHeader = styled(FlexDiv)`
  box-sizing: border-box;

  ${media.mobile} {
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
    padding: 16px;
  }
`;

const Bank = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [page, setPage] = useState(1);

  const { data: bankYears } = useQuery(bankHistoryQueries.years());
  // 옛 화면처럼 연도 목록에 연도가 하나라도 있을 때만 내역을 조회한다
  const hasYears = Boolean(bankYears?.[0]);
  const { data: bankHistoryData } = useQuery({
    ...bankHistoryQueries.list({ year: selectedYear, page, size: 15 }),
    enabled: hasYears,
  });

  // 내역을 추가·수정·삭제하면 1페이지로 돌아간다
  useOnBankHistoryChanged(() => setPage(1));

  const handleSelectedYear = (value: string) => {
    if (value === selectedYear) return;
    setSelectedYear(value);
    setPage(1);
  };

  const sortedYears = [...(bankYears ?? [])].sort((a, b) => b - a).map((year) => String(year));

  return (
    <BankPage width="100%">
      {!bankHistoryData ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <BankContent>
          <BankInner>
            <BankHeader
              $border="3px solid"
              $borderColor="border"
              width="98%"
              $justifycontent="space-between"
              $padding="20px"
              $margin="0 0 50px 0"
            >
              <Div>
                <H2 fontSize="xl" fontWeight={700}>
                  전체 회계 내역
                </H2>
              </Div>
              <Div>
                <Dropdown
                  label="전체보기"
                  options={['전체보기', ...sortedYears]}
                  value={['', ...sortedYears]}
                  onChange={handleSelectedYear}
                  purple
                />
              </Div>
            </BankHeader>
            <BankTable histories={bankHistoryData.page.data} balance={bankHistoryData.balance} />

            {bankHistoryData.page.data.length !== 0 && (
              <Pagination
                currentPage={page}
                totalPage={bankHistoryData.page.pageInfo.totalPages}
                onPageChange={setPage}
              />
            )}
          </BankInner>
        </BankContent>
      )}
    </BankPage>
  );
};

export default Bank;
