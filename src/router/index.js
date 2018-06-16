import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/view/goods'
import Home from '@/view/home'
import Index from '@/view/index'
import confirmOrder from '@/view/confirmOrder/confirmOrder'
import remark from '@/view/confirmOrder/children/remark'
import payment from '@/view/confirmOrder/children/payment'
import paySuccess from '@/view/confirmOrder/children/paySuccess'
import orderSuccess from '@/view/confirmOrder/children/orderSuccess'
import order from '@/view/order/order'
import orderDetail from '@/view/order/children/orderDetail'
import Profile from '@/view/profile/profile'
import paycode from '@/view/profile/children/paycode'
import Info from '@/view/profile/children/info'
import login from '@/view/login/login'
import room from '@/view/room/room'
import book from '@/view/book/book'
import bookSuccess from '@/view/book/bookSuccess'
import bookResult from '@/view/book/bookResult'
// import Seller from '@/view/seller'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      children: [
        {
          path: 'info',
          name: 'Info',
          component: Info
        }
      ]
    },
    {
      path: '/profile/paycode',
      name: 'paycode',
      component: paycode
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: confirmOrder
    },
    {
      path: '/confirmOrder/remark',
      name: 'remark',
      component: remark
    },
    {
      path: '/confirmOrder/payment',
      name: 'payment',
      component: payment
    },
    {
      path: '/confirmOrder/orderSuccess',
      name: 'orderSuccess',
      component: orderSuccess
    },
    {
      path: '/confirmOrder/paySuccess',
      name: 'paySuccess',
      component: paySuccess
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/order/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/book',
      name: 'book',
      component: book
    }, {
      path: '/book/bookSuccess',
      name: 'bookSuccess',
      component: bookSuccess
    }, {
      path: '/book/bookResult',
      name: 'bookResult',
      component: bookResult
    }
  ]
})
