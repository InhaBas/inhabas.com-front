import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { MouseEvent } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { GetRoleAuthorization } from '../../functions/authFunctions';
import { bankHistoryMutations } from '../../queries/bankHistory';
import { useMyRole } from '../../queries/myInfo';
import { tokenAccess } from '../../recoil/backState';
import { modalInfo, modalOpen } from '../../recoil/frontState';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { bankHistoryInterface } from '../../types/TypeBankHistory';
import { tokenInterface } from '../../types/TypeCommon';

const TableScrollArea = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.div`
  width: max-content;
  min-width: max(1010px, 100%);
`;

const TableRow = styled(FlexDiv)`
  flex-wrap: nowrap;

  ${media.tablet} {
    height: auto;
    min-height: 45px;
    align-items: stretch;
  }
`;

const TableCell = styled(FlexDiv)`
  flex-shrink: 0;
`;

const TableText = styled(P)`
  ${media.tablet} {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;
  }
`;

const TableActions = styled(FlexDiv)`
  box-sizing: border-box;

  ${media.tablet} {
    padding-right: 20px;
    margin-right: 0;
  }
`;

const formatAmount = (amount: number) => String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// 표의 열 순서대로 값을 담는다. 아래에서 Object.values(...).slice(1, 7)로 사용일~지출액을 그린다
const toTableRow = (data: bankHistoryInterface) => ({
  id: data.id,
  사용일: data.dateUsed.split('T')[0],
  게시일: data.dateCreated.split('T')[0],
  수정일: data.dateUpdated.split('T')[0],
  내용: data.title,
  수입액: formatAmount(data.income),
  지출액: formatAmount(data.outcome),
  writerId: data.memberIdInCharge,
});

interface BankTableProps {
  histories: bankHistoryInterface[];
  balance: number;
}

const BankTable = ({ histories, balance }: BankTableProps) => {
  const { isSecretary } = GetRoleAuthorization();
  const role = useMyRole();
  const access = useRecoilValue(tokenAccess);

  let decoded: tokenInterface | undefined;
  if (access !== 'default') {
    decoded = jwtDecode(access) as tokenInterface;
  }
  const userId = decoded?.memberId;

  const setOpen = useSetRecoilState(modalOpen);
  const setModalInfo = useSetRecoilState(modalInfo);

  const deleteMutation = useMutation(bankHistoryMutations.delete());

  const clickDetailEvent = (ev: MouseEvent, name: string, selectedId: number) => {
    setOpen(true);
    setModalInfo({ type: 'bankHistory', content: String(selectedId) });
  };

  const clickUpdateEvent = (ev: MouseEvent, name: string, selectedIdx: number) => {
    setOpen(true);
    setModalInfo({ type: 'bankHistoryUpdate', content: String(selectedIdx) });
  };

  const clickDeleteEvent = (ev: MouseEvent, name: string, selectedId: number) => {
    if (deleteMutation.isPending) return;
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      // 목록 갱신과 1페이지 복귀는 팩토리의 무효화와 Bank의 useOnBankHistoryChanged가 맡는다
      deleteMutation.mutate(selectedId, {
        onSuccess: () => {
          alert('내역이 정상적으로 삭제되었습니다.');
        },
      });
    }
  };

  const clickPostEvent = () => {
    setOpen(true);
    setModalInfo({ type: 'bankHistoryPost' });
  };

  const headerInfo = ['사용일', '게시일', '수정일', '내용', '수입액', '지출액', '증빙'];
  const widthList = [120, 120, 120, 350, 100, 100, 40];

  const contents = histories.map(toTableRow);

  return (
    <>
      <TableScrollArea>
        <Table>
          <TableRow
            width="100%"
            height="45px"
            $borderT={`1px solid ${theme.color.grey1}`}
            $justifycontent="space-between"
            $backgroundColor="wh"
          >
            {headerInfo.map((item: string, idx: number) => (
              <TableCell key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                <TableText $center fontWeight={700}>
                  {item}
                </TableText>
              </TableCell>
            ))}
            {role && isSecretary && (
              <TableCell $minWidth="60px" $padding="10px">
                <TableText $center fontWeight={700}>
                  비고
                </TableText>
              </TableCell>
            )}
          </TableRow>
          {contents?.map((element: any, idx: number) => (
            <TableRow
              key={`contentItem${idx}`}
              width="100%"
              height="45px"
              $borderT={`1px solid ${theme.color.grey1}`}
              $justifycontent="space-between"
              $backgroundColor="wh"
            >
              {Object.values(element)
                .slice(1, 7)
                .map((item: any, idx: number) => (
                  <TableCell
                    key={`itemValue${idx}`}
                    $minWidth={`${widthList[idx]}px`}
                    $padding="10px"
                  >
                    <TableText $center fontWeight={500}>
                      {item === '0' ? '-' : item}
                    </TableText>
                  </TableCell>
                ))}
              <TableCell $minWidth="50px" $padding="10px">
                <Div
                  width="15px"
                  onClick={(e: MouseEvent) => clickDetailEvent(e, 'ss', element?.id)}
                  $pointer
                >
                  <Img src="/images/file_grey.svg" />
                </Div>
              </TableCell>
              {role && isSecretary && (
                <TableCell $minWidth={'60px'} $padding="10px" $justifycontent="flex-end">
                  {element?.writerId === userId && (
                    <>
                      <FlexDiv
                        width="15px"
                        $margin="0 6px"
                        onClick={(e: MouseEvent) => clickUpdateEvent(e, 'ss', element?.id)}
                        $pointer
                      >
                        <Img src="/images/pencil_grey.svg" />
                      </FlexDiv>
                      <FlexDiv
                        width="15px"
                        onClick={(e: MouseEvent) => clickDeleteEvent(e, 'ss', element?.id)}
                        $pointer={!deleteMutation.isPending}
                      >
                        <Img src="/images/trash_grey.svg" />
                      </FlexDiv>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </Table>
      </TableScrollArea>

      {role && isSecretary && (
        <TableActions
          width="100%"
          $justifycontent="flex-end"
          $padding="0 20px 10px 0"
          $margin="0 20px 0 0"
        >
          <FlexDiv width="20px" height="20px" radius={50} onClick={() => clickPostEvent()} $pointer>
            <Img src="/images/plus_grey.svg" />
          </FlexDiv>
        </TableActions>
      )}

      <FlexDiv width="100%">
        <Div $padding="10px 20px" $backgroundColor="bgColor" radius={50}>
          <P color="wh">잔액 : ₩ {formatAmount(balance)}</P>
        </Div>
      </FlexDiv>
    </>
  );
};

export default BankTable;
