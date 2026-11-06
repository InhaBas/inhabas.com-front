/*
  목록 queryOptions의 placeholderData에 쓴다. 목록 queryKey의 마지막 요소가 { page, size, ...필터 }라는 규약에 기댄다.
  page만 바뀔 때(keepWhenChanged로 지정한 필터가 함께 바뀌어도) 이전 목록을 placeholder로 보여 주고,
  그 밖의 파라미터(게시판·정렬·필터 등)가 바뀌면 placeholder 없이 pending이 되어 <Loading />이 보인다.
  공식 keepPreviousData를 쓰면 게시판을 바꿀 때 이전 게시판 목록이 잠깐 보이므로 쓰지 않는다.
*/
export const keepPreviousPage =
  <P extends { page: number }>(params: P, keepWhenChanged: readonly (keyof P)[] = []) =>
  <T>(prev: T | undefined, prevQuery?: { queryKey: readonly unknown[] }): T | undefined => {
    if (!prevQuery) return undefined;
    const prevParams = prevQuery.queryKey[prevQuery.queryKey.length - 1] as P;
    return isSameExcept(prevParams, params, ['page', ...keepWhenChanged]) ? prev : undefined;
  };

const isSameExcept = <P extends object>(a: P, b: P, ignored: readonly (keyof P)[]) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)] as (keyof P)[]);
  return [...keys].every((key) => ignored.includes(key) || a[key] === b[key]);
};
