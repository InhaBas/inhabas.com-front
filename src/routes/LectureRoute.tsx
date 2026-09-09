import { Route, Routes } from 'react-router-dom';

import LectureCreate from '../pages/lecture/LectureCreate';
import LectureDetail from '../pages/lecture/LectureDetail';
import LectureList from '../pages/lecture/LectureList';
import RoomAnnounce from '../pages/lecture/RoomAnnounce';
import RoomCreate from '../pages/lecture/RoomCreate';
import RoomDetail from '../pages/lecture/RoomDetail';
import RoomList from '../pages/lecture/RoomList';

const LectureRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<LectureList />} />
      <Route path="detail" element={<LectureDetail />} />
      <Route path="create" element={<LectureCreate />} />
      <Route path="/room" element={<RoomList />} />
      <Route path="/room/announce" element={<RoomAnnounce />} />
      <Route path="/room/detail" element={<RoomDetail />} />
      <Route path="/room/create" element={<RoomCreate />} />
    </Routes>
  );
};

export default LectureRoute;
