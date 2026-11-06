import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import NavigationBridge from './components/common/NavigationBridge';
import { queryClient } from './queries/queryClient';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationBridge />
        <App />
      </BrowserRouter>
      {/* 빌드 시점 치환으로 프로덕션 번들에서 빠진다 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </RecoilRoot>,
  // </React.StrictMode>
);
