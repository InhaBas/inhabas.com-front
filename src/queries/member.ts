import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { keepPreviousPage } from './keepPreviousPage';
import { queryClient } from './queryClient';
import {
  getChiefContact,
  getExecutiveList,
  getGraduatedMemberList,
  getHallOfFameList,
  getMemberApplication,
  getNotGraduatedMemberList,
  getUnapprovedMemberList,
  MemberListParams,
  updateApprovedMembersRole,
  updateApprovedMembersType,
  updateUnapprovedMembers,
} from '../api/member';
import {
  updateMembersRoleInterface,
  updateMembersTypeInterface,
  updateUnapprovedMembersInterface,
} from '../types/ibas/TypeMember';

export type MemberListName = 'notGraduated' | 'graduated' | 'unapproved';

export const memberQueries = {
  all: () => ['members'] as const,
  lists: (list: MemberListName) => [...memberQueries.all(), list] as const,

  executiveList: () =>
    queryOptions({
      queryKey: [...memberQueries.all(), 'executive'],
      queryFn: getExecutiveList,
    }),
  hallOfFameList: () =>
    queryOptions({
      queryKey: [...memberQueries.all(), 'hof'],
      queryFn: getHallOfFameList,
    }),
  chief: () =>
    queryOptions({
      queryKey: [...memberQueries.all(), 'chief'],
      queryFn: getChiefContact,
    }),
  // 아래 세 목록: 페이지를 넘기는 동안 이전 목록을 보여 주던 옛 표 동작을 보존한다. 검색하면 옛 표처럼 스피너가 보인다
  notGraduatedList: (params: MemberListParams) =>
    queryOptions({
      queryKey: [...memberQueries.lists('notGraduated'), params],
      queryFn: () => getNotGraduatedMemberList(params),
      placeholderData: keepPreviousPage(params),
    }),
  graduatedList: (params: MemberListParams) =>
    queryOptions({
      queryKey: [...memberQueries.lists('graduated'), params],
      queryFn: () => getGraduatedMemberList(params),
      placeholderData: keepPreviousPage(params),
    }),
  unapprovedList: (params: MemberListParams) =>
    queryOptions({
      queryKey: [...memberQueries.lists('unapproved'), params],
      queryFn: () => getUnapprovedMemberList(params),
      placeholderData: keepPreviousPage(params),
    }),
  application: (params: { id: string }) =>
    queryOptions({
      queryKey: [...memberQueries.all(), 'application', params],
      queryFn: () => getMemberApplication(params.id),
    }),
};

const memberListChangeListeners = new Set<(lists: readonly MemberListName[]) => void>();

/*
  회원을 바꾸는 뮤테이션이 성공한 뒤에 부른다. 옛 표는 성공하면 관련 표 모두가 검색 없는 1페이지를 다시 조회했다.
  표는 useOnMemberListChanged로 1페이지·검색 없음으로 돌아가므로 그 목록만 무효화한다. 보고 있던 N페이지나 검색 결과까지
  무효화하면 그것을 다시 받은 뒤 1페이지를 또 받아 요청이 는다. Promise는 반환하지 않는다
*/
const handleMemberListsChanged = (lists: readonly MemberListName[]) => {
  lists.forEach((list) => {
    queryClient.invalidateQueries({
      queryKey: memberQueries.lists(list),
      predicate: (query) => {
        const { page, search } = query.queryKey.at(-1) as MemberListParams;
        return page === 1 && !search;
      },
    });
  });
  memberListChangeListeners.forEach((listener) => listener(lists));
};

/*
  list가 바뀌는 뮤테이션이 성공할 때마다 onChanged를 부른다. 표가 여기서 1페이지로 돌아간다.
  한 페이지(MyManageUser)의 다른 표에서 일어난 변경도 받아야 해서 mutate 콜백으로는 잇지 못한다
*/
export const useOnMemberListChanged = (list: MemberListName, onChanged: () => void) => {
  // 콜백이 렌더마다 바뀌어도 다시 구독하지 않도록 최신 콜백을 ref에 둔다
  const onChangedRef = useRef(onChanged);
  useEffect(() => {
    onChangedRef.current = onChanged;
  });

  useEffect(() => {
    const listener = (lists: readonly MemberListName[]) => {
      if (lists.includes(list)) onChangedRef.current();
    };
    memberListChangeListeners.add(listener);
    return () => {
      memberListChangeListeners.delete(listener);
    };
  }, [list]);
};

export const memberMutations = {
  // 합격·불합격. 옛 표는 어느 쪽이든 동아리원 목록을 다시 조회했다
  updateUnapproved: () =>
    mutationOptions({
      mutationFn: (body: updateUnapprovedMembersInterface) => updateUnapprovedMembers(body),
      onSuccess: () => handleMemberListsChanged(['unapproved', 'notGraduated']),
    }),
  // list: 변경을 일으킨 표
  updateRole: (list: 'notGraduated' | 'graduated') =>
    mutationOptions({
      mutationFn: (body: updateMembersRoleInterface) => updateApprovedMembersRole(body),
      onSuccess: () => handleMemberListsChanged([list]),
    }),
  // 동아리원 표에서는 졸업생으로 바꿀 때만, 졸업생 표에서는 항상 두 목록이 함께 바뀐다
  updateType: (list: 'notGraduated' | 'graduated') =>
    mutationOptions({
      mutationFn: (body: updateMembersTypeInterface) => updateApprovedMembersType(body),
      onSuccess: (_data, { type }) =>
        handleMemberListsChanged(
          list === 'graduated' || type === 'GRADUATED'
            ? ['notGraduated', 'graduated']
            : ['notGraduated'],
        ),
    }),
};
