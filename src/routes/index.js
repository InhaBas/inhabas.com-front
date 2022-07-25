import { createRouter, createWebHistory } from 'vue-router'
import BoardRouter from './BoardRouter' // board와 관련된 router 불러옴
import Join from "../member/pages/Join"
import Quest from "../member/pages/Quest";
import TheRuleBook from "../member/components/TheRuleBook";
import StdOrPro from "../member/pages/StdOrPro";
import BudgetRouter from "@/routes/BudgetRouter";
const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: "/",
            name: 'EmptyLayout',
            component: () => import('@/layouts/EmptyLayout'),
            children: [
                {
                    path: '/',
                    name: 'main',
                    component: ()=> import('@/layouts/Main'),
                },

            ],
        },

        {
            path: "/",
            name: 'DefaultLayout',
            component: () => import('@/layouts/DefaultLayout'),
            children: [
                ...BoardRouter,
                ...BudgetRouter

            ],
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
    ],

    scrollBehavior() {
        return { top:0 }
    },
})

export default router;