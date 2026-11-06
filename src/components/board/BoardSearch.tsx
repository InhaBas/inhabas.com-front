import { useState } from 'react';
import styled from 'styled-components';

import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { SearchInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';

const SearchBox = styled(Div)`
  width: 263px;
  height: 147px;
  border: 2px solid ${theme.color.border};
  padding: 30px 20px 10px;

  ${media.tablet} {
    width: 100%;
    height: auto;
  }

  ${media.mobile} {
    padding: 20px 16px;
  }
`;

const SearchRow = styled(FlexDiv)`
  width: 100%;
  flex-wrap: nowrap;
`;

const SearchField = styled(Div)`
  flex: 1 1 auto;
  min-width: 0;
`;

const ResponsiveSearchInput = styled(SearchInput)`
  width: 100%;
  min-width: 0;
`;

const SearchButton = styled(Button)`
  flex: 0 0 53px;
`;

interface BoardSearchProps {
  // 검색어를 제출한다. 목록 조회는 부모가 검색어를 queryKey에 넣어 한다
  onSearch: (term: string) => void;
}

const BoardSearch = ({ onSearch }: BoardSearchProps) => {
  const [searchValue, setSearchValue] = useState(''); // 검색어

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const searchEvent = () => {
    if (searchValue.trim() !== '') {
      onSearch(searchValue);
    }
  };

  // 엔터키 press 핸들러
  const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchEvent();
    }
  };

  return (
    <>
      <SearchBox>
        <Div
          $borderL={`4px solid ${theme.color.bgColor}`}
          $padding="5px 0 5px 20px"
          $margin="0 0 15px 0"
        >
          <P fontSize="xl" fontWeight={700}>
            게시글 검색
          </P>
        </Div>

        <SearchRow width="100%">
          <SearchField>
            <ResponsiveSearchInput
              placeholder="검색어를 입력하세요."
              onKeyDown={enterKeyDown}
              onChange={handleSearchChange}
            />
          </SearchField>
          <SearchButton
            $backgroundColor="bgColor"
            width="53px"
            height="40px"
            $padding="10px 20px"
            $borderRadius={3}
            $HBackgroundColor="bgColorHo"
            onClick={() => searchEvent()}
          >
            <Div width="13px">
              <Img src="/images/search_white.svg"></Img>
            </Div>
          </SearchButton>
        </SearchRow>
      </SearchBox>
    </>
  );
};

export default BoardSearch;
