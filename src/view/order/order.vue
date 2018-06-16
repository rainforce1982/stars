 <template>
    <div class="order_page">
        <head-top head-title="订单列表" go-back='true'></head-top>
        <mt-loadmore :top-method="loadTop" :top-status.sync="topStatus" :top-distance="distance" :auto-fill="autoFill" ref="loadmore">
          <div>
            <ul class="order_list_ul">
                <li class="order_list_li" v-for="item in orderList" :key="item.OrderID">
                  <!-- <img :src="item.shopCover" class="restaurant_image"> -->
                    <div class="restaurant_image" v-if="item.OrderGoods.length > 0">
                      <img :src="imgs(item.OrderGoods[0].GoodsID)" v-if="imgs(item.OrderGoods[0].GoodsID)"  @error="setErrorImg" alt="" width="57" height="57">
                    </div>
                    <section class="order_item_right">
                        <section @click="showDetail(item)">
                            <header class="order_item_right_header">
                                <section class="order_header">
                                    <span class="ellipsis">{{item.shopName}} </span>
                                    <p class="order_time">{{item.OrderTime}}</p>
                                </section>
                                <p class="order_status">  
                                    {{item.OrderStatusDescription}}
                                </p>
                            </header>
                            <section class="order_basket" v-if="item.OrderGoods.length > 0">
                                <p class="order_name ellipsis">{{item.OrderGoods[0].GoodsName}}{{item.OrderGoods.length > 1 ? ' 等' + item.OrderGoods.length + '件商品' : ''}}</p>
                                <p class="order_amount">¥{{item.totalAmount.toFixed(2)}}</p>
                            </section>
                        </section>
                        <div class="order_again">
                            <compute-time v-if="item.OrderStatus === 0" :time="item.passTime"></compute-time>
                            <router-link :to="{ path: '/goods?shopID=' + item.ShopID + '|roomID=' + orginalRoomId }" tag="span" class="buy_again" v-else>再来一单</router-link>
                        </div>
                    </section>
                </li>
            </ul>
          </div>
        </mt-loadmore>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
 
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from '@/components/header/head'
    import computeTime from '@/components/common/computeTime'
    import loading from '@/components/common/loading'
    import Util from '@/libs/util.js'
    import {ORDER_STATUS_ENUM} from '@/common/js/enum.js'

    export default {
      data () {
        return {
          orderList: [], // 订单列表
          offset: 0,
          preventRepeat: false, // 防止重复获取
          showLoading: true, // 显示加载动画
          allLoaded: false,
          distance: 100,
          topStatus: '',
          autoFill: false
        }
      },
      created () {
      },
      mounted () {
        this.initData()
      },
      components: {
        headTop,
        loading,
        computeTime
      },
      computed: {
        ...mapState([
          'userInfo', 'geohash'
        ])
      },
      methods: {
        ...mapMutations([
          'SAVE_ORDER'
        ]),
        // 初始化获取信息
        initData () {
          let self = this
          this.getServerData().then(function (data) {
            self.orderList = data
          })
          this.hideLoading()
        },
        imgs (id) {
          return `http://nstart.cc:8686/uploads/shop/${id}.jpg`
        },
        setErrorImg (e) {
          e.target.src = 'http://nstart.cc:8686/uploads/shop/3.jpg'
        },
        getServerData () {
          let self = this
          // /room/:roomId/orders?shopId=1
          let roomId = self.$store.state.room.roomID
          let shopId = self.$store.state.shop.shopID
          let openid = self.$store.getters.getOpenId
          return new Promise(function (resolve, reject) {
            let apiURL = `/orders?shopId=${shopId}`
            if (self.$store.state.room.RoomCheckOutMode === 1) {
              // 先结账
              apiURL += `&openid=${openid}`
            }
            Util.ajax.get(apiURL, {
              params: {
              }
            }).then(res => {
              res.data.forEach((item) => {
                item.shopName = ''
                item.shopCover = ''
                item.ShopID = shopId
                item.RoomID = roomId
                // 店铺信息
                self.getShop(item.ShopID).then(result => {
                  item.shopName = result.data.Name
                  item.shopCover = result.data.Cover
                })

                // 订单总价
                let totalAmount = 0
                item.OrderGoods.forEach((good) => {
                  totalAmount += good.Price * good.GoodsCount
                })
                item.totalAmount = totalAmount

                // 支付剩余时间
                if (item.OrderStatus === ORDER_STATUS_ENUM.NEED_PAY && item.OrderTime) {
                  let now = new Date()
                  let strTime = now.toDateString() + ' ' + item.OrderTime
                  console.log(strTime)
                  let updateDate = new Date(strTime)
                  let diffTime = now.getTime() - updateDate.getTime()
                  let seconds = Math.round(diffTime / 1000)
                  item.passTime = seconds
                }

                // 订单状态
                if (item.OrderStatus === ORDER_STATUS_ENUM.NEED_PAY) {
                  item.OrderStatusDescription = '待支付'
                } else if (item.OrderStatus === ORDER_STATUS_ENUM.PAYED) {
                  item.OrderStatusDescription = '已支付'
                } else if (item.OrderStatus === ORDER_STATUS_ENUM.FINISHIED) {
                  item.OrderStatusDescription = '已完成'
                } else if (item.OrderStatus === ORDER_STATUS_ENUM.PAY_TIMEOUT) {
                  item.OrderStatusDescription = '支付超时'
                } else if (item.OrderStatus === ORDER_STATUS_ENUM.BAD_REQUEST) {
                  item.OrderStatusDescription = '请求失败'
                } else {
                  item.OrderStatusDescription = ''
                }
              })
              resolve(res.data)
              self.hideLoading()
            })
          })
        },
        getShop (shopId) {
          let self = this
          let shop = self.$store.state.shop
          if (shopId === shop.shopID) {
            return new Promise(function (resolve, reject) {
              let result = {
                data: {
                  Name: shop.Name,
                  Cover: shop.Cover
                }
              }
              resolve(result)
            })
          } else {
            let otherShops = self.$store.state.otherShops
            let shop = otherShops.find(x => { return x.data.ID === shopId })
            if (shop) {
              return new Promise(function (resolve, reject) {
                resolve(shop)
              })
            } else {
              return new Promise(function (resolve, reject) {
                Util.ajax.get('/shop/' + shopId, {
                  params: {
                  }
                }).then(res => {
                  otherShops.push(res)
                  self.$store.commit('setOtherShops', otherShops)
                  resolve(res)
                })
              })
            }
          }
        },
        // 加载更多
        loaderMore () {
          if (this.preventRepeat) {
            return
          }
          this.preventRepeat = true
          this.showLoading = true
          this.offset += 10
          // 获取信息
          // let res = await getOrderList(this.userInfo.user_id, this.offset);
          // this.orderList = [...this.orderList, ...res];
          // this.hideLoading();
          // if (res.length < 10) {
          //     return
          // }
          this.preventRepeat = false
        },
        // 显示详情页
        showDetail (item) {
          // this.SAVE_ORDER(item)
          // this.preventRepeat = false
          this.$router.push('/order/orderDetail?orderId=' + item.OrderID)
        },
        // 生产环境与发布环境隐藏loading方式不同
        hideLoading () {
          this.showLoading = false
        },
        loadTop () {
          let self = this
          self.getServerData().then(function (data) {
            self.orderList = data
            self.allLoaded = true // if all data are loaded
            self.$refs.loadmore.onTopLoaded()
          })
        }
      }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    $rem: 23.4375px;

    .order_page{
        background-color: #f1f1f1;
        margin-bottom: 1.95 * $rem;
        p, span, h4{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .order_list_ul{
        padding-top: 1.95 * $rem;
        background-color: #f1f1f1;
        .order_list_li{
            background-color: #fff;
            display: flex;
            margin-bottom: 0.5 * $rem;
            padding: .6 * $rem .6 * $rem 0;
            .restaurant_image{
                @include wh(2 * $rem, 2 * $rem);
                margin-right: 0.8 * $rem;
            }
            .order_item_right{
                flex: 5;
                .order_item_right_header{
                    border-bottom: 0.025 * $rem solid #f5f5f5;
                    padding-bottom: .1 * $rem;
                    @include fj;
                    .order_header{
                        h4{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            @include sc(.75 * $rem, #333);
                            line-height: 1 * $rem;
                            width: 9 * $rem;

                            .arrow_right{
                                @include wh(.4 * $rem, .4 * $rem);
                                fill: #ccc;
                                margin-right: .2 * $rem;
                            }
                        }
                        .order_time{
                            @include sc(.55 * $rem, #999);
                            line-height: .5 * $rem;
                        }
                    }
                    .order_status{
                        @include sc(.6 * $rem, #333);
                    }
                }
                .order_basket{
                    @include fj;
                    line-height: 0.5 * $rem;
                    border-bottom: 0.025 * $rem solid #f5f5f5;
                    .order_name{
                        @include sc(.6 * $rem, #666);
                        width: 8 * $rem;
                    }
                    .order_amount{
                        @include sc(.6 * $rem, #f60);
                        font-weight: bold;
                    }
                }
                .order_again{
                    text-align: right;
                    line-height: 1.6 * $rem;
                    .buy_again{
                        @include sc(.55 * $rem, #3190e8);
                        border: 0.025 * $rem solid #3190e8;
                        padding: .1 * $rem .2 * $rem;
                        border-radius: .15 * $rem;
                    }
                }
            }
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2 * $rem, 0, 0);
        opacity: 0;
    }
</style>