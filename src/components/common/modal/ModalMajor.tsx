import { useMutation, useQuery } from '@tanstack/react-query';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { isImeComposing } from '../../../functions/ime';
import { myInfoMutations } from '../../../queries/myInfo';
import { signUpQueries } from '../../../queries/signUp';
import { majorSelected, modalInfo, modalOpen } from '../../../recoil/frontState';
import Button from '../../../styles/assets/Button';
import { Div, FlexDiv } from '../../../styles/assets/Div';
import { H2 } from '../../../styles/assets/H';
import Img from '../../../styles/assets/Img';
import { TextInput } from '../../../styles/assets/Input';
import P from '../../../styles/assets/P';
import { media, theme } from '../../../styles/theme';

const MajorTableRow = styled.div<{ $selected?: boolean; $pointer?: boolean; $active?: boolean }>`
  display: grid;
  grid-template-columns: 150px minmax(270px, 1fr) 160px;
  align-items: center;
  width: 100%;
  min-width: 580px;
  min-height: 45px;
  background-color: ${({ $selected }) => ($selected ? theme.color.tableHo : theme.color.wh)};
  border-top: 1px solid ${theme.color.grey1};
  cursor: ${({ $pointer }) => ($pointer ? 'pointer' : 'default')};
  /* 방향키로 가리키는 항목. 포커스는 검색 입력에 있으므로 outline으로 따로 보여준다 */
  outline: ${({ $active }) => ($active ? `2px solid ${theme.color.bgColor}` : 'none')};
  outline-offset: -2px;

  &:hover {
    background-color: ${theme.color.tableHo};
  }
`;

const MajorTableHeader = styled(MajorTableRow)`
  border-top: 0;
  border-bottom: 1px solid ${theme.color.tableBorder};
`;

const MajorTableCell = styled.div`
  min-width: 0;
  padding: 10px;
`;

const MajorTableText = styled(P)`
  white-space: nowrap;
`;

const MajorTableScroll = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  ${media.mobile} {
    margin: 0 -4px;
    width: calc(100% + 8px);
  }
`;

const MajorTable = styled(Div)`
  min-width: 580px;
`;

const MajorList = styled(Div)`
  height: 170px !important;
`;

const Dialog = styled(FlexDiv)`
  &:focus {
    outline: none;
  }
`;

const CloseButton = styled.button`
  display: flex;
  width: 40px;
  height: 40px;
  margin: -8px;
  padding: 8px;
  border: 0;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.color.wh};
    outline-offset: -2px;
  }
`;

const SearchInput = styled(TextInput)`
  /* TextInput의 &:focus { outline: none }보다 특이도를 높인다 */
  &&:focus-visible {
    outline: 2px solid ${theme.color.bgColor};
    outline-offset: 2px;
  }
