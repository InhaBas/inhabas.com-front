import { CalendarIcon } from './icons';
import ResultNotice from './ResultNotice';

// 403 S001(가입 기간 아님) 안내
const RecruitClosedNotice = () => (
  <ResultNotice icon={<CalendarIcon size={30} />} title="지금은 신입 부원 모집 기간이 아니에요">
    모집 일정은 홈 화면의 모집 안내에서 확인할 수 있어요.
  </ResultNotice>
);

export default RecruitClosedNotice;
