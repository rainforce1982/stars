 <template>
    <div class="order_detail_page">
        <section v-if="!showLoading">
            <head-top head-title="订单详情" go-back='true'></head-top>
            <section v-if="!showLoading" id="scroll_section">
                <section class="scroll_insert">
                    <section class="order_title">
                        <img :src="orderDetail.shopCover">
                        <p>{{orderDetail.shopName}}</p>
                        <p>支付超时</p>
                        <div class="order_again">
                            <router-link class="buy_again" :to="{path: '/goods?shopID=' + orderDetail.ShopID + '|roomID=' + orginalRoomId }">再来一单</router-link>
                        </div>
                    </section>
                    <section class="food_list">
                        <router-link class="food_list_header" :to="{ path: '/goods?shopID=' + orderDetail.ShopID + '|roomID=' + orginalRoomId }">
                            <div class="shop_name">
                                <img :src="orderDetail.shopCover">
                                <span>{{orderDetail.shopName}}</span>
                            </div>
                            <svg fill="#333" class="arrow_right">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </router-link>
                        <ul class="food_list_ul">
                            <li v-for="item in orderDetail.OrderGoods">
                                <div class="row food_item_style">
                                    <div class="col col-60 food_name">
                                        <span>{{item.GoodsName}}</span>
                                    </div>
                                    <div class="col col-20 num_price">
                                        <span>X{{item.GoodsCount}}</span>
                                    </div>
                                    <div class="col col-20 num_price">
                                        <span>¥{{item.Price}}</span>
                                    </div>
                                </div>
                                <div v-show="item.isCollapseRemark">
                                    <div v-for="(remark, index) in item.GoodsRemarks" :key="index">
                                        <div class="row food_detail_style" v-if="remark.RemarkCount > 0">
                                            <div class="col col-60">
                                                <span class="food_detail">{{remark.RemarkName}}</span>
                                            </div>
                                            <div class="col col-40 num_price">
                                                <span>x {{remark.RemarkCount}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="pay_ment">应付{{orderDetail.totalAmount.toFixed(2)}}</div>
                    </section>
                </section>
            </section>
        </section>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import headTop from '@/components/header/head'
    import loading from '@/components/common/loading'
    import Util from '@/libs/util.js'

    export default {
      data () {
        return {
          showLoading: true, // 显示加载动画
          orderData: null,
          orderDetail: null,
          orginalRoomId: null
        }
      },
      mounted () {
        this.initData()
      },
      components: {
        headTop,
        loading
      },
      computed: {
        ...mapState([
          'geohash', 'userInfo'
        ])
      },
      methods: {
        initData () {
          this.orginalRoomId = this.$store.state.orginalRoom.roomID
          let orderId = this.$route.query.orderId
          let shopId = this.$store.state.shop.shopID
          let roomId = this.$store.state.room.roomID
          let openid = this.$store.getters.getOpenId
          Util.ajax.get(`/orders?orderId=${orderId}&openid=${openid}`, {
            params: {
            }
          }).then(res => {
            let item = res.data[0]
            item.shopName = ''
            item.shopCover = ''
            item.ShopID = shopId
            item.RoomID = roomId
            // 店铺信息
            this.getShop(item.ShopID).then(result => {
              item.shopName = result.data.Name
              item.shopCover = result.data.Cover
            })
            let totalAmount = 0
            item.OrderGoods.forEach((good) => {
              totalAmount += good.Price * good.GoodsCount

              // 处理订单详情的食品备注
              good.GoodsRemarks = []
              if (good.Remarks) {
                let remarkArr = good.Remarks.split(';')
                remarkArr.forEach(remark => {
                  let obj = {}
                  let arr = remark.split(':')
                  if (arr[0] && arr[1]) {
                    obj.RemarkCount = arr[1]
                    obj.RemarkName = arr[0]
                    good.GoodsRemarks.push(obj)
                  }
                })
                good.isCollapseRemark = true
              }
            })
            item.totalAmount = totalAmount
            this.orderDetail = item
            this.hideLoading()
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
        hideLoading () {
          this.showLoading = false
        }
      }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    $rem: 23.4375px;

    .order_detail_page{
        padding-top: 2 * $rem;
        background-color: #f1f1f1;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .scroll_insert{
        padding-bottom: .5 * $rem;
    }
    .order_title{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .7 * $rem;
        background-color: #fff;
        margin-bottom: 0.5 * $rem;
        img{
            border: 0.05 * $rem solid $blue;
            border-radius: 50%;
            @include wh(3 * $rem, 3 * $rem);
        }
        p:nth-of-type(1){
            @include sc(.9 * $rem, #333);
            font-weight: bold;
            margin-top: .4 * $rem;
        }
        p:nth-of-type(2){
            @include sc(.55 * $rem, #999);
            width: 10 * $rem;
            margin-top: .3 * $rem;
            text-align: center;
        }
        .order_again{
            text-align: right;
            line-height: 1.6 * $rem;
            .buy_again{
                @include sc(.55 * $rem, #3190e8);
                border: 0.025 * $rem solid #3190e8;
                padding: .1 * $rem .2 * $rem;
                border-radius: .15 * $rem;
                text-decoration: none;
            }
        }
    }
    .food_list{
        background-color: #fff;
        .food_list_header{
            @include fj;
            align-items: center;
            padding: .2 * $rem .5 * $rem;
            border-bottom: 1px solid #f5f5f5;
            text-decoration: none;
            .shop_name{
                img{
                    @include wh(1.2 * $rem, 1.2 * $rem);
                    vertical-align: middle;
                    margin-right: .2 * $rem;
                }
                span{
                    @include sc(.75 * $rem, #333);
                    font-weight: bold;                    
                }
            }
            svg{
                @include wh(.6 * $rem, .6 * $rem);
                fill: #666;
            }
        }
        .food_list_ul{
            padding-top: .5 * $rem;
        }
        .food_item_style{
            @include fj;
            line-height: 1.5 * $rem;
            
            span,p{
                @include sc(.65 * $rem, #666);
            }
            .food_name{
                width: 10 * $rem;
                padding-left: .7 * $rem;
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
            span,p{
                @include sc(.6 * $rem, #aaa);
            }
            .food_name{
                width: 10 * $rem;
                padding: 0 .7 * $rem;
            }
            .food_detail{
                padding-left: 1 * $rem;
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
        .deliver_fee{
            @include fj;
            align-items: center;
            padding: 0 .5 * $rem;
            line-height: 2 * $rem;
            border-top: 1px solid #f5f5f5;
            span{
                @include sc(.6 * $rem, #666);
            }
        }
        .pay_ment{
            @include sc(.6 * $rem, #fb6b23);
            border-top: 1px solid #f5f5f5;
            font-weight: bold;
            line-height: 2 * $rem;
            text-align: right;
            padding-right: .5 * $rem;
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    
</style>
