import BudgetApplicationBoard from "@/budget_application/pages/BudgetApplicationBoard";
import BudgetApplicationBoardDetail from "@/budget_application/pages/BudgetApplicationBoardDetail"

const BudgetRouter =[
    {
        path: "/budget_support/:menuId",
        // path: "/list",
        name: 'BudgetApplicationBoard',
        component: BudgetApplicationBoard,
        // component: () => import('@/board/pages/Board'),
        // 게시판
    },

    {
        path: "/budget_support/:menuId/detail/:application_id",
        // path: "/list",
        name: 'BudgetApplicationBoardDetail',
        component: BudgetApplicationBoardDetail,
        // component: () => import('@/board/pages/Board'),
        // 게시판
    },
    ]

export default BudgetRouter;