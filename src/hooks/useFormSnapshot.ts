import { useState } from 'react';

/*
  폼 초기값으로 쓸 조회 결과를 처음 들어온 값으로 고정한다.
  같은 쿼리가 다시 응답해도(무효화·재요청) 이미 편집을 시작한 폼과 [snapshot]에 걸린 초기화 effect를 다시 건드리지 않는다.
  value가 undefined인 동안은 그대로 undefined를 돌려주므로, "불러오는 중" 분기는 value를 넘기던 그대로 쓴다
*/
export const useFormSnapshot = <T>(value: T | undefined): T | undefined => {
  const [snapshot, setSnapshot] = useState(value);
  // 렌더 중 setState로 첫 값을 잡는다. 같은 렌더에서 바로 value를 돌려주므로 한 프레임 늦지 않는다
  if (snapshot === undefined && value !== undefined) {
    setSnapshot(value);
    return value;
  }
  return snapshot;
};
