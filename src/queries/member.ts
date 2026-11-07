import { queryOptions } from '@tanstack/react-query';

import {
  getChiefContact,
  getExecutiveList,
  getHallOfFameList,
  getNotGraduatedMemberList,
  NotGraduatedMemberListParams,
} from '../api/member';

export const memberQueries = {
  all: () => ['members'] as const,

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
  notGraduatedList: (params: NotGraduatedMemberListParams) =>
    queryOptions({
      queryKey: [...memberQueries.all(), 'notGraduated', params],
      queryFn: () => getNotGraduatedMemberList(params),
    }),
};
