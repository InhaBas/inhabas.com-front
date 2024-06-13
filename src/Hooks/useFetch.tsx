import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

import { tokenAccess } from "../Recoil/backState";
import { failRefreshing } from "../Recoil/frontState";

const alertInfos = ({ code, msg } : {code?: number, msg: string}) => {
    alert(`웹 팀에 문의해주세요. \n${code} : ${msg}`)
}

const useFetch = (): [
    any,
    (url: string, method: string, token?: string, sendData?: any, media?: boolean) => Promise<void>
] => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [access, setAccess] = useRecoilState(tokenAccess);
    const setIsNotLogin = useSetRecoilState(failRefreshing);

    const getCookie = (name: string) => {
        let matches = document.cookie.match(
            new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const refreshAccessToken = async () => {
        console.log("call refreshAccessToken");
        try {
            console.log("try refresh");
            const refreshToken = getCookie("ibas_refresh");

            let res = await fetch(`${process.env.REACT_APP_API_URL}/token/refresh`, {
                method: "POST",
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                console.log("success refresh");

                const result = await res.json();
                const newAccessToken = result.accessToken;
                console.log(newAccessToken);
                setAccess(newAccessToken);
                console.log(access);
            } else {
                console.log("fail refresh");
                setIsNotLogin(true);

                try {
                    // 에러 응답에서 오류 메시지 추출
                    const errorResponse = await res.json();
                    console.error("Network response was not ok. Error:", errorResponse.message, errorResponse.code);
                    // if (access !== 'default') {
                    //     alertInfos({ code: errorResponse.code, msg: errorResponse.message })
                    // }
                    setAccess("default");
                } catch (error) {
                    console.error("Failed to parse error response:", error);
                }
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            setIsNotLogin(true);
        }
    };

    const fetchData = async (url: string, method: string, token?: string, sendData?: any, media?: boolean) => {
        try {
            let res;
            let result;

            let headers = {
                Authorization: `Bearer ${access}`,

                // "Content-Type": media ? "multipart/form-data" : "application/json",
                // "Content-Type": "application/json",

                ...(media ? {} : { "Content-Type": "application/json" }),
            };

            const fetchWithoutToken = async () => {
                if (method.toUpperCase() === "GET") {
                    res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                        method: method,
                        headers: { "Content-Type": "application/json" },
                    });

                    if (res.ok) {
                        if (res.status === 204 || res.headers.get("content-length") === "0" || res.body === null) {
                            setData(new Date().toLocaleString());
                        } else {
                            result = await res.json();
                            console.log({ ...result });
                            setData({ ...result });
                        }
                    } else {
                        try {
                            // 에러 응답에서 오류 메시지 추출
                            const errorResponse = await res.json();
                            console.error("Network response was not ok. Error:", errorResponse.message);
                            alertInfos({ code: errorResponse.code, msg: errorResponse.message })
                            // 404처리
                            if (errorResponse.status === 404) {
                                navigate("/notfound");
                            }
                        } catch (error) {
                            console.error("Failed to parse error response:", error);
                        }
                    }
                }
            };

            const fetchWithToken = async () => {
                if (method.toUpperCase() !== "GET") {
                    let bodyData = media ? sendData : JSON.stringify(sendData);
                    res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                        method: method,
                        body: bodyData,
                        headers: headers,
                    });
                } else {

                    res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                        method: method,
                        headers: headers,
                    });

                }

                if (res.ok) {
                    if (res.status === 204 || res.headers.get("content-length") === "0" || res.body === null) {
                        setData(new Date().toLocaleString());
                    } else {
                        result = await res.json();
                        console.log({ ...result });
                        setData({ ...result });
                    }
                } else {
                    // Handle error response
                    const errorResponse = await res.json();
                    console.log(errorResponse);
                    console.error("Network response was not ok. Error:", errorResponse.message, errorResponse.code);
                    
                    if (access !== 'default') {
                        alertInfos({ code: errorResponse.code, msg: errorResponse.message })
                    }
                    if (
                        errorResponse.code === "A005" ||
                        errorResponse.code === "A006" ||
                        errorResponse.code === "A007"
                    ) {
                        await refreshAccessToken();
                    }
                    if (errorResponse.status === 401 && access !== 'default') {
                        navigate(-1);
                        // alert(errorResponse.message);  위에서 자체적으로 처리
                    }
                    if (errorResponse.status === 403) {
                        if (url === "/signUp") {
                            navigate("/");
                        } else {
                            navigate(-1);
                        }
                    }
                    // 404 처리
                    if (errorResponse.status === 404) {
                        navigate("/notfound");
                    }
                }
            };

            if (token === "token") {
                await fetchWithToken();
            } else if (token === undefined) {
                await fetchWithoutToken();
            }
            console.log(`${method} : ${url}`);
        } catch (error) {
            console.error("Error in fetchData:", error);
        }
    };

    return [data, fetchData];
};

export default useFetch;
