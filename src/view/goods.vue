<template>
  <div>
    <shopHeader :seller="seller"></shopHeader>
    <div class="profile" @click="profile">
      <router-link to="/profile"><i class="ion-person iconfont "></i></router-link>
    </div>
    <div class="scanQR" @click="btnScanQRCode()">
      <i class="ion-qr-scanner iconfont "></i>
    </div>
    <div class="good">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{'current':currentIndex === index}"
              @click="selectMenu(index, $event)">
            <span class="text">
              <span v-show="item.type>0" class=" icon" :class="classMap[item.type]"></span>{{item.GoodsTypeName}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.GoodsTypeName}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item">
                <div class="icon" v-if="imgs(food.ID)"  @click="selectFood(food, $event)">
                  <!-- <img :src="food.icon" alt="" width="57"> -->
                  <img :src="imgs(food.ID)" v-if="imgs(food.ID)" @error="setErrorImg" alt="" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.GoodsName}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span class="count">好评{{food.rating}}</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.Price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartControl-wrapper">
                    <div v-if="food.IsPack" class="specButton" @click.stop.prevent="selectSpec(food)">套餐
                      <i v-if="specDone(food)" class="ion-ios-checkmark iconfont spec-ok"></i>
                      <i v-else class="ion-android-alert iconfont spec-need"></i>
                    </div>
          <!--           <div  class="specButton" @click.stop.prevent="selectRemark(food)">
                      
                    </div> -->
                    <numControl v-if="food.GoodsRemarks.length > 0" :count="food.GoodsCount" @increment="selectRemark(food)" @decrement="selectRemark(food)"></numControl>
                    <cartControl v-else :food.sync="food" @increment="incrementTotal" @decrement="storeSelectFoodsLocal(selectFoods)"></cartControl>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
      <div class="siderBottom">
        <shopCart :gotoPay="gotoPay" :selectFoods.sync="selectFoods" :delivery-price="seller.deliveryPrice" @confirm="syncGoodsMenu" :min-price="$store.state.room.MinConsume || 0" ref="shopCart" @selectSpec="selectSpec" @needSpecDone="showSpecError" @increment="incrementTotal" @decrement="storeSelectFoodsLocal(selectFoods)" @remarkChange="selectRemark"></shopCart>
        <food :food.sync="selectedFood" ref="food" @selectSpec="selectSpec" @increment="incrementTotal" @decrement="storeSelectFoodsLocal(selectFoods)" @empty="emptyCart" @remarkChange="selectRemark"></food>
        <foodSpec v-if="showSpecs" :food.sync="selectedFood" :show="showSpecs" @hideSpecs="hideSpecs"></foodSpec>
        <specError :show="specError" @hide="hideSpecError"></specError>
        <foodRemark :show.sync="remarkShow" :food.sync="selectedFood"></foodRemark>
        <mt-popup
          :value="popupVisible"
          :closeOnClickModal="false"
          >
          <mt-picker :slots="slots" :visibleItemCount="5" :showToolbar="true" @change="onNumberPickerChange" ref="numberPicker">
            <div class="numberPickerBar">
              数量: {{totalPicker}}
              <mt-button type="primary" class="numberConfirm" @click="numberConfirm">确定</mt-button>
            </div>
          </mt-picker>
        </mt-popup>
      </div>
      <loading v-if="showLoading"></loading>
      <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import shopCart from '../components/shop-cart.vue'
  import shopHeader from '../components/shop-header.vue'
  import cartControl from '../components/cart-control.vue'
  import numControl from '../components/num-control.vue'
  import foodSpec from '../components/food-spec.vue'
  import foodRemark from '../components/food-remark.vue'
  import specError from '../components/spec-error.vue'
  import food from '../components/food.vue'
  // import data from '../common/json/data.json'
  import Util from '../libs/util.js'
  import {specDone, numberSequence} from '../common/js/tools.js'
  import alertTip from '@/components/common/alertTip'
  import loading from '@/components/common/loading'
  import wx from 'weixin-js-sdk'
  //  const ERR_OK = 0
  export default {
    name: 'Good',
    components: {
      shopCart,
      cartControl,
      shopHeader,
      food,
      specError,
      numControl,
      foodSpec,
      foodRemark,
      alertTip,
      loading
    },
    data () {
      return {
        showLoading: true, // 显示加载动画
        isFirstLogin: true, // 是否首次登录
        goods: [],
        seller: {},
        listHeight: [],
        scrolly: 0,
        selectedFood: {},
        // imgs: [],
        currentIndex: 0,
        menuSelect: 0,
        showSpecs: false,
        remarkShow: false,
        specError: false,
        maskShow: false,
        // popupVisible: false,
        totalPicker: 0,
        gotoPay: false,
        message: '',
        showAlert: false,
        alertText: null,
        shopID: 0,
        roomID: 0,
        slots: [
          {flex: 1, content: 'xx', values: numberSequence(10), className: 'tensPicker', textAlign: 'right', defaultIndex: 0},
          {flex: 1, content: 'yy', values: numberSequence(10), className: 'unitPicker', textAlign: 'left', defaultIndex: 0}
        ]
      }
    },
    created () {
      // 判断是否第一次登录，如果是第一次就取URL，否则就从store里取
      if (this.$store.state.shop.shopID && this.$store.state.room.roomID) {
        this.isFirstLogin = false
        this.shopID = this.$store.state.shop.shopID
        this.roomID = this.$store.state.room.roomID
      } else {
        this.isFirstLogin = true
        let paramUrl = this.$route.query.shopID
        let params = paramUrl.split('_')
        try {
          this.shopID = parseInt(params[0])
          // let roomParams = params[1].split('=')
          this.roomID = parseInt(params[1])
        } catch (error) {
          this.showAlert = true
          this.alertText = '请输入正确的URL参数！'
          return
        }
      }
      // this.initWX()
      this.getRoom()
      this.$store.commit('setRoom', {roomID: parseInt(this.roomID)})
      this.getShop()
      this.getData()
      this.getUserInfo()
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    mounted () {
      if (this.getMobileOperatingSystem() === 'iOS') {
        var startUrl = sessionStorage.getItem('ios-start-url')
        if (!startUrl) {
          sessionStorage.setItem('ios-start-url', window.location)
        }
      }
    },
    computed: {
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.GoodsCount) {
              foods.push(food)
            }
          })
        })
        return foods
      },
      popupVisible () {
        if (this.$store.state.numberPicker.show) {
          this.showPopUp()
        }
        return this.$store.state.numberPicker.show
      },
      numberPicker () {
        return this.$store.state.numberPicker
      }
    },
    methods: {
      imgs (id) {
        let url = `${this.$store.state.shop.IP}/imggoods/${id}.jpg`
        return url
      },
      setErrorImg (e) {
        e.target.src = 'http://nstart.cc:8686/uploads/shop/3.jpg'
      },
      numberConfirm () {
        this.goods = this.goods.map(g => {
          if (g.DisplayOrder === this.$store.state.numberPicker.food.DisplayOrder) {
            g.foods = g.foods.map(f => {
              f.GoodsCount = f.ID === this.$store.state.numberPicker.food.ID ? this.totalPicker : f.GoodsCount
              return f
            })
          }
          return g
        })
        this.totalPicker
        this.$store.commit('setNumberPicker', {food: null, show: false})
      },
      showPopUp () {
        this.getNumber()
      },
      closeTipFun () {
        this.showAlert = false
      },
      getRoom () {
        let self = this
        if (!self.$store.state.room.RoomName) {
          Util.ajax.get(`/shop/${self.shopID}/rooms`, {
            params: {
            }
          }).then(res => {
            const room = res.data.find(f => f.ID === parseInt(self.roomID))
            room.roomID = room.ID
            self.$store.commit('setRoom', room)
            self.$store.commit('setOriginalRoom', room)
          })
        }
      },
      getShop () {
        let self = this
        Util.ajax.get(`/shop/${this.shopID}`, {
          params: {
          }
        }).then(res => {
          self.seller = res.data
          document.title = self.seller.Name
          self.$store.commit('setShop', {shopID: parseInt(self.shopID), ...this.seller})
        })
      },
      getUserInfo () {
        let self = this
        let osType = self.getMobileOperatingSystem()
        if (!this.$store.state.userInfo || !self.$store.state.userInfo.openid) {
          Util.ajax.get(`/wepay/login/${self.$route.query.code}`, {
            params: {
              // force: true
            }
          }).then(res => {
            // Util.ajax.get('/wepay/userinfo').then(r => {
            //   self.message = r.data
            // })
            if (res.data.statusCode) {
              this.showAlert = true
              this.alertText = '未登录'
              return
            }
            res.data.osType = osType
            this.$store.commit('setUserInfo', res.data)
          })
        }
      },
      getNumber () {
        let tens = parseInt(this.$store.state.numberPicker.food.GoodsCount / 10)
        let unit = this.$store.state.numberPicker.food.GoodsCount % 10
        this.$refs.numberPicker.setSlotValue(0, tens)
        this.$refs.numberPicker.setSlotValue(1, unit)
      },
      onNumberPickerChange (picker, values) {
        this.totalPicker = values[0] * 10 + values[1] ? values[0] * 10 + values[1] : 0
      },
      storeSelectFoodsLocal (selectFoods) {
        localStorage.setItem('selectFoods', JSON.stringify(selectFoods))
      },
      emptyCart () {
      },
      getSelectFoodsLocal () {
        return JSON.parse(localStorage.getItem('selectFoods') || '[]')
      },
      specDone (food) {
        return specDone(food)
      },
      hideSpecs () {
        this.showSpecs = false
      },
      hideSpecError () {
        this.specError = false
      },
      computeIndex () {
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          let height = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrolly >= height && this.scrolly < height2)) {
            this.currentIndex = i
          }
        }
        this.scrollMenu(this.currentIndex)
      },
      syncGoodsMenu () {
        this.$store.commit('setGoodsMenu', this.goods)
      },
      getData () {
        if (this.$store.state.goodsMenu.length > 0) {
          this.goods = this.$store.state.goodsMenu
          // console.log(this.goods)
          // this.selectFoods = this.$store.state.cart.SubmitOrders
          // this._initScroll()
          // this._calculateHeight()
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
          // setTimeout(this.$nextTick(() => {
          // }), 300)
          this.showLoading = false
        } else {
          Util.ajax.get(`/room/${this.roomID}/goods/${this.shopID}`, {
            params: {
            }
          }).then(res => {
            this.showLoading = false
            let selectFoodsLocal = this.getSelectFoodsLocal()
            res.data = res.data.map(r => {
              if (r.IsPack) {
                r.GoodsDetails = r.GoodsDetails.map(rf => {
                  rf.GroupLimit = rf.GroupCount
                  return rf
                })
              }
              let local = selectFoodsLocal.find(s => s.ID === r.ID)
              if (this.$route.query.foodID) {
                r.GoodsCount = r.ID === parseInt(this.$route.query.foodID) ? 1 : 0
                // console.log('foodID', r.ID)
              } else {
                r.GoodsCount = local ? local.GoodsCount : r.GoodsCount
                r.GoodsDetails = local ? local.GoodsDetails : r.GoodsDetails
              }
              return r
            })
            let goodtypes = []
            let goodlist = new Set()
            res.data.forEach(g => {
              let gt = {}
              gt.DisplayOrder = g.DisplayOrder
              gt.GoodsTypeName = g.GoodsTypeName
              goodlist.add(JSON.stringify(gt))
            })
            goodlist.forEach(u => goodtypes.push(JSON.parse(u)))
            goodtypes = goodtypes.sort((cur, next) => {
              return cur.DisplayOrder - next.DisplayOrder
            })
            this.goods = goodtypes.map(gt => {
              let reformatGoods = {}
              reformatGoods.GoodsTypeName = gt.GoodsTypeName
              reformatGoods.DisplayOrder = gt.DisplayOrder
              reformatGoods.type = 1
              let curFoods = res.data.filter(r => r.DisplayOrder === reformatGoods.DisplayOrder)
              reformatGoods.foods = curFoods.map(c => {
                let reformatFood = {}
                reformatFood = c
                reformatFood.oldPrice = ''
                reformatFood.description = ''
                return reformatFood
              })
              return reformatGoods
            })
            this.$store.commit('setGoodsMenu', this.goods)
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
              if (this.$route.query.foodID) {
                this.gotoPay = true
              }
            })
          })
        }
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodScroll = new BScroll(this.$refs.foodWrapper, {
          probeType: 3,
          click: true
        })
        this.foodScroll.on('scroll', (pos) => {
          this.scrolly = Math.abs(Math.round(pos.y))
          if (!this.menuSelect) {
            this.computeIndex()
          }
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu (index, event) {
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodScroll.scrollToElement(el)
        this.currentIndex = index
        this.menuSelect = index
        setTimeout(() => { this.menuSelect = null }, 300)
      },
      showSpecError () {
        this.specError = true
      },
      scrollMenu (index) {
        let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item')
        let menu = menuList[index]
        this.menuScroll.scrollToElement(menu)
      },
      selectFood (food, event) {
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return
        }
        this.selectedFood = food
        this.selectedFood.images = [this.imgs(this.selectedFood.ID), this.imgs(this.selectedFood.ID), this.imgs(this.selectedFood.ID)]
        this.$refs.food.show()
      },
      selectSpec (food) {
        this.selectedFood = food
        this.showSpecs = true
      },
      selectRemark (food) {
        this.selectedFood = food
        this.remarkShow = true
      },
      profile () {
        // alert('profile')
      },
      incrementTotal (target) {
        this.$refs.shopCart.drop(target)
        this.storeSelectFoodsLocal(this.selectFoods)
      },
      /**
       * Determine the mobile operating system.
       * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
       *
       * @returns {String}
       */
      getMobileOperatingSystem () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
          return 'Windows Phone'
        }
        if (/android/i.test(userAgent)) {
          return 'Android'
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return 'iOS'
        }
        return 'unknown'
      },
      initWX () {
      },
      getAccessToken () {
        let self = this
        return new Promise(function (resolve, reject) {
          let accessToken = self.$store.state.accessToken
          if (!accessToken) {
            Util.ajax.get('/wepay/webAccessToken').then(res => {
              self.$store.commit('setAccessToken', res.data)
              resolve(res.data.access_token)
            })
          } else {
            resolve(accessToken)
          }
        })
      },
      btnScanQRCode () {
        let self = this
        // let newUrl = 'http://www.starstech.cc/index?shopID=1&roomID=151'
        // this.setNewRoom(newUrl)
        wx.error(function (res) {
          alert('出错了：' + res.errMsg)
          // 这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
        })

        wx.ready(function () {
          wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {

            }
          })
        })

        let url = ''
        if (this.getMobileOperatingSystem() === 'iOS') {
          var startUrl = sessionStorage.getItem('ios-start-url')
          if (!startUrl) {
            url = window.location
            sessionStorage.setItem('ios-start-url', url)
          } else {
            url = startUrl
          }
        } else {
          url = window.location.href.split('#')[0]
        }
        // alert(url)
        let encodeURL = window.encodeURIComponent(url)
        this.getAccessToken().then(accessToken => {
          Util.ajax.get(`/wepay/wxconfig/${accessToken}?source=${encodeURL}`).then(res2 => {
            let result = res2.data
            // let log = JSON.stringify(res2.data)
            // alert(log)
            wx.config({
              // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              debug: false,
              // 必填，公众号的唯一标识
              appId: result.appId,
              // 必填，生成签名的时间戳
              timestamp: '' + result.timestamp,
              // 必填，生成签名的随机串
              nonceStr: result.nonceStr,
              // 必填，签名，见附录1
              signature: result.signature,
              // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              jsApiList: ['checkJsApi', 'scanQRCode']
            })

            // 点击按钮扫描二维码
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
              success: function (res) {
                var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                alert(result) // for test
                // result = 'http://www.starstech.cc/index?shopID=1&roomID=151'
                self.setNewRoom(result)
              }
            })
          }).catch(err => {
            if (err) {
              alert(err.message)
            }
          })
        })
      },
      setNewRoom (newUrl) {
        // eg: http://www.starstech.cc/index?shopID=1&roomID=1
        let self = this
        // Validate url
        if (newUrl.indexOf('index') > -1 &&
          newUrl.indexOf('shopID=') > -1 &&
          newUrl.indexOf('roomID=') > -1) {
          let newRoomId = -1
          try {
            newRoomId = parseInt(newUrl.split('&')[1].split('=')[1])
          } catch (e) {
            self.showAlert = true
            self.alertText = '该二维码无效'
          }
          if (newRoomId > -1) {
            Util.ajax.get(`/shop/${self.$store.state.shop.shopID}/rooms`).then(res => {
              const room = res.data.find(f => f.ID === newRoomId)
              room.roomID = room.ID
              if (self.isEnabledRoom(room)) {
                self.$store.commit('setRoom', room)
                self.$router.push(`/goods?shopID=${self.$store.state.shop.shopID}_${newRoomId}`)
              } else {
                self.showAlert = true
                self.alertText = '该房台是后结账，不能切换！'
              }
            })
          }
        } else {
          self.showAlert = true
          self.alertText = '该二维码无效'
        }
      },
      isEnabledRoom (room) {
        if (room.ID === this.$store.state.orginalRoom.roomID) {
          return true
        }
        if ((room.RoomStateName === '开房' || room.RoomStateName === '消费') &&
          room.RoomCheckOutMode === 1) {
          return true
        }
        return false
      }
    }
  }
