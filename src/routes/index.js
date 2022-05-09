import { createRouter, createWebHistory } from 'vue-router'
import BoardRouter from './BoardRouter' // board와 관련된 router 불러옴
import Join from "../member/pages/Join"
import Quest from "../member/pages/Quest";
import TheRuleBook from "../member/components/TheRuleBook";
import StdOrPro from "../member/pages/StdOrPro";

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: "/",
            component: () => import('../layouts/Main')
        },
        {

            path: "/login",
            Name: 'Login',
            component: () => import("../member/pages/Login")
        },
        {
            path: "/join",
            component: Join
        },
        {
            path: "/quest",
            component: Quest
        },
        {
            path: "/rule",
            component: TheRuleBook
        },
        {
            path: "/stdorpro",
            component: StdOrPro

        },

        ...BoardRouter // board와 관련된 router 불러올 땐 앞에 ...을 붙여줍니다요
    ],

    scrollBehavior() {
        return { top:0 }
    },
})

export default router;