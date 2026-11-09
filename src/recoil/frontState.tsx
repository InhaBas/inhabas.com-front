import { atom } from 'recoil';

import { getFailRefreshing, setFailRefreshing, subscribeFailRefreshing } from '../api/token';
import { modalInterface } from '../types/TypeCommon';

// common
export const refetch = atom({
  key: 'refetch',
  default: false,
});

export const checkedList = atom({
  key: 'checkedList',
  default: [] as number[],
});

export const _checkedList = atom({
  key: '_checkedList',
  default: [] as number[],
});

export const __checkedList = atom({
  key: '__checkedList',
  default: [] as number[],
});

export const checkOne = atom({
  key: 'checkOne',
  default: 0,
});

export const menuId = atom({
  key: 'menuId',
  default: 0,
});

// login
export const relogin = atom({
  key: 'relogin',
  default: false,
});

export const majorSelected = atom({
  key: 'majorSelected',
  default: { college: '', major: '' },
});

// modal
export const modalInfo = atom<modalInterface>({
  key: 'modalInfoState',
  default: {
    type: '',
    content: '',
  },
});

export const modalOpen = atom({
  key: 'modalOpenState',
  default: false,
});

// dragNdrop
export const selectedFile = atom<any[]>({
  key: 'selectedFile',
  default: [],
});

// bank
export const bankSupportRejectReasonInfo = atom({
  key: 'bankSupportRejectReasonInfo',
  default: '',
});

// useFetch
// src/api/token.ts 저장소와 양방향 동기화한다. refresh 흐름은 React 밖에서 저장소만 쓴다
export const failRefreshing = atom<boolean>({
  key: 'failRefreshing',
  default: false,
  effects: [
    ({ setSelf, onSet }) => {
      setSelf(getFailRefreshing());
      onSet((newValue) => setFailRefreshing(newValue));
      return subscribeFailRefreshing(setSelf);
    },
  ],
});

// carousel
export const carouselOpen = atom({
  key: 'carouselOpenState',
  default: false,
});

export const carouselInitialState = atom({
  key: 'carouselInitialState',
  default: 0,
});

// contest
export const contestOrder = atom({
  key: 'contestOrder',
  default: '&orderBy=ALL',
});
