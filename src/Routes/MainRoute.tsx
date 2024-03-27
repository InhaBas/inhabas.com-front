import { Route, Routes } from "react-router-dom";
import Activity from "../Components/Page/IBAS/Activity/Activity";
import ActivityCreate from "../Components/Page/IBAS/Activity/ActivityCreate";
import ActivityDetail from "../Components/Page/IBAS/Activity/ActivityDetail";
import Bank from "../Components/Page/IBAS/Bank/Bank";
import BankSupport from "../Components/Page/IBAS/BankSupport/BankSupport";
import BankSupportCreate from "../Components/Page/IBAS/BankSupport/BankSupportCreate";
import BankSupportDetail from "../Components/Page/IBAS/BankSupport/BankSupportDetail";
import { GetRoleAuthorization } from "../Functions/authFunctions";

const MainRoute = () => {
    const { isAuthorizedOverBasic } = GetRoleAuthorization();
    return (
        <Routes>
            <Route path="activity" element={<Activity />} />
            <Route path="activity/detail" element={<ActivityDetail />} />
            <Route path="activity/create" element={<ActivityCreate />} />
            {isAuthorizedOverBasic && (
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
