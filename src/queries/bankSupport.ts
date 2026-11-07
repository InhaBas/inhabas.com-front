import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { keepPreviousPage } from './keepPreviousPage';
import { myInfoQueries } from './myInfo';
import { queryClient } from './queryClient';
import {
  BankSupportListParams,
  createBankSupport,
  deleteBankSupport,
  getBankSupport,
  getBankSupportList,
  updateBankSupport,
  updateBankSupportStatus,
} from '../api/bankSupport';
import { saveSupportInterface, supportStatusInterface } from '../types/TypeBank';

export const bankSupportQueries = {
  all: () => ['bankSupport'] as const,
  lists: () => [...bankSupportQueries.all(), 'list'] as const,
  details: () => [...bankSupportQueries.all(), 'detail'] as const,

  list: (params: BankSupportListParams) =>
    queryOptions({
      queryKey: [...bankSupportQueries.lists(), params],
      queryFn: () => getBankSupportList(params),
      // 페이지를 넘기는 동안 이전 목록을 보여 주던 옛 화면 동작을 보존한다.
      // 상태 필터가 바뀌면 pending이 되어 옛 화면처럼 스피너가 보인다
      placeholderData: keepPreviousPage(params),
    }),
  // 상세 화면과 수정 화면이 함께 쓴다
  detail: ({ id }: { id: string }) =>
    queryOptions({
      queryKey: [...bankSupportQueries.details(), { id }],
      queryFn: () => getBankSupport(id),
    }),
};

/*
  목록(예산 신청 목록, 내 정보의 내 예산 신청 목록)에 보이는 내용이 바뀌는 변경 뒤에 부른다. Promise는 반환하지 않는다.
  성공하면 화면이 목록으로 이동하거나 상세에 머물고, 목록은 마운트할 때 새로 조회하므로 지금은 대개 무효화할 활성 쿼리가 없다
*/
const invalidateBankSupportLists = () => {
  queryClient.invalidateQueries({ queryKey: bankSupportQueries.lists() });
  queryClient.invalidateQueries({ queryKey: myInfoQueries.supportLists() });
};

export const bankSupportMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (body: saveSupportInterface) => createBankSupport(body),
      onSuccess: invalidateBankSupportLists,
    }),
  update: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: string; body: saveSupportInterface }) =>
        updateBankSupport(id, body),
      // 상세는 무효화하지 않는다. 수정 화면이 구독 중인 상세를 다시 요청하게 되고(옛 화면에 없던 요청),
      // 성공하면 목록으로 이동하므로 상세는 다음에 열 때 새로 조회한다
      onSuccess: invalidateBankSupportLists,
    }),
  delete: () =>
    mutationOptions({
      mutationFn: ({ id }: { id: string }) => deleteBankSupport(id),
      // 상세는 무효화하지 않는다. 지운 신청을 다시 요청하면 404로 /notfound에 간다. 성공하면 목록으로 이동한다
      onSuccess: invalidateBankSupportLists,
    }),
  // 상세 화면의 승인·지급 완료와 거절 모달이 함께 쓴다. 상세에 머무르므로 상세를 다시 조회한다(옛 화면의 refetch 신호)
  updateStatus: () =>
    mutationOptions({
      mutationFn: ({ id, body }: { id: string; body: supportStatusInterface }) =>
        updateBankSupportStatus(id, body),
      onSuccess: (_data, { id }) => {
        queryClient.invalidateQueries({ queryKey: bankSupportQueries.detail({ id }).queryKey });
        invalidateBankSupportLists();
      },
    }),
};
