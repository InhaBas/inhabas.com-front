import { useRecoilValue } from "recoil";
import { userRole } from "../Recoil/backState";

// userRole 상태값을 가져와서 필요한 변수들을 계산하여 내보냅니다.
export const GetRoleAuthorization = () => {
    const role = useRecoilValue(userRole);
    const isAuthorizedOverVice = ["CHIEF", "VICE_CHIEF"].includes(role);
    const isAuthorizedOverExecutives = ["CHIEF", "VICE_CHIEF", "EXECUTIVES"].includes(role);
    const isAuthorizedOverSecretary = ["CHIEF", "VICE_CHIEF", "EXECUTIVES", "SECRETARY"].includes(role);
    const isAuthorizedOverBasic = ["CHIEF", "VICE_CHIEF", "EXECUTIVES", "SECRETARY", "BASIC"].includes(role);
    const isAuthorizedOverDeactivate = [
        "CHIEF",
        "VICE_CHIEF",
        "EXECUTIVES",
        "SECRETARY",
        "BASIC",
        "DEACTIVATED",
    ].includes(role);

    const isAuthorizedExceptExecutives = ["CHIEF", "VICE_CHIEF", "SECRETARY"].includes(role);
    const isSecretary = ["SECRETARY"].includes(role);

    return {
        isAuthorizedOverVice,
        isAuthorizedOverSecretary,
        isAuthorizedOverExecutives,
        isAuthorizedOverBasic,
        isAuthorizedOverDeactivate,
        isAuthorizedExceptExecutives,
        isSecretary,
    };
};

//  ROLE

// 1. 회장 / `CHIEF`
// 2. 부회장  / `VICE_CHIEF`
// 3. 운영팀 / *`EXECUTIVES`*
// 4. 총무 / *`SECRETARY`*
// 5. 활동 일반회원 (교수 포함) / `BASIC`
// 6. 비활동 회원 (졸업생 포함) / `DEACTIVATED`
// 7. 미승인 회원 / `NOT_APPROVED`
// 8. 소셜로그인 직후, 회원가입 절차를 거치지 않은 상태 / *`SIGNING_UP`*
// 9. 비회원 / `ANONYMOUS`
