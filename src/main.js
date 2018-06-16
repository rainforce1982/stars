// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../style.css'
import store from './store'
// import wx from 'weixin-js-sdk'
import { Input, Upload, Table, TableColumn } from 'element-ui'
// import VueTouch from 'vue-touch'
import { Button, Cell, Header, InfiniteScroll, Field, Lazyload, Swipe, SwipeItem, Popup, Picker, Loadmore, Toast } from 'mint-ui'

Vue.config.productionTip = false

Vue.component(Popup.name, Popup)
Vue.component(Picker.name, Picker)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Lazyload)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Field.name, Field)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Toast.name, Toast)
Vue.use(InfiniteScroll)
// Vue.use(VueTouch)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
