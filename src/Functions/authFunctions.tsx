import { useRecoilValue } from "recoil";
import { userRole } from "../Recoil/backState";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { failRefreshing } from "../Recoil/frontState";

export interface AuthorizationInterface {
    authorization: 'OverVice' |
                  'OverExecutives' |
                  'OverSecretary' |
                  'OverBasic' |
                  'OverDeactivate' |
                  'ExceptExecutives' |
                  'Secretary';
}

// userRole 상태값을 가져와서 필요한 변수들을 계산하여 내보냅니다.
export const GetRoleAuthorization = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const isNotLogin = useRecoilValue(failRefreshing); 

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

    const authorizationLocation: { [key: string]: string[] } = {
        OverBasic: [
            "/bank",
            "/bank/support",
            `/bank/support/detail/${id}`,
            "/bank/support/create",
            `/bank/support/update/${id}`,
        ],
        OverSecretary: [
            "/staff/member",
            "/staff/member/newStudents",
            `/staff/member/application/${id}`,
            "/staff/member/students",
            "/staff/member/graduateStudents",
        ],
        OverVice: [
            "/staff/manage",
        ]
    }

    let isNavigation = false;

    useEffect(() => {
        if (!isNotLogin && isNavigation && role !== "") {
            alert('해당 게시판에 대한 접근 권한이 없습니다')
            navigate(-1);
        }
    }, [isNavigation])
    
    const isAccessible = (authorization: AuthorizationInterface['authorization']) => {
        isNavigation = false;

        const isAuthorized = {
            OverVice: isAuthorizedOverVice,
            OverExecutives: isAuthorizedOverExecutives,
            OverSecretary: isAuthorizedOverSecretary,
            OverBasic: isAuthorizedOverBasic,
            OverDeactivate: isAuthorizedOverDeactivate,
            ExceptExecutives: isAuthorizedExceptExecutives,
            Secretary: isSecretary,
        }

        // 라우터 탐색 중 실행되는 경우(확인 함수가 라우터를 탐색하는 과정에서 모두 켜짐)
        if (!authorizationLocation[authorization]?.includes(location?.pathname)) {
            return true;
        }

        // 허가 => 접속한 주소에 따른 권한 검사가 맞는지 && 해당 권한을 가지고 있는지
        if (authorizationLocation[authorization]?.includes(location?.pathname) && isAuthorized[authorization]) {
            return true;
        }
        
        // 불허
        isNavigation = true;
        return false;
    }

    return {
        isAuthorizedOverVice,
        isAuthorizedOverSecretary,
        isAuthorizedOverExecutives,
        isAuthorizedOverBasic,
        isAuthorizedOverDeactivate,
        isAuthorizedExceptExecutives,
        isSecretary,
        isAccessible,
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
