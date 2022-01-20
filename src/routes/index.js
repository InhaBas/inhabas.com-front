import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home'
import About from '../pages/About'
import Board from '../board/pages/Board'
import ContestBoard from '../board/pages/ContestBoard'
import DragNDrop from "@/common/TheDragNDrop";
import Board_Detail from "../board/pages/BoardDetail";
import BoardRegister from "@/board/pages/BoardRegister";
import ContestRegister from "@/board/pages/ContestRegister";



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