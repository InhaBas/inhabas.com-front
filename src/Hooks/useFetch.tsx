import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { tokenAccess } from "../Recoil/backState";

const useFetch = (): [any, (url: string, method: string, token?: string, sendData?: any) => Promise<void>] => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [access, setAccess] = useRecoilState(tokenAccess);

    const getCookie = (name: string) => {
        let matches = document.cookie.match(
            new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)")
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const refreshAccessToken = async () => {
        console.log("call refreshAccessToken");
        try {
            const refreshToken = getCookie("ibas_refresh");

            let res = await fetch(`${process.env.REACT_APP_API_URL}/token/refresh`, {
                method: "POST",
                body: JSON.stringify({
                    refreshToken: refreshToken,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const result = await res.json();
                const newAccessToken = result.accessToken;
                setAccess(newAccessToken);
                console.log(access);
            } else {
                try {
                    // 에러 응답에서 오류 메시지 추출
                    const errorResponse = await res.json();
                    console.error("Network response was not ok. Error:", errorResponse.message, errorResponse.code);
                    setAccess("default");
                } catch (error) {
                    console.error("Failed to parse error response:", error);
                }
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
        }
    };

    const fetchData = async (url: string, method: string, token?: string, sendData?: any) => {
        try {
            let res;
            let result;

            let headers = {
                Authorization: `Bearer ${access}`,
                // Authorization: 'Bearer ',
                "Content-Type": "application/json",
            };

            if (method.toUpperCase() === "GET" && token == undefined) {
                // Do something for GET without token
                res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    result = await res.json();
                    console.log({ ...result });

                    setData({ ...result });
                } else {
                    try {
                        // 에러 응답에서 오류 메시지 추출
                        const errorResponse = await res.json();
                        console.error("Network response was not ok. Error:", errorResponse.message);
                    } catch (error) {
                        console.error("Failed to parse error response:", error);
                    }
                }
                setData({ ...result });
            } else if (method.toUpperCase() === "GET" && token === "token") {
                // Do something for GET with token
                res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                    method: method,
                    headers: headers,
                });

                if (res.ok) {
                    result = await res.json();
                    console.log({ ...result });
                    setData({ ...result });
                } else {
                    // console.log(err.response.data.message);
                    // console.error("Network response was not ok.");
                    try {
                        // 에러 응답에서 오류 메시지 추출
                        const errorResponse = await res.json();
                        console.error("Network response was not ok. Error:", errorResponse.message, errorResponse.code);
                        if (errorResponse.code === "A005" || "A006" || "A007") {
                            refreshAccessToken();
                        }
                        if (errorResponse.status === 403) {
                            navigate(-1);
                            alert("권한이 없습니다");
                        }
                    } catch (error) {
                        console.error("Failed to parse error response:", error);
                    }
                    // setData({ ...result });
                }
                setData({ ...result });
            } else if (method.toUpperCase() !== "GET") {
                // Do something for other methods
                let res = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
                    method: method,
                    body: JSON.stringify(sendData),
                    headers: headers,
                });
                if (res.ok) {
                    // Check if response has content
                    if (res.status === 204 || res.headers.get("content-length") === "0" || res.body === null) {
                        setData("noContents");
                        // Handle the case where the response body is empty
                        // You can set a default value, show a message, etc.
                    } else {
                        let result;
                        try {
                            result = await res.json();
                            console.log({ ...result, change: method.toUpperCase() !== "GET" });
                            console.log(`${method} : ${url}`);
                            setData(result);
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }

                        if (result) {
                            setData(result);
                        }
                    }
                    console.log(data);
                } else {
                    // console.error("Network response was not ok.", response.status, response.statusText);
                    try {
                        // 에러 응답에서 오류 메시지 추출
                        const errorResponse = await res.json();
                        console.error("Network response was not ok. Error:", errorResponse.message);
                    } catch (error) {
                        console.error("Failed to parse error response:", error);
                    }
                }
            }
            console.log(`${method} : ${url}`);
            // Additional logic based on response or other conditions
            // ...
        } catch (error) {
            console.error("Error in fetchData:", error);
        }
    };

    return [data, fetchData];
};

export default useFetch;
