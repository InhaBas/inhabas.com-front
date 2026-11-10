import { setupServer } from 'msw/node';

// 테스트마다 server.use()로 핸들러를 얹는다. 기본 핸들러는 없다
export const server = setupServer();
