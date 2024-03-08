export const ConvertLabel = () => {
    // 역할에 대한 레이블 변환
    // 예: 비활동회원, 활동회원, ...
    const convertRoleLabel = (role: string) => {
        let roleLabel = "";
        switch (role) {
            case "CHIEF":
                roleLabel = "회장";
                break;
            case "VICE_CHIEF":
                roleLabel = "부회장";
                break;
            case "EXECUTIVES":
                roleLabel = "운영팀";
                break;
            case "SECRETARY":
                roleLabel = "총무";
                break;
            case "BASIC":
                roleLabel = "활동회원";
                break;
            case "DEACTIVATED":
                roleLabel = "비활동회원";
                break;
            default:
                roleLabel = "알 수 없음";
        }
        return roleLabel;
    };

    // 소속에 대한 레이블 변환
    // 예: 대학원생, 학부생, ...
    const convertTypeLabel = (type: string) => {
        let typeLabel = "";
        switch (type) {
            case "UNDERGRADUATE":
                typeLabel = "학부생";
                break;
            case "GRADUATED":
                typeLabel = "졸업생";
                break;
            case "BACHELOR":
                typeLabel = "대학원생";
                break;
            case "PROFESSOR":
                typeLabel = "교수";
                break;
            case "OTHER":
                typeLabel = "기타";
                break;
            default:
                typeLabel = "알 수 없음";
        }
        return typeLabel;
    };

    // 상태에 대한 레이블 변환
    // 예: 승인, 거절, ...
    const convertStatusLabel = (status: string) => {
        let statusLabel = "";
        switch (status) {
            case "PENDING":
                statusLabel = "대기중";
                break;
            case "APPROVED":
                statusLabel = "승인";
                break;
            case "REJECTED":
                statusLabel = "거절";
                break;

            default:
                statusLabel = "알 수 없음";
        }
        return statusLabel;
    };

    return {
        convertRoleLabel,
        convertTypeLabel,
        convertStatusLabel,
    };
};
