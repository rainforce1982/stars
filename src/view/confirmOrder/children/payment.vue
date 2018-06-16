 <template>
    <div class="rating_page">
        <head-top head-title="在线支付" go-back='true'></head-top>
        <section class="show_time_amount">
        	<section>
                <header class="time_last">支付剩余时间</header>
                <p class="time">{{remaining}}</p>
                <footer class="order_detail">
                    <span>支付费用：</span>
                    <span>¥ {{ totalCount && totalCount.toFixed(2)}}</span>
                </footer>   
            </section>
        </section>
        <div class="pay_way">选择支付方式</div>
        <section class="pay_way_list">
            <p style="word-wrap:break-word; word-break:normal;">{{errorMsg}}</p>
            <section class="pay_item" v-for="(paytype, index) in payTypes" :key="index" @click="chooseType(paytype.code)">
                <div class="pay_icon_container">
                    <div v-if="paytype.code===0" class="weixin">
                    </div>
                    <div v-if="paytype.code===1">
                      <i class="ion-qr-scanner iconfont weixinqr"></i>
                    </div>
                    <span>{{paytype.name}}</span>
                </div>
                <i v-if="paytype.code===curPayTypeCode" class="ion-checkmark-circled choosed_way" style="font-size: 24px;"></i>
                <i v-else class="ion-checkmark-circled choose_icon" style="font-size: 24px;"></i>
            </section>
        </section>
        <p class="disabled-pay" v-if='isDisabled'>确认支付</p>
        <p class="determine" @click="confrimPay" v-else>确认支付</p>
        <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import {mapState, mapMutations} from 'vuex'
    import Util from '@/libs/util.js'
    import alertTip from '@/components/common/alertTip'
    import wx from 'weixin-js-sdk'
    // import {payRequest} from 'src/service/getData'
    // import alertTip from 'src/components/common/alertTip'

    export default {
      data () {
        return {
          showAlert: false,
          alertText: null,
          payWay: 1, // 付款方式
          countNum: 3600, // 倒计时60分钟
          gotoOrders: false, // 去付款
          errorMsg: '',
          isDisabled: false,
          curPayTypeCode: 0,
          payTypes: [
            {name: '微信支付', code: 0},
            {name: '微信扫码支付', code: 1}
          ]
        }
      },
      components: {
        headTop,
        alertTip
      },
      created () {
        this.initData()
      },
      mounted () {
        this.remainingTime()
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
          }).catch(err => {
            if (err) {
              alert(err.message)
            }
          })
        })
      },
      beforeDestroy () {
        clearInterval(this.timer)
      },
      props: [],
      computed: {
        ...mapState([
          'cart', 'orderMessage', 'userInfo', 'shopid', 'cartPrice'
        ]),
        totalCount: function () {
          let count = 0
          if (this.cart.SubmitOrders) {
            this.cart.SubmitOrders.forEach((food) => {
              count += food.Price * food.GoodsCount * 100
            })
          }
          count = count / 100
          return count
        },
        // 时间转换
        remaining: function () {
          let minute = parseInt(this.countNum / 60)
          if (minute < 10) {
            minute = '0' + minute
          }
          let second = parseInt(this.countNum % 60)
          if (second < 10) {
            second = '0' + second
          }
          return '00 : ' + minute + ' : ' + second
        }
      },
      methods: {
        ...mapMutations([
          'CONFIRM_INVOICE', 'CLEAR_CART', 'CONFIRM_REMARK'
        ]),
        // 初始化信息
        initData () {
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
        btnScanQRCode () {
          let self = this
          // 点击按钮扫描二维码
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
              // alert(result) // for test
              // result = 'http://www.starstech.cc/index?shopID=1&roomID=151'
              self.submitMicropay(result)
            }
          })
        },
        chooseType (typeCode) {
          this.curPayTypeCode = typeCode
        },
        // 倒计时
        remainingTime () {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.countNum --
            if (this.countNum === 0) {
              clearInterval(this.timer)
              this.showAlert = true
              this.alertText = '支付超时'
            }
          }, 1000)
        },
        // 确认付款
        confrimPay () {
          let self = this
          if (this.curPayTypeCode === 1) {
            this.btnScanQRCode()
          } else if (this.curPayTypeCode === 0) {
            self.isDisabled = true
            if (typeof window.WeixinJSBridge === 'undefined') {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
              }
              // this.showAlert = true
              // this.alertText = '请用微信浏览页面'
            } else {
              this.onBridgeReady()
            }
          }
        },
        // 关闭提示框，跳转到订单列表页
        closeTipFun () {
          this.showAlert = false
        },
        clearCart () {
          let self = this
          let emptyCart = {}
          self.$store.commit('setCart', emptyCart)

          let goodsMenu = [...self.$store.state.goodsMenu]
          goodsMenu.forEach(x => {
            x.GoodsCount = 0
            x.foods.forEach(y => {
              y.GoodsCount = 0
              y.GoodsRemarks.forEach(z => {
                z.RemarkCount = 0
              })
            })
          })
          self.$store.commit('setGoodsMenu', goodsMenu)
          localStorage.setItem('selectFoods', [])

          self.CONFIRM_REMARK({remarkText: {}, inputText: ''})
        },
        submitMicropay (authCode) {
          const self = this
          Util.ajax.post(`/wepay/micropay?cartId=${this.$route.query.cartId}&auth_code=${authCode}`).then(res => {
            if (res.status === 200) {
              let data = res.data
              let returnCode = data['return_code']
              let resultCcode = data['result_code']
              if (returnCode === 'SUCCESS' && resultCcode === 'SUCCESS') {
                self.clearCart()
                self.goToSuccessPage(self.$route.query.cartId)
              } else if (resultCcode === 'FAIL') {
                alert(data['err_code_des'])
              } else {
                alert('未知错误')
                self.clearCart()
                self.goToSuccessPage(this.$route.query.cartId)
              }
            }
          })
        },
        restoreCart () {
          let openid = this.$store.getters.getOpenId
          Util.ajax.post(`/wepay/restore?cartId=${this.$route.query.cartId}&openid=${openid}`).then(res => {
          })
        },
        goToSuccessPage (cartId) {
          this.$router.push(`/confirmOrder/paySuccess?cartId=${cartId}`)
        },
        onBridgeReady () {
          let self = this
          if (typeof window.WeixinJSBridge === 'undefined') {
            self.showAlert = true
            self.alertText = '请用微信浏览页面'
            return
          }
          let openid = this.$store.getters.getOpenId
          Util.ajax.post(`/wepay/prepay?cartId=${self.$route.query.cartId}&openid=${openid}`).then(res => {
            // self.errorMsg = JSON.stringify(res.data)
            if (res.status === 200) {
              if (res.data.hasOwnProperty('msg') && res.data.msg === 'SUCCESS') {
                var prepayId = res.data
                window.WeixinJSBridge.invoke('getBrandWCPayRequest', prepayId, function (response) {
                  // self.errorMsg += JSON.stringify(response)
                  if (response.err_msg === 'get_brand_wcpay_request:ok') {
                    // 显示支付成功
                    // 清除购物车
                    self.clearCart()
                    // 跳转到支付成功的页面
                    self.goToSuccessPage(self.$route.query.cartId)
                  } else {
                    self.restoreCart()
                    self.isDisabled = false
                    if (response.err_msg === 'get_brand_wcpay_request:cancel') {
                    // 取消支付 call 后台API 改变status的值
                    } else if (response.err_msg === 'get_brand_wcpay_request:fail') {
                      // 失败的话，显示失败的信息
                      // 1 输错密码 2 网络问题 等
                    } else {
                      // 未知错误 显示message
                      self.showAlert = true
                      self.alertText = response.errMsg
                    }
                  }
                })
              }
            } else if (res.data.statusCode === 40001) {
              self.showAlert = true
              self.alertText = res.messsage
            }
          })
        }
      }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    $rem: 23.4375px;

    .rating_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        padding-top: 1.95 * $rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .show_time_amount{
		background-color: #fff;
        padding: .7 * $rem;
        text-align: center;
        .time_last{
            @include sc(.6 * $rem, #666);
            margin-top: 1 * $rem;
        }
        .time{
            @include sc(1.5 * $rem, #333);
            margin: .3 * $rem 0 1 * $rem;
        }
        .order_detail{
            span{
                @include sc(.65 * $rem, #666);
            }
            span:nth-of-type(2){
                color: #ff6000;
                font-weight: bold;
            }
        }
    }
    .pay_way{
        background-color: #f1f1f1;
        padding: 0 .7 * $rem;
        @include sc(.7 * $rem, #666);
        line-height: 1.8 * $rem;
    }
    .pay_way_list{
        background-color: #fff;
        .pay_item{
            padding: .4 * $rem .7 * $rem;
            @include fj;
            align-items: center;
            line-height: 2.6 * $rem;
            border-bottom: 0.025 * $rem solid #f5f5f5;
            .pay_icon_container{
                @include fj;
                align-items: center;
                .weixin{
                    @include wh(1 * $rem, 1 * $rem);
                    background: url(../../../images/wepay.jpg) no-repeat;
                    background-size: 100% 100%;
                    margin-right: .2 * $rem;
                }
                .iconfont{
                  &.weixinqr{
                    margin-right: .2 * $rem;
                    font-size: 24px;
                    color:#4cd964;
                  }
                }
                span{
                    @include sc(.7 * $rem, #666);
                }
            }
            // i{
            //     @include wh(2 * $rem, 2 * $rem);
            //     margin-right: .3 * $rem;
            //     color: #4cd964;
            // }
            .choose_icon{
                // @include wh(1 * $rem, 1 * $rem);
                // margin-right: .3 * $rem;
                color: #ccc;
            }
            .choosed_way{
                color: #4cd964;
            }
        }
    }
    .determine{
        background-color: #4cd964;
        @include sc(.7 * $rem, #fff);
        text-align: center;
        margin: 0 .7 * $rem;
        line-height: 1.8 * $rem;
        border-radius: 0.2 * $rem;
        margin-top: 0.5 * $rem;
        font-weight: bold;
    }
    .disabled-pay{
        background-color: #fff;
        @include sc(.7 * $rem, #666);
        text-align: center;
        margin: 0 .7 * $rem;
        line-height: 1.8 * $rem;
        border-radius: 0.2 * $rem;
        margin-top: 0.5 * $rem;
        font-weight: bold;
    }
</style>
