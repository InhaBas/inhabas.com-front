import { useRecoilValue } from "recoil";
import { userRole } from "../Recoil/backState";

// userRole 상태값을 가져와서 필요한 변수들을 계산하여 내보냅니다.
export const GetRoleAuthorization = () => {
    const role = useRecoilValue(userRole);
    const isAuthorizedOverVice = ["CHIEF", "VICE_CHIEF"].includes(role);
    const isAuthorizedOverSecretary = ["CHIEF", "VICE_CHIEF", "EXECUTIVES", "SECRETARY"].includes(role);
    const isAuthorizedOverExecutives = ["CHIEF", "VICE_CHIEF", "EXECUTIVES"].includes(role);
    const isAuthorizedExceptExecutives = ["CHIEF", "VICE_CHIEF", "SECRETARY"].includes(role);
    const isSecretary = ["SECRETARY"].includes(role);

    return {
        isAuthorizedOverVice,
        isAuthorizedOverSecretary,
        isAuthorizedOverExecutives,
        isAuthorizedExceptExecutives,
        isSecretary,
    };
};
