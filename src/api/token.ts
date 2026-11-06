// access 토큰과 failRefreshing을 React 밖에서 읽고 쓰는 모듈 저장소.
// fetch 래퍼와 refresh 흐름은 이 저장소만 쓴다. Recoil atom은 atom effects로 이 저장소와 양방향 동기화한다.

type Listener<T> = (value: T) => void;

const createStore = <T>(initialValue: T) => {
  let value = initialValue;
  const listeners = new Set<Listener<T>>();

  return {
    get: () => value,
    set: (next: T) => {
      // 같은 값이면 알리지 않는다. atom ↔ 저장소 동기화가 무한히 핑퐁하지 않게 한다
      if (Object.is(value, next)) return;
      value = next;
      listeners.forEach((listener) => listener(next));
    },
    subscribe: (listener: Listener<T>) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};

// 'default'는 비로그인, 'signing'은 가입 중을 뜻하는 센티널 값이다
const accessTokenStore = createStore<string>('default');

export const getAccessToken = accessTokenStore.get;
export const setAccessToken = accessTokenStore.set;
export const subscribeAccessToken = accessTokenStore.subscribe;

const failRefreshingStore = createStore<boolean>(false);

export const getFailRefreshing = failRefreshingStore.get;
export const setFailRefreshing = failRefreshingStore.set;
export const subscribeFailRefreshing = failRefreshingStore.subscribe;
