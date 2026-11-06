import { queryOptions } from '@tanstack/react-query';

import { getMajorList, getSignUpCheck } from '../api/signUp';

export const signUpQueries = {
  all: () => ['signUp'] as const,

  // HeaderNav(라우트 전체)와 LoginProcess(로그인 직후)가 부른다. 둘이 함께 마운트되지는 않는다
  check: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'check'],
      queryFn: getSignUpCheck,
    }),
  majorList: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'majorInfo'],
      queryFn: getMajorList,
    }),
};
