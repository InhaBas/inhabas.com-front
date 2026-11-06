import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getBoardCountGroup } from '../../api/board';
import { boardQueries } from '../../queries/board';
import { Div, FlexDiv } from '../../styles/assets/Div';
import P from '../../styles/assets/P';
import { theme } from '../../styles/theme';
import { media } from '../../styles/theme';

const HIDDEN_BOARD_MENUS = ['질문게시판', '자유게시판', '건의사항', '회장단 게시판'];

const NavigateBox = styled(Div)`
  width: 263px;
  border: 2px solid ${theme.color.border};
  padding: 30px 20px 10px;

  ${media.tablet} {
    width: 100%;
  }

  ${media.mobile} {
    padding: 20px 16px 10px;
  }
`;

const MenuRow = styled(FlexDiv)`
  flex-wrap: nowrap;
  align-items: flex-start;
`;

const MenuName = styled(Div)`
  flex: 1 1 auto;
  min-width: 0;
  padding-right: 12px;
`;

const MenuCount = styled(Div)`
  flex: 0 0 auto;
`;

const MenuText = styled(P).attrs({ $whiteSpace: 'normal' })`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const BoardNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const url = location.pathname.split('/')[2];

  const movePageEvent = (url: string) => {
    navigate(`${url}`);
  };

  // 게시판 종류에 맞는 글 수 API를 부른다. 게시판을 바꾸면 BoardList가 스피너를 그리는 동안 이 컴포넌트가
  // 내려갔다 다시 올라오므로, 옛 화면처럼 게시판을 바꿀 때마다 한 번 조회한다
  const { data: menuData } = useQuery(boardQueries.count({ group: getBoardCountGroup(url) }));

  // api 바뀌면 url 요소 추가하기
  const menu = menuData?.map((item) => ({
    menuName: item.menuName,
    count: item.count,
    url: item.type === 'STORAGE' ? '/board/opensource' : `/board/${item.type.toLowerCase()}`,
  }));

  return (
    <>
      <NavigateBox>
        <Div
          $borderL={`4px solid ${theme.color.bgColor}`}
          $padding="5px 0 5px 20px"
          $margin="0 0 15px 0"
        >
          <P fontSize="xl" fontWeight={700}>
            게시판
          </P>
        </Div>

        <Div width="100%">
          {menu &&
            menu
              .filter((item) => !HIDDEN_BOARD_MENUS.includes(item.menuName))
              .map((item, idx: number) => {
                return (
                  <Div key={idx} width="100%">
                    <MenuRow
                      width="100%"
                      $padding="15px 0"
                      $justifycontent="space-between"
                      $borderT={idx !== 0 ? `1px dashed ${theme.color.border}` : 'none'}
                      onClick={() => movePageEvent(item.url)}
                      $pointer
                    >
                      <MenuName>
                        <MenuText color="grey" fontSize="sm" fontWeight={400}>
                          {item.menuName}
                        </MenuText>
                      </MenuName>
                      {item.menuName !== '건의사항' && (
                        <MenuCount>
                          <P color="grey" fontSize="sm" fontWeight={400}>
                            ({item.count})
                          </P>
                        </MenuCount>
                      )}
                    </MenuRow>
                  </Div>
                );
              })}
        </Div>
      </NavigateBox>
    </>
  );
};

export default BoardNavigate;
