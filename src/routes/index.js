import { createRouter, createWebHistory } from 'vue-router'
import BoardRouter from './BoardRouter' // board와 관련된 router 불러옴
import Main from '../layouts/Main' // default

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Main
        },


        ...BoardRouter // board와 관련된 router 불러올 땐 앞에 ...을 붙여줍니다요
    ],

})