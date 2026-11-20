import { KeyboardEvent } from 'react';

// 한글 IME 조합 중인 키 입력. Safari는 조합을 끝내는 keydown에도 keyCode 229를 보낸다
export const isImeComposing = (event: KeyboardEvent) =>
  event.nativeEvent.isComposing || event.keyCode === 229;
