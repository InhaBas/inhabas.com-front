import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 상단으로 스크롤
    }, [pathname]); // pathname이 변경될 때마다 실행

    return null; // null을 반환하여 실제로 화면에는 아무것도 나타나지 않도록 함
};

export default ScrollToTop;
