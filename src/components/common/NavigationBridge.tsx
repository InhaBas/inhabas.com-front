import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerNavigate } from '../../queries/apiErrorEffects';

// 화면에 아무것도 그리지 않고, 라우터 밖의 handleApiError가 쓸 navigate만 등록한다
const NavigationBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
    return () => registerNavigate(null);
  }, [navigate]);

  return null;
};

export default NavigationBridge;
