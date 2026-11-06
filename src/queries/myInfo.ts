import { mutationOptions, queryOptions, useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import { signUpQueries } from './signUp';
import {
  getMyBoardList,
  getMyCommentList,
  getMyInfo,
  MyInfoListParams,
  requestMyInfoNameChange,
  updateMyInfoDetail,
  updateMyInfoIntro,
  updateMyInfoPicture,
} from '../api/myInfo';
import { setAccessToken } from '../api/token';
import { loggedOut } from '../recoil/backState';
import { updateMyInfoDetailInterface, updateMyInfoIntroInterface } from '../types/ibas/TypeMyinfo';

export const myInfoQueries = {
  all: () => ['myInfo'] as const,

  // 조회의 주인은 HeaderNav다. /signUp/check 결과가 true일 때만 켠다(enabled)
  detail: () =>
    queryOptions({
      queryKey: [...myInfoQueries.all(), 'detail'],
      queryFn: getMyInfo,
    }),
  // 내 정보 화면의 내가 쓴 글·댓글 목록. 페이지를 넘기는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다
  boardList: (params: MyInfoListParams) =>
    queryOptions({
      queryKey: [...myInfoQueries.all(), 'boards', params],
      queryFn: () => getMyBoardList(params),
      placeholderData: keepPreviousPage(params),
    }),
  commentList: (params: MyInfoListParams) =>
    queryOptions({
      queryKey: [...myInfoQueries.all(), 'comments', params],
      queryFn: () => getMyCommentList(params),
      placeholderData: keepPreviousPage(params),
    }),
};

/*
  HeaderNav가 조회한 /myInfo를 구독만 한다. 옛 화면에서 이 값을 읽던 곳(profileInfo·userRole atom)은 요청하지 않았다.
  refetchOnMount: false로는 부족하다. 첫 로딩 중이거나 비로그인이라 데이터가 없으면 마운트할 때 요청하므로
  'default' 토큰으로 /myInfo가 한 번 더 나간다. 그래서 enabled: false로 두고, 재조회(무효화·refresh 뒤)는
  HeaderNav의 활성 쿼리가 맡는다. 이 값을 읽는 화면은 모두 HeaderNav가 함께 마운트된 HeaderNavLayout 아래에 있다
*/
export const useMyInfo = () => useQuery({ ...myInfoQueries.detail(), enabled: false }).data;

/*
  옛 userRole atom의 값을 그대로 돌려준다
  - 아직 불러오지 않음(첫 로딩·비로그인·가입 중): '' — 라우트 가드는 role !== ''일 때까지 기다린다
  - 이 화면에서 로그아웃한 뒤: 'logout'
  - 그 밖: 서버 role
*/
export const useMyRole = (): string => {
  const myInfo = useMyInfo();
  const isLoggedOut = useRecoilValue(loggedOut);
  if (isLoggedOut) return 'logout';
  return myInfo?.role ?? '';
};

/*
  로그아웃할 때 부른다
  - 토큰 저장소를 바로 'default'로 바꾼다. 이어서 HeaderNav가 다시 보내는 /signUp/check가 이 값을 실어야 해서
    atom(onSet은 Recoil 배치가 끝난 뒤에 돈다) 대신 저장소에 쓴다. tokenAccess atom은 저장소 구독으로 따라온다
  - /signUp/check와 /myInfo 캐시를 지운다. HeaderNav가 /signUp/check를 다시 요청하는 것은 옛 화면이 토큰이 바뀔 때마다
    다시 요청하던 동작이고, 그 A005 → refresh 실패가 failRefreshing을 켠다. /signUp/check 결과가 비었으므로 /myInfo는 요청하지 않는다
*/
export const clearMyInfoOnLogout = () => {
  setAccessToken('default');
  queryClient.removeQueries({ queryKey: signUpQueries.check().queryKey });
  queryClient.removeQueries({ queryKey: myInfoQueries.all() });
};

// 화면에 보이는 내 정보가 바뀌는 변경만 무효화한다. Promise는 반환하지 않는다
const invalidateMyInfo = () => {
  queryClient.invalidateQueries({ queryKey: myInfoQueries.detail().queryKey });
};

export const myInfoMutations = {
  // 학과·전화번호·소속
  updateDetail: () =>
    mutationOptions({
      mutationFn: (body: updateMyInfoDetailInterface) => updateMyInfoDetail(body),
      onSuccess: invalidateMyInfo,
    }),
  updateIntro: () =>
    mutationOptions({
      mutationFn: (body: updateMyInfoIntroInterface) => updateMyInfoIntro(body),
      onSuccess: invalidateMyInfo,
    }),
  // 옛 화면은 사진 수정 뒤 내 정보를 다시 조회하지 않았다. 그 동작을 보존해 무효화하지 않는다
  updatePicture: () =>
    mutationOptions({
      mutationFn: (body: FormData) => updateMyInfoPicture(body),
    }),
  // 회장이 승인해야 이름이 바뀌므로 내 정보는 그대로다. 옛 화면도 다시 조회하지 않았다
  requestNameChange: () =>
    mutationOptions({
      mutationFn: (name: string | undefined) => requestMyInfoNameChange(name),
    }),
};
