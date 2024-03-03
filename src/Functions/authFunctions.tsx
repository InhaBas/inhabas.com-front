import { useRecoilValue } from "recoil";
import { userRole } from "../Recoil/backState";

const role = useRecoilValue(userRole);

export const isAuthorizedOverVice = ["CHIEF", "VICE_CHIEF"].includes(role);
export const isAuthorizedOverSecretary = ["CHIEF", "VICE_CHIEF", "EXECUTIVES", "SECRETARY"].includes(role);
export const isAuthorizedOverExecutives = ["CHIEF", "VICE_CHIEF", "EXECUTIVES"].includes(role);
export const isAuthorizedExceptExecutives = ["CHIEF", "VICE_CHIEF", "SECRETARY"].includes(role);
export const isSecretary = ["SECRETARY"].includes(role);
