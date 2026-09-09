import { Route, Routes } from 'react-router-dom';

import { GetRoleAuthorization } from '../functions/authFunctions';

import HeaderTitle from '../components/common/HeaderTitle';
import MyApplication from '../pages/myInfo/MyApplication';
import MyManageExistUser from '../pages/myInfo/MyManageExistUser';
import MyManageGraduateUser from '../pages/myInfo/MyManageGraduateUser';
import MyManageNewUser from '../pages/myInfo/MyManageNewUser';
import MyManageUser from '../pages/myInfo/MyManageUser';
import MyStaff from '../pages/myInfo/MyStaff';
import BoardRoute from '../routes/BoardRoute';
import LectureRoute from '../routes/LectureRoute';
import MainRoute from '../routes/MainRoute';

import { FlexDiv } from '../styles/assets/Div';

const HeaderTitlePage = () => {
  const { isAccessible } = GetRoleAuthorization();

  return (
    <>
      <HeaderTitle />
      <FlexDiv width="100%">
        <Routes>
          <Route path="/*" element={<MainRoute />} />
          <Route path="/board/*" element={<BoardRoute />} />
          <Route path="/lecture/*" element={<LectureRoute />} />
          {isAccessible('OverSecretary') && (
            <>
              <Route path="staff/member" element={<MyManageUser />} />
              <Route path="staff/member/newStudents" element={<MyManageNewUser />} />
              <Route path="staff/member/application/:id" element={<MyApplication />} />
              <Route path="staff/member/students" element={<MyManageExistUser />} />
              <Route path="staff/member/graduateStudents" element={<MyManageGraduateUser />} />
            </>
          )}
          {isAccessible('OverVice') && (
            <>
              <Route path="staff/manage" element={<MyStaff />} />
            </>
          )}
        </Routes>
      </FlexDiv>
    </>
  );
};

export default HeaderTitlePage;
