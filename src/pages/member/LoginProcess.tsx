import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { signUpQueries } from '../../queries/signUp';
import { tokenAccess, userEmail, userImage } from '../../recoil/backState';
import { FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';

const LoginProcess = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [access, setAccess] = useRecoilState(tokenAccess);
  const setProfile = useSetRecoilState(userImage);
  const accessToken = String(searchParams.get('accessToken'));
  const refreshToken = searchParams.get('refreshToken');
  const image = searchParams.get('imageUrl');
  const error = searchParams.get('error');
  const setEmail = useSetRecoilState(userEmail);

  const parseJwt = (token: string | undefined) => {
    if (!token) {
      return null;
    }

    try {
      // 여기서 token이 undefined가 아닌지 확인
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      // 토큰 파싱 오류 처리
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    if (error) {
      navigate('/login');
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      setAccess(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    document.cookie = `ibas_refresh=${refreshToken}; path=/; `;
    // document.cookie = `ibas_refresh=${refreshToken}; path=/; httpOnly;`;
  }, [refreshToken]);

  useEffect(() => {
    if (image) {
      setProfile(image);
    }
  }, [image]);

  useEffect(() => {
    if (accessToken) {
      const tokenData = parseJwt(access);
      if (tokenData && tokenData.email) {
        setEmail(tokenData.email);
      }
    } else navigate('/login');
  }, [access]);

  // URL의 토큰을 받은 뒤에 가입 여부를 확인한다
  const { data: signUpCheckData } = useQuery({
    ...signUpQueries.check(),
    enabled: access !== 'default',
  });
  const isSignedUp = signUpCheckData?.check;

  useEffect(() => {
    if (isSignedUp) {
      navigate('/');
    } else if (isSignedUp === false) {
      navigate('/signUp');
    }
  }, [isSignedUp]);

  return (
    <FlexDiv width="100%" height="100vh">
      <FlexDiv width="3%">
        <Img src="/images/loading.svg" />
      </FlexDiv>
    </FlexDiv>
  );
};

export default LoginProcess;
