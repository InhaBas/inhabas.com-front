import { ReactNode, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import { focusRing } from './formStyles';
import { InfoIcon } from './icons';

/*
  결과 안내 블록: 64px 원 아이콘 + 제목 + 본문 + 보조 안내(note) + [홈으로].
  화면이 폼에서 이 안내로 바뀌면 포커스를 잃지 않도록 제목으로 옮긴다.
  배치(패널, 로고)는 쓰는 화면이 정한다. 모집 기간 아님 안내(RecruitClosedNotice)와 가입 완료 화면이 쓴다.
*/

interface ResultNoticeProps {
  icon: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  /** 본문과 버튼 사이의 보조 안내 한 덩어리(연보라 면 + 안내 아이콘) */
  note?: ReactNode;
}

const ResultNotice = ({ icon, title, children, note }: ResultNoticeProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Wrap>
      <Badge aria-hidden="true">{icon}</Badge>
      <Title ref={headingRef} tabIndex={-1}>
        {title}
      </Title>
      {children && <Lead>{children}</Lead>}
      {note && (
        <Note>
          <InfoIcon />
          <div>{note}</div>
        </Note>
      )}
      <HomeLink to="/">홈으로</HomeLink>
    </Wrap>
  );
};

export default ResultNotice;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  white-space: normal;
  word-break: keep-all;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.border};
  color: ${({ theme }) => theme.color.bgColor};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.4;
  color: ${({ theme }) => theme.color.bk};
  text-align: center;

  &:focus {
    outline: none;
  }
`;

const Lead = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.grey};
  text-align: center;

  b,
  strong {
    color: ${({ theme }) => theme.color.bk};
    font-weight: 700;
  }
`;

const Note = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.border};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.bk};
  text-align: left;

  svg {
    flex: none;
    margin-top: 2px;
    color: ${({ theme }) => theme.color.bgColor};
  }
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  margin-top: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bgColor};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.color.wh};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.color.bgColorHo};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;
