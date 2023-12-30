import { Route, Routes } from "react-router-dom";
import Carousel from "../Components/Common/Carousel";
import Activity from "../Components/Page/IBAS/Activity/Activity";
import ActivityCreate from "../Components/Page/IBAS/Activity/ActivityCreate";
import ActivityDetail from "../Components/Page/IBAS/Activity/ActivityDetail";
import Bank from "../Components/Page/IBAS/Bank/Bank";
import BankSupport from "../Components/Page/IBAS/BankSupport/BankSupport";
import BankSupportCreate from "../Components/Page/IBAS/BankSupport/BankSupportCreate";
import BankSupportDetail from "../Components/Page/IBAS/BankSupport/BankSupportDetail";
import Honor from "../Components/Page/IBAS/Honor";
import Introduce from "../Components/Page/IBAS/Introduce";
import Main from "../Components/Page/IBAS/Main";
import ManageUser from "../Components/Page/IBAS/MyInfo/ManageUser";
import MyInfo from "../Components/Page/IBAS/MyInfo/MyInfo";
import Login from "../Components/Page/Member/Login";
import LoginProcess from "../Components/Page/Member/LoginProcess";
import Rule from "../Components/Page/Member/Rule";
import Signup from "../Components/Page/Member/Signup";
import SignupQuestion from "../Components/Page/Member/SignupQuestion";

const MainRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="slide" element={<Carousel />} />
            <Route path="introduce" element={<Introduce />} />

            <Route path="activity" element={<Activity />} />
            <Route path="activity/detail" element={<ActivityDetail />} />
            <Route path="activity/create" element={<ActivityCreate />} />

            <Route path="bank" element={<Bank />} />
            <Route path="bank/support" element={<BankSupport />} />
            <Route path="bank/support/detail" element={<BankSupportDetail />} />
            <Route path="bank/support/create" element={<BankSupportCreate />} />

            <Route path="honor" element={<Honor />} />

            <Route path="myInfo" element={<MyInfo />} />
            <Route path="staff/member" element={<ManageUser />} />

            <Route path="login" element={<Login />} />
            <Route path="login/process" element={<LoginProcess />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signup/question" element={<SignupQuestion />} />
            <Route path="rule" element={<Rule />} />
        </Routes>
    );
};

export default MainRoute;
