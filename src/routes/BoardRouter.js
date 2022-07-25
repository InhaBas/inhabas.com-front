import BoardRegister from "@/board/pages/BoardRegister";
import BoardDetail from "@/board/pages/BoardDetail";
import ContestBoard from "@/board/pages/ContestBoard";
import ContestRegister from "@/board/pages/ContestRegister";
import ContestDetail from "@/board/pages/ContestDetail";
import Board from "@/board/pages/Board";

const boardRouter =[
    {
        path: "/list/:menuId",
        // path: "/list",
        name: 'Board',
        component: Board,
        // component: () => import('@/board/pages/Board'),
        // 게시판
    },
    // {
    //     path: "/list/:id/:page",
    //     component: () => import('@/board/pages/Board'),
    //     // 게시판
    // },
    {
        path: "/contest/:menuId",
        component: ContestBoard
        // 공모전 게시판
    },
    {
        path: "/list/:menuId/detail/:id",
        name:"BoardDetail",
        component: BoardDetail,
        props: true
        // 게시판 / 공모전 게시판 detail
    },
    {
        path: "/list/:menuId/register",
        component: BoardRegister
        // 게시판 등록
    },
    {
        path: "/contest/register",
        component: ContestRegister
        // 공모전 게시판 등록
    },
    {
        path: "/contest/detail",
        component: ContestDetail
        // 공모전 게시판 detail
    },
]


export default boardRouter;