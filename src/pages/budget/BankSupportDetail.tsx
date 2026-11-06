import { useMutation, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Carousel from '../../components/common/Carousel';
import Loading from '../../components/common/Loading';
import { GetRoleAuthorization } from '../../functions/authFunctions';
import { bankSupportMutations, bankSupportQueries } from '../../queries/bankSupport';
import { tokenAccess } from '../../recoil/backState';
import { carouselInitialState, carouselOpen, modalInfo, modalOpen } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import { H2 } from '../../styles/assets/H';
import Img from '../../styles/assets/Img';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { tokenInterface } from '../../types/TypeCommon';

const ScrollFlexDiv = styled(FlexDiv)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.color.grey1};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.color.grey};
  }

  &::-webkit-scrollbar-track {
    background: ${theme.color.grey2};
  }
`;

const SupportDetailPage = styled(FlexDiv)`
  min-width: 0;

  &,
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
`;

const StatusMessage = styled(P)`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const MetaInfo = styled(FlexDiv)`
  min-width: 0;

  ${media.mobile} {
    align-items: flex-start;
    gap: 8px;
  }
`;

const MetaText = styled(P)`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const DetailTitle = styled(H2)`
  overflow-wrap: anywhere;
`;

const DetailValue = styled(P)`
  white-space: pre-wrap;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const DetailActions = styled(FlexDiv)`
  gap: 10px;

  ${media.mobile} {
    justify-content: flex-start;

    & > button {
      margin: 0;
    }
  }
`;

const DecisionActions = styled(FlexDiv)`
  gap: 20px;

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    & > button {
      width: 100% !important;
      margin: 0 !important;
    }
  }
`;

const BankSupportDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const applicationId = location.pathname.split('/')[4];
  const access = useRecoilValue(tokenAccess);

  const { data: detail, isFetching } = useQuery(bankSupportQueries.detail({ id: applicationId }));
  const deleteMutation = useMutation(bankSupportMutations.delete());
  const statusMutation = useMutation(bankSupportMutations.updateStatus());
  /*
    상태를 바꾼 뒤 상세를 다시 받는 동안에도 상태 변경 버튼을 막는다. 옛 화면은 이때 본문을 스피너로 가려 누를 수 없었다.
    막지 않으면 재조회가 끝나기 전에 같은 상태 변경을 한 번 더 보낼 수 있다
  */
  const isChangingStatus = statusMutation.isPending || isFetching;
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const setOpen = useSetRecoilState(modalOpen);
  const setModalInfo = useSetRecoilState(modalInfo);
  const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
  const setCarouselInitial = useSetRecoilState(carouselInitialState);

  const { isSecretary } = GetRoleAuthorization();

  let decoded: tokenInterface | undefined;
  if (access !== 'default') {
    decoded = jwtDecode(access) as tokenInterface;
  }
  const userId = decoded?.memberId;

  const movePage = () => {
    navigate(`/bank/support/update/${applicationId}`);
  };

  const handleCarousel = (idx: number) => {
    setCarouselInitial(idx);
    setIsCarouselOpen(true);
  };

  const deleteDetail = () => {
    if (deleteMutation.isPending) return;
    if (window.confirm('정말 철회 하시겠습니까?')) {
      deleteMutation.mutate(
        { id: applicationId },
        {
          onSuccess: () => {
            alert('게시글이 삭제 되었습니다');
            navigate(`/bank/support`);
          },
        },
      );
    }
  };

  // 승인 완료·지급 완료. 거절은 모달(ModalBankSupportReject)이 같은 뮤테이션으로 한다
  const changeStatus = (status: 'APPROVED' | 'COMPLETED', statusInfo: string) => {
    if (isChangingStatus) return;
    statusMutation.mutate(
      { id: applicationId, body: { status } },
      {
        onSuccess: () => {
          alert(`'${statusInfo}' 처리 되었습니다. `);
        },
      },
    );
  };

  const makeStatusApproved = () => changeStatus('APPROVED', '승인 완료');

  const makeStatusCompeleted = () => changeStatus('COMPLETED', '지급 완료');

  const openModal = () => {
    setOpen(true);
    setModalInfo({ type: 'bankSupportStatus' });
  };

  return (
    <>
      {!detail ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : isCarouselOpen ? (
        <Carousel images={detail.receipts.map((image) => image.url)} />
      ) : (
        <SupportDetailPage width="100%" $border={`1px solid ${theme.color.grey1}`}>
          <Container>
            <Div width="100%" $margin="0 0 30px 0">
              <FlexDiv
                width="100%"
                radius={3}
                $backgroundColor={
                  detail.status === 'COMPLETED'
                    ? 'primary'
                    : detail.status === 'APPROVED'
                      ? 'green'
                      : detail.status === 'REJECTED'
                        ? 'danger'
                        : 'grey1'
                }
                $padding="15px 20px"
                $margin=" 0 0 20px 0"
              >
                <Div>
                  <StatusMessage
                    color={
                      detail.status === 'COMPLETED'
                        ? 'TextPrimary'
                        : detail.status === 'APPROVED'
                          ? 'TextGreen'
                          : detail.status === 'REJECTED'
                            ? 'TextDanger'
                            : 'bk'
                    }
                  >
                    {detail.status === 'COMPLETED'
                      ? '지급 완료'
                      : detail.status === 'APPROVED'
                        ? '승인 완료'
                        : detail.status === 'REJECTED'
                          ? `승인 거절 (사유: ${detail.rejectReason})`
                          : '승인 대기'}
                  </StatusMessage>
                </Div>
              </FlexDiv>
              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <MetaInfo
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <FlexDiv width="12px" $margin="0 5px 0 0">
                    <Img src="/images/user_grey.svg" />
                  </FlexDiv>
                  <Div>
                    <MetaText color="grey4" fontSize="sm">
                      By {detail.applicantName} |
                    </MetaText>
                  </Div>
                  <FlexDiv width="12px" $margin="0 5px ">
                    <Img src="/images/clock_grey.svg" />
                  </FlexDiv>
                  <Div>
                    <MetaText color="grey4" fontSize="sm">
                      {detail.dateCreated.split('T')[0]}
                    </MetaText>
                  </Div>
                </MetaInfo>
                <Div $padding="20px">
                  <DetailTitle fontSize="xl" $lineHeight={1.8} fontWeight={800}>
                    {detail.title}
                  </DetailTitle>
                </Div>
              </Div>
              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>지출날짜</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <DetailValue $lineHeight={1.5}>{detail.dateUsed.split('T')[0]}</DetailValue>
                </Div>
              </Div>

              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>지출내용</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <DetailValue $lineHeight={1.5}>{detail.details}</DetailValue>
                </Div>
              </Div>

              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>지출금액</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <DetailValue $lineHeight={1.5}>{detail.outcome}</DetailValue>
                </Div>
              </Div>

              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>사용인</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <DetailValue $lineHeight={1.5}>{detail.applicantName}</DetailValue>
                </Div>
              </Div>
              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>입금받을 계좌</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <DetailValue $lineHeight={1.5}>{detail.account}</DetailValue>
                </Div>
              </Div>

              <Div
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>증빙자료</P>
                  </Div>
                </FlexDiv>
                <ScrollFlexDiv width="100%" $padding="20px">
                  {detail.receipts.map((image, idx) => (
                    <Div
                      key={`supportImage${idx}`}
                      $pointer
                      $margin="0 30px 0 0"
                      onClick={() => handleCarousel(idx)}
                    >
                      <Div width="190px" height="190px">
                        <Img src={image.url} alt={`supportImage${idx}`} />
                      </Div>
                    </Div>
                  ))}
                </ScrollFlexDiv>
              </Div>
            </Div>
            {detail.status === 'PENDING' && detail.applicantId === userId && (
              <DetailActions width="100%" $justifycontent="end">
                <Button
                  display="flex"
                  $backgroundColor="bgColor"
                  $margin="0 10px 0 0"
                  $padding="12px 15px"
                  $borderRadius={30}
                  $HBackgroundColor="bgColorHo"
                  onClick={() => movePage()}
                >
                  <Div width="12px" $margin="0 10px 0 0">
                    <Img src="/images/pencil_white.svg" />
                  </Div>
                  <Div $pointer>
                    <P color="wh" fontSize="sm">
                      지원신청 수정
                    </P>
                  </Div>
                </Button>
                <Button
                  display="flex"
                  $backgroundColor="red"
                  $padding="12px 15px"
                  $borderRadius={30}
                  $HBackgroundColor="red"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteDetail()}
                >
                  <Div width="12px" $margin="0 10px 0 0">
                    <Img src="/images/trash_white.svg" />
                  </Div>
                  <Div $pointer>
                    <P color="wh" fontSize="sm">
                      지원신청 철회
                    </P>
                  </Div>
                </Button>
              </DetailActions>
            )}
            {isSecretary && detail.status === 'PENDING' && (
              <DecisionActions width="100%">
                <Button
                  width="300px"
                  $HBackgroundColor="success"
                  $padding="15px 20px"
                  $margin="0 20px 0 0"
                  $borderRadius={4}
                  border={`1px solid ${theme.color.success}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  disabled={isChangingStatus}
                  onClick={() => makeStatusApproved()}
                >
                  <FlexDiv width="100%">
                    <Div>
                      <P color={hovered ? 'wh' : 'success'} fontWeight={700}>
                        승인 완료
                      </P>
                    </Div>
                  </FlexDiv>
                </Button>
                <Button
                  width="300px"
                  $HBackgroundColor="red"
                  $padding="15px 20px"
                  $borderRadius={4}
                  border={`1px solid ${theme.color.red}`}
                  onMouseEnter={() => setHovered2(true)}
                  onMouseLeave={() => setHovered2(false)}
                  onClick={() => openModal()}
                >
                  <FlexDiv width="100%">
                    <Div>
                      <P color={hovered2 ? 'wh' : 'red'} fontWeight={700}>
                        승인 거절
                      </P>
                    </Div>
                  </FlexDiv>
                </Button>
              </DecisionActions>
            )}
            {isSecretary && detail.status === 'APPROVED' && (
              <DecisionActions width="100%">
                <Button
                  width="300px"
                  $HBackgroundColor="blue"
                  $padding="15px 20px"
                  $margin="0 20px 0 0"
                  $borderRadius={4}
                  border={`1px solid ${theme.color.blue}`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  disabled={isChangingStatus}
                  onClick={() => makeStatusCompeleted()}
                >
                  <FlexDiv width="100%">
                    <Div>
                      <P color={hovered ? 'wh' : 'blue'} fontWeight={700}>
                        지급 완료
                      </P>
                    </Div>
                  </FlexDiv>
                </Button>
              </DecisionActions>
            )}
          </Container>
        </SupportDetailPage>
      )}
    </>
  );
};

export default BankSupportDetail;
