import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { GetRoleAuthorization } from "../Functions/authFunctions";
import { userRole } from "../Recoil/backState";

import Activity from "../Components/Page/IBAS/Activity/Activity";
import ActivityCreate from "../Components/Page/IBAS/Activity/ActivityCreate";
import ActivityDetail from "../Components/Page/IBAS/Activity/ActivityDetail";
import Bank from "../Components/Page/IBAS/Bank/Bank";
import BankSupport from "../Components/Page/IBAS/BankSupport/BankSupport";
import BankSupportCreate from "../Components/Page/IBAS/BankSupport/BankSupportCreate";
import BankSupportDetail from "../Components/Page/IBAS/BankSupport/BankSupportDetail";

const MainRoute = () => {
    const navigate = useNavigate();
    const { isAuthorizedOverBasic } = GetRoleAuthorization();
    const role = useRecoilValue(userRole);

    useEffect(() => {
        if (role !== "") {
            if (!isAuthorizedOverBasic) {
                alert("권한이 없습니다");
                setTimeout(() => {
                    navigate(-1); // 이전 페이지로 돌아감
                }, 0);
            }
        }
    }, [role]);

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
