import { Route, Routes, useNavigate } from 'react-router-dom';

import { GetRoleAuthorization } from '../functions/authFunctions';

import Activity from '../pages/activity/Activity';
import ActivityCreate from '../pages/activity/ActivityCreate';
import ActivityDetail from '../pages/activity/ActivityDetail';
import Bank from '../pages/budget/Bank';
import BankSupport from '../pages/budget/BankSupport';
import BankSupportCreate from '../pages/budget/BankSupportCreate';
import BankSupportDetail from '../pages/budget/BankSupportDetail';

const MainRoute = () => {
  const { isAccessible, isAuthorizedOverDeactivate } = GetRoleAuthorization();

  return (
    <Routes>
      <Route path="activity" element={<Activity />} />
      <Route path="activity/detail" element={<ActivityDetail />} />
      <Route path="activity/detail/:id" element={<ActivityDetail />} />
      <Route path="activity/create" element={<ActivityCreate />} />
      <Route path="activity/update/:id" element={<ActivityCreate />} />
      {isAccessible('OverDeactivate') && (
        <>
          <Route path="bank" element={<Bank />} />
          <Route path="bank/support" element={<BankSupport />} />
          <Route path="bank/support/detail/:id" element={<BankSupportDetail />} />
          <Route path="bank/support/create" element={<BankSupportCreate />} />
          <Route path="bank/support/update/:id" element={<BankSupportCreate />} />
        </>
      )}
    </Routes>
  );
};

export default MainRoute;
