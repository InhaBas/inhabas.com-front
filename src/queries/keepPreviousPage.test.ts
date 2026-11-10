import { keepPreviousPage } from './keepPreviousPage';

const prevQuery = (params: object) => ({ queryKey: ['boards', 'list', params] });

describe('keepPreviousPage', () => {
  const params = { board: 'free', page: 2, size: 10, search: '' };

  it('page만 바뀌면 이전 데이터를 유지한다', () => {
    const fn = keepPreviousPage(params);
    expect(fn('prev', prevQuery({ ...params, page: 1 }))).toBe('prev');
  });

  it('다른 파라미터가 바뀌면 undefined(pending)다', () => {
    const fn = keepPreviousPage(params);
    expect(fn('prev', prevQuery({ ...params, board: 'alpha' }))).toBeUndefined();
    expect(fn('prev', prevQuery({ ...params, search: 'x' }))).toBeUndefined();
  });

  it('keepWhenChanged로 지정한 필터가 바뀌어도 유지한다', () => {
    const fn = keepPreviousPage(params, ['search']);
    expect(fn('prev', prevQuery({ ...params, search: 'x' }))).toBe('prev');
  });

  it('이전 쿼리가 없으면 undefined다', () => {
    expect(keepPreviousPage(params)('prev', undefined)).toBeUndefined();
  });
});
