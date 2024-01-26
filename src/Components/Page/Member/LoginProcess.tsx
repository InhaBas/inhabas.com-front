import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";
import { signupCheck, tokenAccess, userEmail, userImage } from "../../../Recoil/backState";

import { FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";

const LoginProcess = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [access, setAccess] = useRecoilState(tokenAccess);
    const setProfile = useSetRecoilState(userImage);
    const accessToken = String(searchParams.get("accessToken"));
    const refreshToken = searchParams.get("refreshToken");
    const image = searchParams.get("imageUrl");
    const error = searchParams.get("error");
    const setEmail = useSetRecoilState(userEmail);

    const parseJwt = (token: string | undefined) => {
        if (!token) {
            return null;
        }

        try {
            // 여기서 token이 undefined가 아닌지 확인
            var base64Url = token.split(".")[1];
            if (!base64Url) {
                return null;
            }

            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            // 토큰 파싱 오류 처리
            console.error("Error parsing JWT:", error);
            return null;
        }
    };

    useEffect(() => {
        if (error) {
            navigate("/login");
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            setAccess(accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        document.cookie = `ibas_refresh=${refreshToken}; path=/; `;
        // document.cookie = `ibas_refresh=${refreshToken}; path=/; httpOnly;`;
    }, [refreshToken]);

    useEffect(() => {
        if (image) {
            setProfile(image);
        }
    }, [image]);

    useEffect(() => {
        if (accessToken) {
            const tokenData = parseJwt(access);
            if (tokenData && tokenData.email) {
                setEmail(tokenData.email);
            }
        } else navigate("/login");
    }, [access]);

    const [getData, getFetchData] = useFetch();
    const [check, setCheck] = useRecoilState(signupCheck);

    useEffect(() => {
        console.log(access);
        if (access !== "default") {
            getFetchData("/signUp/check", "GET", "token");
        }
        return () => {
            setCheck(null);
        };
    }, [access]);

    useEffect(() => {
        if (getData) {
            setCheck(getData.check);
        }
    }, [getData, setCheck]);

    useEffect(() => {
        console.log(check);
        if (check) {
            navigate("/");
        } else if (check === false) {
            navigate("/signUp");
        }
    }, [check]);

    return (
        <FlexDiv width="100%" height="100vh">
            <FlexDiv width="3%">
                <Img src="/images/loading.svg" />
            </FlexDiv>
        </FlexDiv>
    );
};

export default LoginProcess;
