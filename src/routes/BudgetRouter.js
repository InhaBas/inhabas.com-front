import BudgetApplicationBoard from "@/budget_application/pages/BudgetApplicationBoard";
import BudgetApplicationBoardDetail from "@/budget_application/pages/BudgetApplicationBoardDetail"
import BudgetApplicationBoardRegister from "@/budget_application/pages/BudgetApplicationBoardRegister";

const BudgetRouter =[
    {
        path: "/budget_support/:menuId",
        name: 'BudgetApplicationBoard',
        component: BudgetApplicationBoard,

    },
    {
        path: "/budget_support/:menuId/detail/:application_id",
        name: 'BudgetApplicationBoardDetail',
        component: BudgetApplicationBoardDetail,

    },
    {
        // path: "/budget_support/:menuId/register/:application_id",
        path: "/budget_support/:menuId/register",
        name: 'BudgetApplicationBoardRegister',
        component: BudgetApplicationBoardRegister,

    },
    ]

export default BudgetRouter;