</script>
<style lang="scss">
@import "../common/scss/mixin.scss";
@import '../../style.scss';
.good {
  display: flex;
  position: absolute;
  width: 100%;
  top: 112px;
  bottom: 46px;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;
    .menu-item {
      display: table;
      width: 56px;
      height: 54px;
      line-height: 14px;
      padding: 0 12px;
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;
      }
      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: top;
        margin-right: 4px;
        background-size: 12px 12px;
        background-repeat: no-repeat;
      }
      .text {
        @include border-1px(rgba(7,17,27,0.1));
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        font-size: 12px;
      }
    }
  }
  .foods-wrapper {
    .specButton {
      border: 1px solid $primary-color;
      align-items: center;
      text-align: center;
      border-radius: 12px;
      color: $primary-color;
    }
    .spec-ok {
      display: inline-block;
      padding: 0 2px 0 0;
      line-height: 20px;
      font-size: 20px;
      vertical-align: top;
      color: $success-color;
    }
    .spec-need {
      display: inline-block;
      padding: 0 2px 0 0;
      line-height: 20px;
      font-size: 20px;
      vertical-align: top;
      color: $accent-color;
    }
    flex: 1;
    .food-list {
      .title {
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: #93999f;
        background: darken(#f3f5f7, 5%);
      }
      .food-item {
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7,17,27,0.1));
        &:last-child {
          margin-bottom: 0px;
        }
        .icon {
          height: 57px;
          width: 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          .name {
            margin: 2px 0 8px 0;
            font-size: 14px;
            line-height: 14px;
            height: 14px;
            color: #07111b;
          }
          .desc, .extra {
            font-size: 10px;
            line-height: 10px;
            color: #93999f;
          }
          .desc {
            margin-bottom: 8px;
            line-height: 12px;
          }
          .extra .count {
            margin-right: 12px;
          }
          .price {
            font-weight: 700px;
            line-height: 24px;
            .now {
              margin-right: 8px;
              font-size: 14px;
              color: #f01414;
            }
            .old {
              font-size: 10px;
              color: #93999f;
              text-decoration: line-through;
            }
          }
          .cartControl-wrapper {
            position: absolute;
            right: 0;
            width: 80px;
            bottom: 12px;
          }
        }
      }
    }
  }
  .siderBottom {
    width: 100%;
  }
}
.profile {
  position: fixed;
  top: 20px;
  right: 20px;
  height: 40px;
  width: 40px;
  background-color: #5e625f;  
  opacity: 0.6;
  border-radius: 50%; 
  text-align: center;
  z-index: 100;
}
.iconfont{
  display: block;
  line-height: 40px;
  font-size: 20px;
  color: #ffffff;  
}
.scanQR {
  position: fixed;
  top: 20px;
  right: 70px;
  height: 40px;
  width: 40px;
  background-color: #5e625f;  
  opacity: 0.6;
  border-radius: 50%; 
  display: none;
  text-align: center;
  z-index: 100;
}
.unitPicker {
  width: 200px;
}
.tensPicker {
  width: 200px;
}

.numberPickerBar {
  width: 100%;
  font-size: 20px;
  text-align: center;
  height: auto;
}
.numberConfirm {
  position: absolute;
  bottom: 0;
  left:0;
  margin-bottom: -40px;
  width: 100%;
}
</style>
