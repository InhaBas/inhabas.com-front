import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home'
import About from '../pages/About'
import Board from '../pages/Board'
import ContestBoard from '../pages/ContestBoard'
import DragNDrop from "@/components/DragNDrop";
import Board_Detail from "../pages/BoardDetail";
import BoardRegister from "@/pages/BoardRegister";
import ContestRegister from "@/pages/ContestRegister";



export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/about",
            component: About
        },
        {
            path: "/board",
            component: Board
        },
        {
            path: "/contestBoard",
            component: ContestBoard
        },
        {
            path: "/boardDetail",
            component: Board_Detail
        },
        {
            path: "/boardRegister",
            component: BoardRegister
        },
        {
            path: "/contestRegister",
            component: ContestRegister
        },
        {
            path: "/dragNDrop",
            component: DragNDrop
        },

    ]

})