`;

const getTabbables = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]',
    ),
  ).filter((el) => el.tabIndex >= 0 && el.getClientRects().length > 0);

const ModalMajor = () => {
  const setOpen = useSetRecoilState(modalOpen);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleId = useId();
  const listboxId = useId();
  // 모달을 연 요소. 검색 입력으로 포커스를 옮기기 전인 첫 렌더에서 잡아 둔다
  const [opener] = useState(() => document.activeElement);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    searchRef.current?.focus();

    // 클릭 등으로 모달 밖에 포커스가 가면 모달 안으로 되돌린다
    const keepFocusInside = (e: FocusEvent) => {
      const dialog = dialogRef.current;
      if (dialog && e.target instanceof Node && !dialog.contains(e.target)) {
        (getTabbables(dialog)[0] ?? dialog).focus();
      }
    };
    document.addEventListener('focusin', keepFocusInside);

    return () => {
      document.removeEventListener('focusin', keepFocusInside);
      // Esc, 닫기·확인 버튼, 배경 클릭 등 어떤 경로로 닫혀도 연 요소로 포커스를 돌려준다
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [opener]);

  const headerInfo = ['학교명', '학과명', '단과대학'];

  const modalType = useRecoilValue(modalInfo);
  // 전공 정보. 회원가입(type 'major')과 내정보(type 'changeMajor')가 함께 쓴다
  const { data: majorList } = useQuery(signUpQueries.majorList());
  const major = majorList ?? [];
  const changeMutation = useMutation(myInfoMutations.updateDetail());
  const [selectedTable, setSelectedTable] = useRecoilState(majorSelected);

  /* 
    selectedTable을 이용해서 사용자가 선택한 전공을 모달 밖에서도 볼 수 있게 만듦 
    selectedTable을 body에 담아 POST api 보냄
    */
  const chooseMajor = (item: { college: string; major: string }) => {
    setSelectedTable((prev) => ({ ...prev, ...item }));
  };

  // [myInfo] 학과 변경 fetch
  const changeMajor = () => {
    const inputData = {
      major: selectedTable.major,
    };
    if (inputData.major !== '') {
      changeMutation.mutate(inputData, {
        onSuccess: () => {
          alert('전공 정상적으로 수정되었습니다.');
          setOpen(false);
        },
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  // 방향키로 가리키는 결과의 인덱스. -1이면 없음
  const [activeIndex, setActiveIndex] = useState(-1);

  // 검색어와 일치하는 결과 필터링
  const filteredResults = major.filter((item) =>
    item.major.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const activeOption = filteredResults[activeIndex];
  const optionId = (idx: number) => `${listboxId}-option-${idx}`;

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Esc로 닫고, Tab 포커스가 모달 밖으로 나가지 않게 처음과 끝을 잇는다
  const handleDialogKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isImeComposing(e)) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }

    const dialog = dialogRef.current;
    if (e.key !== 'Tab' || !dialog) return;

    const tabbables = getTabbables(dialog);
    const first = tabbables[0];
    const last = tabbables[tabbables.length - 1];
    if (!first || !last) {
      e.preventDefault();
      return;
    }
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // 포커스는 검색 입력에 둔 채 방향키로 결과를 가리키고 Enter로 고른다
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 조합 중 Enter·방향키는 IME가 글자를 확정하는 데 쓴다. 선택으로 처리하지 않는다
    if (isImeComposing(e)) return;

    const lastIndex = filteredResults.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, lastIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev === -1 ? lastIndex : Math.max(prev - 1, 0)));
    } else if (e.key === 'Enter' && activeOption) {
      e.preventDefault();
      chooseMajor(activeOption);
    }
  };

  return (
    <Dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleDialogKeyDown}
      width="44%"
      height="450px"
      $backgroundColor="wh"
      direction="column"
      $justifycontent="space-between"
      radius={2}
    >
      <FlexDiv
        $justifycontent="space-between"
        width="100%"
        $backgroundColor="bgColor"
        $padding="15px 20px"
      >
        <Div>
          <H2 id={titleId} fontSize="lg" color="wh">
            전공검색
          </H2>
        </Div>
        <CloseButton type="button" aria-label="닫기" onClick={() => closeModal()}>
          <Img src={'../images/x_white.svg'} alt="" />
        </CloseButton>
      </FlexDiv>

      <Div $padding="25px" width="100%" height="88%">
        <Div width="100%">
          <SearchInput
            ref={searchRef}
            role="combobox"
            aria-label="전공 검색"
            aria-autocomplete="list"
            aria-expanded={major.length > 0}
            aria-controls={major.length > 0 ? listboxId : undefined}
            aria-activedescendant={activeOption ? optionId(activeIndex) : undefined}
            autoComplete="off"
            placeholder="전공을 검색하세요"
            width="100%"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleSearchKeyDown}
            onBlur={() => setActiveIndex(-1)}
          />
        </Div>
        {major.length === 0 ? (
          <FlexDiv width="100%" height="100%">
            <FlexDiv width="10%">
              <Img src="/images/loading.svg" alt="전공 목록을 불러오는 중" />
            </FlexDiv>
          </FlexDiv>
        ) : (
          <>
            <MajorTableScroll>
              <MajorTable width="100%">
                <MajorTableHeader aria-hidden="true">
                  {headerInfo.map((item: string) => (
                    <MajorTableCell key={item}>
                      <MajorTableText $center fontWeight={700}>
                        {item}
                      </MajorTableText>
                    </MajorTableCell>
                  ))}
                </MajorTableHeader>
                <MajorList
                  id={listboxId}
                  role="listbox"
                  aria-label="전공 목록"
                  tabIndex={-1}
                  width="100%"
                  height="60%"
                  overflow="auto"
                >
                  {filteredResults.map(
                    (element: { college: string; major: string }, idx: number) => (
                      <MajorTableRow
                        key={`contentItem${idx}`}
                        ref={(el) => {
                          optionRefs.current[idx] = el;
                        }}
                        id={optionId(idx)}
                        role="option"
                        aria-selected={selectedTable.major === element.major}
                        aria-label={`${element.major}, ${element.college}`}
                        $selected={selectedTable.major === element.major}
                        $active={idx === activeIndex}
                        $pointer
                        onClick={() => chooseMajor(element)}
                      >
                        <MajorTableCell>
                          <MajorTableText $center>인하대학교</MajorTableText>
                        </MajorTableCell>
                        <MajorTableCell>
                          <MajorTableText $center>{element.major}</MajorTableText>
                        </MajorTableCell>
                        <MajorTableCell>
                          <MajorTableText $center>{element.college}</MajorTableText>
                        </MajorTableCell>
                      </MajorTableRow>
                    ),
                  )}
                </MajorList>
              </MajorTable>
            </MajorTableScroll>
          </>
        )}

        {modalType.type === 'major' ? (
          <FlexDiv width="100%">
            <Button
              $backgroundColor="bgColor"
              $HBackgroundColor="bgColorHo"
              $borderRadius={60}
              width="150px"
              height="40px"
              $margin="15px 0 0 0"
              onClick={() => closeModal()}
            >
              <P color="wh" fontWeight={400}>
                확인
              </P>
            </Button>
          </FlexDiv>
        ) : (
          <FlexDiv width="100%">
            <Button
              $backgroundColor="bgColor"
              $HBackgroundColor="bgColorHo"
              $borderRadius={60}
              width="150px"
              height="40px"
              $margin="15px 0 0 0"
              disabled={changeMutation.isPending}
              onClick={() => changeMajor()}
            >
              <P color="wh" fontWeight={400}>
                수정
              </P>
            </Button>
          </FlexDiv>
        )}
      </Div>
    </Dialog>
  );
};

export default ModalMajor;
