import VueRouter from 'vue-router'
import AssociationList from './components/business/AssociationList.vue'
import MyAssociation from './components/business/MyAssociation.vue'
import EventList from './components/business/EventList.vue'
import Administration from './components/business/Administration.vue'
import AdministrationOther from './components/business/AdministrationOther.vue'
import Messages from './components/business/Messages.vue'
import Statistics from './components/business/Statistics.vue'
import StatisticsBusiness from './components/business/StatisticsBusiness.vue'
import BusinessManagement from './components/business/BusinessManagement.vue'
import Database from './components/business/Database.vue'
import Super from './components/business/Super.vue'
import LogIn from './components/framework/LogIn.vue'
import Home from './components/framework/Home.vue'
import notFound from './components/framework/notFound/notFound.vue'

// import store from './store.js'
// const User={
//     template:<div>{{$route.param.id}}</div>
// }
// Vue.use(Router)
const router = new VueRouter({
    // mode: 'history',
    routes: [
        { path: "/", redirect: "/login" },
        {
            path: "/404",
            name: "notfound",
            component: notFound
        },
        {
            path: "/login",
            name: 'login',
            component: LogIn,
            meta: {
                title: '登陆',
                icon: 'el-icon-s-data'
            }
        },
        {
            path: "/home",
            name: 'home',
            component: Home,
            redirect: "/home/associations",
            meta: {
                title: '社团系统',
                icon: 'el-icon-s-data'
            },
            children: [
                { path: "associations", component: AssociationList },
                { path: "events", component: EventList },
                { path: "myassociation", component: MyAssociation },
                { path: "administration/:id", component: Administration },
                { path: "administrationOther/:id", component: AdministrationOther },
                { path: "messages", component: Messages },
                { path: "businessmanagement", component: BusinessManagement },
                { path: "statistics", component: Statistics },
                { path: "statisticsBusiness", component: StatisticsBusiness },
                { path: "database", component: Database },
                { path: "super", component: Super }
            ]
        },
        {
            path: "*", // 此�?�需特别注意�?于最底部
            redirect: "/404"
        }
    ]
})

//�?由守�?
router.beforeEach((to, from, next) => {
    if (localStorage.getItem('token')) {
        if (to.name === 'login') {
            next('home')
        } else {
            next()
        }
    } else {
        if (to.name === 'login') {
            next()
        } else {
            next({
                path: '/login',
                query: { redirect: window.location.href }
            })
        }
    }
})
export default router
// //获取原型对象上的push函数
// const originalPush = router.prototype.push
// //�?改原型�?�象�?的push方法
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }