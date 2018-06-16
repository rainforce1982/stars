<template>
  <div v-if="roomAreas">
    <head-top head-title="选择房台" goBack="true" signin-up='room'></head-top>
    <section class="scan" @click="btnScanQRCode()">
      <i class="ion-qr-scanner"></i>
      <span>扫一扫</span>
    </section>
    <div class="room">
      <div class="roomArea-wrapper">
        <ul>
          <li v-for="(item, index) in roomAreas" class="menu-item border-1px" :class="{'current':currentIndex === index}" @click="selectRoomArea(index, $event)">
            <span class="text">
              {{item.RoomAreaName}}
            </span>
          </li>
        </ul>
      </div>
      <div class="room-wrapper" ref="roomWrapper">
        <div style="background-image: linear-gradient(to bottom, #666666, #006666);">
          <h1 class="title">{{roomAreas[currentIndex].RoomAreaName}}</h1>
          <div class="room-order">
            <div v-for="(item, index) in roomAreas[currentIndex].rooms">
              <mt-button plain class=" css_btn_class" @click="chooseRoom(index)">{{item.RoomName}}</mt-button>
            </div>
          </div>
          <div class="room-bottom">
          </div>
        </div>
        <!-- <div class="background">
          <img :src="seller.Cover" alt="" class="" width="100%" height="100%">
        </div> -->
      </div>
    </div>

    <!-- <section class="confrim_order">
        <p v-if="roomIndex > -1">已选中 {{roomAreas[currentIndex].rooms[roomIndex].RoomName}}</p>
        <p v-else>请选择</p>
        <p @click="chooseRoom">切换</p>
    </section> -->
      <loading v-if="showLoading"></loading>
      <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import headTop from '@/components/header/head'
  import Util from '@/libs/util.js'
  import alertTip from '@/components/common/alertTip'
  import loading from '@/components/common/loading'
  import wx from 'weixin-js-sdk'

  export default {
    name: 'Room',
    components: {
      headTop,
      alertTip,
      loading
    },
    data () {
      return {
        showLoading: false, // 显示加载动画
        roomAreas: undefined,
        scrolly: 0,
        currentIndex: 0,
        roomIndex: -1,
        showAlert: false,
        seller: null
      }
    },
    created () {
      // this.initWX()
      this.initData()
    },
    mounted () {
    },
    computed: {

    },
    methods: {
      selectRoomArea (index, event) {
        let self = this
        self.currentIndex = index
        self.roomIndex = -1
      },
      chooseRoom (index) {
        let self = this
        if (index === -1) {
          self.showAlert = true
          self.alertText = '请先选择房台'
          return false
        }
        const room = self.roomAreas[self.currentIndex].rooms[index]
        if (!room) {
          self.showAlert = true
          self.alertText = '请先选择房台'
          return false
        }
        room.roomID = room.ID
        self.$store.commit('setRoom', room)
        self.$router.push(`/goods?shopID=${self.$store.state.shop.shopID}_${self.$store.state.orginalRoom.roomID}`)
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
      btnScanQRCode () {
        let self = this
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
          url = window.location
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
                self.$router.push(`/goods?shopID=${self.$store.state.shop.shopID}_${self.$store.state.orginalRoom.roomID}`)
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
      initData () {
        let self = this
        self.seller = self.$store.state.shop
        Util.ajax.get(`/shop/${self.$store.state.shop.shopID}/rooms`).then(res => {
          if (res.data) {
            self.roomAreas = []
            res.data.forEach(item => {
              let roomArea = self.roomAreas.find(f => f.RoomAreaId === item.RoomAreaId)
              if (roomArea) {
                if (self.isEnabledRoom(item)) {
                  roomArea.rooms.push(item)
                }
              } else {
                roomArea = {}
                roomArea.RoomAreaId = item.RoomAreaId
                roomArea.RoomAreaName = item.RoomAreaName
                roomArea.rooms = []
                if (self.isEnabledRoom(item)) {
                  roomArea.rooms.push(item)
                  self.roomAreas.push(roomArea)
                }
              }
            })
          }
        })
      },
      closeTipFun () {
        this.showAlert = false
      }
    }
  }
</script>
<style lang="scss">
@import "src/common/scss/mixin.scss";
@import 'src/style/mixin';
@import '../../../style.scss';
$rem: 23.4375px;
.room {
  display: flex;
  position: absolute;
  width: 100%;
  top: 55px;
  bottom: 0px;
  overflow: hidden;
  .roomArea-wrapper {
    flex: 0 0 80px;
    width: 60px;
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
        font-weight: 700;
        color: #26a2ff;
        border-bottom: 3px solid #26a2ff;
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
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .room-wrapper {
    flex: 1;
    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 14px;
      color: #93999f;
      background: darken(#f3f5f7, 5%);
    }
    li {
      height: 3.5 * $rem;
      flex: 1;
    }
    .room-order{
      display: flex;
      height: 23 * $rem;
      overflow: auto;
      flex-wrap: wrap;
      justify-content: center;
      bottom: 50px;
    }
    .room-bottom{
      height: 2 * $rem;
      line-height: 2 * $rem;
    }
  }
  .siderBottom {
    width: 100%;
  }
  .css_btn_class {
    height: 3.4 * $rem;
    width: 3.4 * $rem;
    border-radius: 1.7 * $rem;
    margin: 0.2 * $rem;
    color: white;
    border-color: white;
  }
}
.scan {
  position: absolute;
  top: 0;
  z-index: 101;
  color: white;
  right: 0.4 * $rem;
  
  line-height: 2.2 * $rem;
  margin-right: .1 * $rem;
  i{
    font-size: 0.9 * $rem;
  }
  span{
    @include sc(0.7 * $rem, #fff);
    text-align: center;
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
  .iconfont{
    display: block;
    line-height: 40px;
    font-size: 20px;
    color: #ffffff;  
  }   
}
.confrim_order{
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0px;
    z-index: 50;
    bottom: 0px;
    width: 100%;
    height: 2 * $rem;
    p{
        line-height: 2 * $rem;
        margin: 0;
        @include sc(.75 * $rem, #fff);
    }
    p:nth-of-type(1){
        background-color: #3c3c3c;
        flex: 5;
        padding-left: .7 * $rem;
    }
    p:nth-of-type(2){
        flex: 2;
        background-color: #56d176;
        text-align: center;
    }
    .disabled-button{
        flex: 2;
        text-align: center;
        background-color: #3c3c3c!important
    }
}
</style>
