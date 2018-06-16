<template>
    <div class="confirmOrderContainer">
        <section v-if="!showLoading">
            <head-top head-title="确认订单" goBack="true" signin-up='confirmOrder'></head-top>
            <section class="pay_way container_style">
                <header class="header_style">
                    <span>支付方式</span>
                    <div class="more_type" @click="showPayWayFun">
                        <span>{{payWayName}}</span>
                        <svg class="address_empty_right">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </div>
                </header>
            </section>
            <section class="food_list">
                <header>
                    <span>订单详情 - <b>{{$store.state.room.RoomName || ''}}</b> </span>
                </header>
                <ul class="food_list_ul" >
                    <li v-for="item in shopCart.SubmitOrders" :key="item.ID">
                        <div class="row food_item_style">
                            <div @click="collapseFoodDetail(item)" class="col col-60 food_name">
                                <span v-if="item.IsPack">
                                    <i class="ion-chevron-down" v-if="item.isCollapse"></i>
                                    <i class="ion-chevron-right" v-else></i>
                                </span>
                                <span v-else>&nbsp;&nbsp;</span>
                                <span>{{item.GoodsName}}</span>
                            </div>
                            <div class="col col-20 num_price">
                                <span>x {{item.GoodsCount}}</span>
                            </div>
                            <div class="col col-20 num_price">
                                <span>¥{{item.Price}}</span>
                            </div>
                        </div>
                        <div v-show="item.isCollapse">
                            <div v-for="group in item.groupNameList" :key="group">
                                <span class="detail_group">{{group}}</span>
                                <div v-for="detail in item.GoodsDetails" :key="detail.ID">
                                    <div v-if="group === detail.GroupName">
                                        <div class="row food_detail_style" v-if="detail.GoodsDetailCount > 0">
                                            <div class="col col-60 food_detail">
                                                <span>{{detail.GoodsName}}</span>
                                            </div>
                                            <div class="col col-40 num_price">
                                                <span>x {{detail.GoodsDetailCount}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-show="item.isCollapseRemark">
                            <div v-for="(remark, index) in item.GoodsRemarks" :key="index">
                                <div class="row food_detail_style" v-if="remark.RemarkCount > 0">
                                    <div class="col col-60 food_detail">
                                        <span>{{remark.RemarkName}}</span>
                                    </div>
                                    <div class="col col-40 num_price">
                                        <span>x {{remark.RemarkCount}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="row food_item_style total_price">
                    <p class="col col-60 food_name ellipsis">订单 ¥{{totalCount}}</p>
                    <div class="col col-20 num_price">
                        <span>待支付</span>
                    </div>
                    <div class="col col-20 num_price">
                      <span>¥{{totalCount}}</span>
                    </div>
                </div>
            </section>
            <section class="pay_way container_style" v-if="totalCount > 0">
                <router-link :to='{path: "/confirmOrder/remark", query: {id: shopCart.shopId, sig: shopCart.sig}}' class="header_style">
                    <span>订单备注</span>
                    <div class="more_type">
                        <span class="ellipsis">{{remarkText||inputText? remarklist: '口味、偏好等'}}</span>
                        <i class="ion-chevron-right"></i>
                    </div>
                </router-link>
            </section>
            <section class="confrim_order">
                <p>待支付 ¥{{totalCount}}</p>
                <p @click="confrimOrder" v-if="totalCount > 0">确认下单</p>
                <p class="disabled-button" v-else>确认下单</p>
            </section>
            <transition name="fade">
                <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
            </transition>
            <transition name="slid_up">
                <div class="choose_type_Container" v-if="showPayWay">
                    <header>支付方式</header>
                    <ul>
                        <li v-for="item in payments" :key="item.id" :class="{choose: payWayId == item.id, unchoose: payWayId != item.id}">
                            <div class="row" @click="choosePayWay(item.id)">
                              <span class="col col-75">
                                {{item.name}}<span v-if="!item.isOnlinePayment">{{item.description}}</span>
                              </span>
                              <div class="col col-25">
                                <i class="ion-checkmark-circled"></i>
                              </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </transition>
        </section>
        <loading v-if="showLoading"></loading>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'
    import loading from '@/components/common/loading'
    import Util from '@/libs/util.js'
    import {uid} from '@/common/js/tools.js'

    export default {
      data () {
        return {
          geohash: '', // geohash位置信息
          shopId: null, // 商店id值
          showLoading: true, // 显示加载动画
          checkoutData: null, // 数据返回值
          shopCart: null, // 购物车数据
          showPayWay: false, // 显示付款方式
          payWayId: 2, // 付款方式
          showAlert: false, // 弹出框
          alertText: null, // 弹出框内容
          payments: [{
            id: 1,
            name: '现金支付',
            isOnlinePayment: false,
            description: ''
          },
          {
            id: 2,
            name: '在线支付',
            isOnlinePayment: true,
            description: ''
          }]
        }
      },
      created () {
        // 获取上个页面传递过来的geohash值
        this.geohash = this.$route.query.geohash
        // 获取上个页面传递过来的shopid值
        this.shopId = this.$route.query.shopId
        // this.INIT_BUYCART()
        // this.SAVE_SHOPID(this.shopId)
        // 获取当前商铺购物车信息
        this.shopCart = this.cart
      },
      mounted () {
        this.initData()
      },
      components: {
        headTop,
        alertTip,
        loading
      },
      computed: {
        ...mapState([
          'cart', 'remarkText', 'inputText', 'invoice', 'choosedAddress', 'userInfo'
        ]),
        // 备注页返回的信息进行处理
        remarklist: function () {
          let str = ''
          if (this.remarkText) {
            for (let key in this.remarkText) {
              let item = this.remarkText[key]
              str += item[1] + '，'
            }
          }
          // 是否有自定义备注，分开处理
          if (this.inputText) {
            return str + this.inputText
          } else {
            return str.substr(0, str.lastIndexOf('，'))
          }
        },
        totalCount: function () {
          let count = 0
          if (this.shopCart.SubmitOrders) {
            this.shopCart.SubmitOrders.forEach((food) => {
              count += food.Price * food.GoodsCount * 100
            })
          }
          count = count / 100
          return count
        },
        payWayName: function () {
          let item = this.payments.find(x => x.id === this.payWayId)
          return item.name
        }
      },
      methods: {
        ...mapMutations([
          'INIT_BUYCART', 'SAVE_GEOHASH', 'CHOOSE_ADDRESS', 'NEED_VALIDATION', 'SAVE_CART_ID_SIG', 'SAVE_ORDER_PARAM', 'ORDER_SUCCESS', 'SAVE_SHOPID', 'CONFIRM_REMARK'
        ]),
        // 初始化数据
        initData () {
          this.showLoading = false
          if (this.shopCart && this.shopCart.SubmitOrders) {
            this.shopCart.SubmitOrders.forEach((item) => {
              if (item.IsPack === true) {
                item.isCollapse = true
              }
              if (item.GoodsRemarks && item.GoodsRemarks.length > 0) {
                item.isCollapseRemark = true
              }
              if (item.GoodsDetails) {
                let groupNameList = []
                item.GoodsDetails.forEach((detail) => {
                  if (groupNameList.indexOf(detail.GroupName) < 0) {
                    groupNameList.push(detail.GroupName)
                  }
                })
                item.groupNameList = groupNameList
              }
            })
          }
        },
        // 显示付款方式
        showPayWayFun () {
          // 等以后处理线下支付
          // this.showPayWay = !this.showPayWay
        },
        // 选择付款方式
        choosePayWay (id) {
          this.payWayId = id
        },
        // 地址备注颜色
        iconColor (name) {
          switch (name) {
            case '公司': return '#4cd964'
            case '学校': return '#3190e8'
          }
        },
        collapseFoodDetail (item) {
          item.isCollapse = !item.isCollapse
          this.shopCart.SubmitOrders = this.shopCart.SubmitOrders.map(r => r)
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
        // 确认订单
        confrimOrder () {
          let self = this
          // 用户未登录时弹出提示框
          self.shopCart.OrderRemark = self.remarklist
          let cartId = uid()
          self.shopCart.CartID = cartId
          self.shopCart.ShopID = self.$store.state.shop.shopID
          self.shopCart.RoomCheckOutMode = self.$store.state.room.RoomCheckOutMode
          let openid = self.$store.getters.getOpenId
          Util.ajax.post(`/order/prepay?shopId=${self.$store.state.shop.shopID}&openid=${openid}`, self.shopCart
          ).then(res => {
            if (res.data.statusCode === 40001) {
              self.showAlert = true
              self.alertText = '请先登录'
              return
            }
            // 判断房间是先结账还是后结
            if (self.$store.state.room.RoomCheckOutMode === 0) {
              // 后结账，清理购物车
              self.clearCart()
              self.$router.push(`/confirmOrder/orderSuccess`)
            } else {
              self.$router.push(`/confirmOrder/payment?cartId=${cartId}`)
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    $rem: 23.4375px;
    .confirmOrderContainer{
        padding-top: 1.95 * $rem;
        margin-bottom: 1.95 * $rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .container_style{
        background-color: #fff;
        margin-top: .4 * $rem;
        padding: 0 .7 * $rem;
    }
    .ellipsis{
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis;/*文字隐藏后添加省略号*/
        white-space: nowrap;/*强制不换行*/
        width: 20em;/*不允许出现半汉字截断*/
    }
    .address_container{
        min-height: 3.5 * $rem;
        @include fj;
        align-items: center;
        padding: 0 0.6 * $rem;
      //  background: url(../../images/address_bottom.png) left bottom repeat-x;
        background-color: #fff;
        background-size: auto .12 * $rem;
        .address_empty_left{
            display: flex;
            align-items: center;
            .location_icon{
                @include wh(.8 * $rem, .8 * $rem);
                fill: $blue;
                margin-right: .2 * $rem;
            }
            .add_address{
                @include sc(.7 * $rem, #333);
            }
            .address_detail_container{
                margin-left: .2 * $rem;
                header{
                    @include sc(.65 * $rem, #333);
                    span:nth-of-type(1){
                        font-size: .8 * $rem;
                        font-weight: bold;
                    }
                }
                .address_detail{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    span{
                        @include sc(.5 * $rem, #fff);
                        border-radius: .15 * $rem;
                        background-color: #ff5722;
                        height: .6 * $rem;
                        line-height: .6 * $rem;
                        padding: 0 .2 * $rem;
                        margin-right: .3 * $rem;
                    }
                    p{
                        @include sc(.55 * $rem, #777);
                    }
                }
            }
        }
    }
    .address_empty_right{
        @include wh(.6 * $rem, .6 * $rem);
        fill: #999;
    }
    .delivery_model{
        border-left: .2 * $rem solid $blue;
        min-height: 4 * $rem;
        @include fj;
        align-items: center;
        .deliver_text{
            @include sc(.8 * $rem, #333);
            font-weight: bold;
            padding-left: .3 * $rem;
        }
        .deliver_time{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            p:nth-of-type(1){
                @include sc(.7 * $rem, $blue);
            }
            p:nth-of-type(2){
                @include sc(.5 * $rem, #fff);
                background-color: $blue;
                width: 2.4 * $rem;
                margin-top: .5 * $rem;
                text-align: center;
                border-radius: 0.12 * $rem;
                padding: .1 * $rem;
            }
        }
    }
    .pay_way{
        .header_style{
            @include fj;
            line-height: 2 * $rem;
            span:nth-of-type(1){
                @include sc(.7 * $rem, #666);
            }
            .more_type{
                span:nth-of-type(1){
                    @include sc(.6 * $rem, #aaa);
                    width: 10 * $rem;
                    display: inline-block;
                    text-align: right;
                    vertical-align: middle;
                }
                svg{
                    @include wh(.5 * $rem, .5 * $rem);
                    fill: #ccc;
                }
                i{
                    @include wh(.5 * $rem, .5 * $rem);
                    color: #ccc;
                }
            }
        }
        .hongbo{
            @include fj;
            border-top: 0.025 * $rem solid #f5f5f5;
            span{
                @include sc(.6 * $rem, #aaa);
                line-height: 2 * $rem;
                svg{
                    @include wh(.5 * $rem, .5 * $rem);
                    vertical-align: middle;
                    fill: #ccc;
                }
            }
            span:nth-of-type(2){
                color: #aaa;
            }
        }
        .support_is_available{
            span{
                color: #666;
            }
        }
    }
    .food_list{
        background-color: #fff;
        margin-top: .4 * $rem;
        header{
            padding: .7 * $rem;
            border-bottom: 0.025 * $rem solid #f5f5f5;
            img{
                @include wh(1.2 * $rem, 1.2 * $rem);
                vertical-align: middle;
            }
            span{
                @include sc(.8 * $rem, #333);
                b{
                    font-weight: 800;
                }
            }
        }
        .food_list_ul{
            padding-top: .5 * $rem;
        }
        .food_item_style{
            @include fj;
            line-height: 1.8 * $rem;
            padding: 0 .7 * $rem;
            span,p{
                @include sc(.65 * $rem, #666);
            }
            .food_name{
                width: 10 * $rem;
            }
            .food_detail{
                padding-left: .65 * $rem;
            }
            .num_price{
                flex: 1;
                @include fj;
                align-items: center;
                span:nth-of-type(1){
                    color: #f60;
                }
            }
        }
        .food_detail_style{
            @include fj;
            line-height: 1 * $rem;
            padding: 0 .7 * $rem;
            span,p{
                @include sc(.6 * $rem, #aaa);
            }
            .food_name{
                width: 10 * $rem;
            }
            .food_detail{
                padding-left: 1.5 * $rem;
            }
            .num_price{
                flex: 1;
                @include fj;
                align-items: center;
                span:nth-of-type(1){
                    color: #aaa;
                }
            }
        }
        .detail_group{
            padding: 1.45 * $rem;
            line-height: 1 * $rem;
            @include sc(.6 * $rem, #aaa);
            font-weight: bold;
        }
        .total_price{
            border-top: 0.025 * $rem solid #f5f5f5;
        }
    }
    .confrim_order{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2 * $rem;
        p{
            line-height: 2 * $rem;
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
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0,0,0,.3);
        z-index: 203;
    }
    .choose_type_Container{
        min-height: 10 * $rem;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 204;
        header{
            background-color: #fafafa;
            @include sc(.7 * $rem, #333);
            text-align: center;
            line-height: 2 * $rem;
        }
        ul{
            li{
                @include fj;
                padding: 0 .7 * $rem;
                line-height: 2.5 * $rem;
                align-items: center;
                span{
                    @include sc(.7 * $rem, #ccc);
                }
                svg{
                    @include wh(.8 * $rem, .8 * $rem);
                    fill: #eee;
                }
            }
            .choose{
                span{
                    color: #333;
                }
                div{
                    i{
                        color: #4cd964;
                    }
                }
            }
            .unchoose{
                span{
                    color: #ccc;
                }
                div{
                    i{
                        color: #ccc;
                    }
                }
            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .slid_up-enter-active, .slid_up-leave-active {
        transition: all .3s;
    }
    .slid_up-enter, .slid_up-leave-active {
        transform: translate3d(0,10 * $rem,0)
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2 * $rem, 0, 0);
        opacity: 0;
    }
    a, article, aside, b, body, button, dd, div, dl, dt, figcaption, figure, footer, h1, h2, h3, h4, h5, h6, header, i, input, li, nav, p, section, select, span, textarea, ul {
        padding: 0;
        margin: 0;
        list-style: none;
        font-style: normal;
        text-decoration: none;
        border: none;
        color: #333;
        font-weight: 400;
        box-sizing: border-box;
        font-family: Microsoft Yahei;        
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
    }
</style>
