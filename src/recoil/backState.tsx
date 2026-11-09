import { atom } from 'recoil';

import { getAccessToken, setAccessToken, subscribeAccessToken } from '../api/token';
import {
  applicationAnswersInterface,
  applicationInterface,
  scheduleInterface,
} from '../types/ibas/TypeMyinfo';
import { menuInterface, policyInterface } from '../types/TypeCommon';

// headerTitle: 페이지가 직접 정한 제목만 담는다(staff 경로). 비어 있으면 HeaderTitle이 메뉴 제목을 쓴다
export const headerTitleInfo = atom<menuInterface>({
  key: 'headerTitleInfo',
  default: {
    name: '',
    description: '',
  },
});

// src/api/token.ts 저장소와 양방향 동기화한다. fetch 래퍼와 refresh 흐름은 React 밖에서 저장소만 읽고 쓴다
export const tokenAccess = atom<string>({
  key: 'tokenAccess',
  default: 'default',
  effects: [
    ({ setSelf, onSet }) => {
      setSelf(getAccessToken());
      onSet((newValue) => setAccessToken(newValue));
      return subscribeAccessToken(setSelf);
    },
  ],
});

export const userEmail = atom({
  key: 'userEmail',
  default: '',
});

export const userImage = atom({
  key: 'userImage',
  default: '',
});

// 이 화면에서 로그아웃 버튼을 눌렀는지. useMyRole()이 'logout'을 돌려주는 데 쓴다
export const loggedOut = atom<boolean>({
  key: 'loggedOut',
  default: false,
});

// dropdown
export const fileIdList = atom<string[] | []>({
  key: 'fileIdList',
  default: [],
});

// policy
export const totalPolicyInfo = atom<policyInterface[] | null>({
  key: 'totalPolicyInfo',
  default: [],
});

// myInfo
export const applicationInfo = atom<applicationInterface | null>({
  key: 'applicationInfo',
  default: null,
});

export const applicationAnswerInfo = atom<applicationAnswersInterface[] | null>({
  key: 'applicationAnswerInfo',
  default: null,
});

export const scheduleInfo = atom<scheduleInterface | null>({
  key: 'scheduleInfo',
  default: null,
});

//lectureRoom
export const lectureRoomInfo = atom({
  key: 'lectureRoomInfo',
  default: [],
});

export const lectureRoomTutorInfo = atom({
  key: 'lectureRoomTutorInfo',
  default: [],
});
