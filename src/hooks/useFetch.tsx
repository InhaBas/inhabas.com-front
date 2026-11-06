import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { refreshAccessTokenOnce } from '../queries/apiErrorEffects';
import { tokenAccess } from '../recoil/backState';

const alertInfos = ({ code, msg }: { code?: number; msg: string }) => {
  alert(`웹 팀에 문의해주세요. \n${code} : ${msg}`);
};

const useFetch = (): [
  any,
  (url: string, method: string, token?: string, sendData?: any, media?: boolean) => Promise<void>,
] => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const access = useRecoilValue(tokenAccess);

  const fetchData = async (
    url: string,
    method: string,
    token?: string,
    sendData?: any,
    media?: boolean,
  ) => {
    try {
      let res: Response | undefined;
      let result: any;

      let headers = {
        Authorization: `Bearer ${access}`,

        // "Content-Type": media ? "multipart/form-data" : "application/json",
        // "Content-Type": "application/json",

        ...(media ? {} : { 'Content-Type': 'application/json' }),
      };

      const fetchWithoutToken = async () => {
        if (method.toUpperCase() === 'GET') {
          res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
          });

          if (res.ok) {
            if (
              res.status === 204 ||
              res.headers.get('content-length') === '0' ||
              res.body === null
            ) {
              setData(new Date().toLocaleString());
            } else {
              result = await res.json();
              // console.log({ ...result });
              setData({ ...result });
            }
          } else {
            try {
              // 에러 응답에서 오류 메시지 추출
              const errorResponse = await res.json();
              console.error('Network response was not ok. Error:', errorResponse.message);
              alertInfos({ code: errorResponse.code, msg: errorResponse.message });
              // 404처리
              if (errorResponse.status === 404) {
                navigate('/notfound');
              }
            } catch (error) {
              console.error('Failed to parse error response:', error);
            }
          }
        }
      };

      const fetchWithToken = async () => {
        if (method.toUpperCase() !== 'GET') {
          let bodyData = media ? sendData : JSON.stringify(sendData);
          res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
            method: method,
            body: bodyData,
            headers: headers,
          });
        } else {
          res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
            method: method,
            headers: headers,
          });
        }

        if (res.ok) {
          if (
            res.status === 204 ||
            res.headers.get('content-length') === '0' ||
            res.body === null
          ) {
            setData(new Date().toLocaleString());
          } else {
            result = await res.json();
            // console.log({ ...result });
            setData({ ...result });
          }
        } else {
          // Handle error response
          const errorResponse = await res.json();
          // console.log(errorResponse);
          console.error(
            'Network response was not ok. Error:',
            errorResponse.message,
            errorResponse.code,
          );

          if (
            errorResponse.code === 'A005' ||
            errorResponse.code === 'A006' ||
            errorResponse.code === 'A007'
          ) {
            // 공통 refresh 흐름을 쓴다. 새 토큰은 저장소 → tokenAccess atom으로 전달되어
            // access를 의존성으로 둔 화면이 다시 요청한다
            await refreshAccessTokenOnce();
            return;
          }

          alertInfos({ code: errorResponse.code, msg: errorResponse.message });

          // 401 처리
          if (errorResponse.status === 401) {
            navigate(-1);
          }

          // 403 처리
          if (errorResponse.status === 403) {
            if (url === '/signUp') {
              navigate('/');
            } else {
              navigate(-1);
            }
          }

          // 404 처리
          if (errorResponse.status === 404) {
            navigate('/notfound');
          }
        }
      };

      if (token === 'token') {
        await fetchWithToken();
      } else if (token === undefined) {
        await fetchWithoutToken();
      }
      // console.log(`${method} : ${url}`);
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };

  return [data, fetchData];
};

export default useFetch;
