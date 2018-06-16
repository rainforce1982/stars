import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    shop: {},
    otherShops: [],
    room: {}, // 当前切换的房台
    orginalRoom: {}, // 初始房台
    cart: {
      SubmitOrders: []
    },
    numberPicker: {},
    goodsMenu: [],
    accessToken: null,
    startUrl: null,
    accessTokenExpire: 0
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = {...state.userInfo, ...userInfo}
    },
    setCart (state, cart) {
      state.cart = {...cart}
    },
    setShop (state, shop) {
      state.shop = {...state.shop, ...shop}
    },
    setOtherShops (state, shops) {
      state.otherShops = [...shops]
    },
    setRoom (state, room) {
      state.room = {...state.room, ...room}
    },
    setOriginalRoom (state, orginalRoom) {
      state.orginalRoom = {...state.orginalRoom, ...orginalRoom}
    },
    setNumberPicker (state, obj) {
      state.numberPicker = {...obj}
    },
    setGoodsMenu (state, goodsMenu) {
      state.goodsMenu = [...goodsMenu]
    },
    CONFIRM_REMARK (state, {
      remarkText,
      inputText
    }) {
      state.remarkText = remarkText
      state.inputText = inputText
    },
    setAccessToken (state, accessTokenObj) {
      state.accessTokenExpire = accessTokenObj.expires_in || 7200
      state.accessToken = accessTokenObj.access_token
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        state.accessTokenExpire --
        if (state.accessTokenExpire === 0) {
          state.accessToken = null
        }
      }, 1000)
    },
    setStartUrl (state, url) {
      state.startUrl = url
    }
  },
  getters: {
    userlocal: state => {
      if (localStorage.getItem('sakura_user')) {
        return JSON.parse(localStorage.getItem('sakura_user'))
      } else {
        let user = {}
        user.id = Date.now()
        user.nickname = '访客'
        user.avatar = '/static/defaultuser.jpg'
        user.badge = 0
        let body = JSON.stringify(user)
        localStorage.setItem('sakura_user', body)
        return user
      }
    },
    getOpenId: state => {
      if (state.userInfo.osType === 'iOS') {
        return state.userInfo.openid
      } else {
        return ''
      }
    },
    getStartUrl: state => {
      if (state.userInfo.osType === 'iOS') {
        return state.startUrl
      }
      return ''
    }
  }
})

export default store
