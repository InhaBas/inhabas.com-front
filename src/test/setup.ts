import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import { server } from './server';

// 처리되지 않은 요청은 테스트를 실패시켜 빠뜨린 핸들러를 바로 알린다
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
