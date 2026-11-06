import { queryOptions } from '@tanstack/react-query';

import { getChiefContact, getExecutiveList, getHallOfFameList } from '../api/member';

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
};
