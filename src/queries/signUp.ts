import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { queryClient } from './queryClient';
import {
  completeSignUp,
  createSignUpAnswers,
  createSignUpProfile,
  getMajorList,
  getSignUpAnswers,
  getSignUpCheck,
  getSignUpProfile,
  getSignUpQuestionnaires,
  getSignUpSchedule,
  updateSignUpSchedule,
} from '../api/signUp';
import { answersInterface, signUpInterface } from '../types/ibas/TypeMember';
import { scheduleInterface } from '../types/ibas/TypeMyinfo';

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
  profile: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'profile'],
      queryFn: getSignUpProfile,
    }),
  questionnaires: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'questionnaires'],
      queryFn: getSignUpQuestionnaires,
    }),
  answers: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'answers'],
      queryFn: getSignUpAnswers,
    }),
  schedule: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'schedule'],
      queryFn: getSignUpSchedule,
    }),
  // 메인의 모집 일정 공지. 조회에 실패하면 alert 없이 공지만 띄우지 않던 동작을 보존한다
  scheduleNotice: () =>
    queryOptions({
      queryKey: [...signUpQueries.all(), 'schedule', 'notice'],
      queryFn: () => getSignUpSchedule().catch(() => null),
    }),
};

/*
  가입 화면의 변경은 무효화하지 않는다. 옛 화면도 저장 뒤 다시 조회하지 않았다
  - 개인정보 저장: 학생은 질문 화면으로 이동하고, 교수는 가입이 끝나 홈에서 reload(relogin)한다
  - 답변 임시저장: 입력칸에 이미 사용자가 쓴 값이 있다
  - 가입 완료: 홈에서 reload(relogin)하므로 캐시가 모두 사라진다
  - 일정 저장: 입력칸에 이미 사용자가 쓴 값이 있다. 다만 일정과 메인 모집 공지 캐시는 다시 받는다.
    gcTime 동안 캐시가 남아 다시 들어오거나 메인으로 갈 때 저장 전 일정이 잠깐 보이지 않게 한다
*/
export const signUpMutations = {
  createProfile: () =>
    mutationOptions({
      mutationFn: (body: signUpInterface) => createSignUpProfile(body),
    }),
  saveAnswers: () =>
    mutationOptions({
      mutationFn: (body: answersInterface[]) => createSignUpAnswers(body),
    }),
  complete: () =>
    mutationOptions({
      mutationFn: (body: answersInterface[]) => completeSignUp(body),
    }),
  updateSchedule: () =>
    mutationOptions({
      mutationFn: (body: scheduleInterface) => updateSignUpSchedule(body),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [...signUpQueries.all(), 'schedule'],
          refetchType: 'all',
        });
      },
    }),
};
