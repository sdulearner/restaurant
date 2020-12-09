import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";

import UserHome from '../views/UserHome.vue'
import Shop from "@/views/Shop";
import OrderList from "@/views/OrderList";
import UserInfo from "@/views/UserInfo";

import AdmiHome from "@/views/AdmiHome";
import DishManage from "@/views/DishManage";
import OrderManage from "@/views/OrderManage";
import DeskManage from "@/views/DeskManage";
import ExpenseManage from "@/views/ExpenseManage";
import MaterialManage from "@/views/MaterialManage";
import DataView from "@/views/DataView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: '/userHome',
        name: 'UserHome',
        component: UserHome,
        children: [
            {
                path: '/shop',
                component: Shop,
                meta: {
                    keepAlive: true,
                }
            },
            {
                path: '/userInfo',
                component: UserInfo
            },
            {
                path: '/orderList',
                component: OrderList
            },
        ]
    },
    {
        path: '/admiHome',
        name: 'AdmiHome',
        component: AdmiHome,
        children: [
            {
                path: '/dishManage',
                component: DishManage,
            },
            {
                path: '/orderManage',
                component: OrderManage
            },
            {
                path: '/deskManage',
                component: DeskManage
            },
            {
                path: '/expenseManage',
                component: ExpenseManage
            },
            {
                path: '/materialManage',
                component: MaterialManage
            },
            {
                path: '/dataView',
                component: DataView
            },
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
