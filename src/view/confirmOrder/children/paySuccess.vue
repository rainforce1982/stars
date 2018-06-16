 <template>
    <div class="rating_page">
        <head-top head-title="支付结果" go-back='true'></head-top>
        <section class="show_success" v-if="orderDetail.trade_state === 'SUCCESS'">
        	<i class="ion-checkmark-circled" style="font-size: 100px;"></i>
          <div>支付成功</div>
        </section>
        <section class="show_fail" v-else>
          <i class="ion-checkmark-circled" style="font-size: 100px;"></i>
          <div>支付失败</div>
        </section>
        <section class="pay_way_list">
          <ul class="food_list_ul" >
            <li>
              <div class="row food_item_style">
                <span class="col col-25">交易编号：</span>
                <span class="col col-75">{{orderDetail.transaction_id}}</span>
              </div>
              <div class="row food_item_style">
                <span class="col col-25">付款金额：</span>
                <span class="col col-75">{{orderDetail.cashFee}}元</span>
              </div>
              <div class="row food_item_style">
                <span class="col col-25">下单时间：</span>
                <span class="col col-75">{{orderDetail.timeEnd}}</span>
              </div>
              <div>
                {{JSON.stringify(orderDetail)}}
              </div>
            </li>
          </ul>
      </section>
      <p class="determine" @click="goToOrderPage">查看订单</p>
      <p class="determine" @click="goToMenuPage">返回菜单</p>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import Util from '@/libs/util.js'
    import alertTip from '@/components/common/alertTip'
    import {formatDate} from '@/common/js/date.js'
    // import {payRequest} from 'src/service/getData'
    // import alertTip from 'src/components/common/alertTip'

    export default {
      data () {
        return {
          showAlert: false,
          alertText: null,
          orderDetail: {}
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
      },
      props: [],
      methods: {
        // 初始化信息
        initData () {
          let self = this
          self.orderDetail.trade_state = 'SUCCESS'
          // 7g48bsup7k81btvudboi
          // ${self.$route.query.cartId}
          let openid = self.$store.state.userInfo.openid
          Util.ajax.get(`/wepay/wxorder?cartId=${self.$route.query.cartId}&openid=${openid}`).then(res => {
            alert(JSON.stringify(res))
            let item = res.data
            item.cashFee = parseInt(item.cash_fee) / 100
            if (item.time_end) {
              item.timeEnd = self.getDate(item.time_end)
            }
            self.orderDetail = item
          }).error(err =>
            alert(err)
          )
        },
        getDate (dateStr) {
          let now = new Date()
          if (dateStr && dateStr.length === 14) {
            let year = dateStr.substring(0, 4)
            let month = dateStr.substring(4, 6)
            let day = dateStr.substring(6, 8)
            let hour = dateStr.substring(8, 10)
            let minute = dateStr.substring(10, 12)
            let second = dateStr.substring(12, 14)
            return `${year}-${month}-${day} ${hour}:${minute}:${second}`
          } else {
            return formatDate(now, 'yyyy-MM-dd hh:mm:ss')
          }
        },
        goToMenuPage () {
          this.$router.push(`/goods?shopID=${this.$store.state.shop.shopID}|roomID=${this.$store.state.orginalRoom.roomID}`)
        },
        goToOrderPage () {
          this.$router.push(`/order`)
        },
        // 关闭提示框，跳转到订单列表页
        closeTipFun () {
          this.showAlert = false
          // if (this.gotoOrders) {
          //   this.$router.push('/order')
          // }
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
    .show_success{
		    background-color: #fff;
        color: #4cd964;
        padding: .7 * $rem;
        text-align: center;
    }
    .show_fail{
        background-color: #fff;
        color: red;
        padding: .7 * $rem;
        text-align: center;
    }
    .pay_way{
        background-color: #f1f1f1;
        padding: 0 .7 * $rem;
        @include sc(.7 * $rem, #666);
        line-height: 1.8 * $rem;
    }
    .pay_way_list{
        background-color: #fff;
        padding-left: 1 * $rem;
        .food_list_ul{
          padding-top: .5 * $rem;
        }
        .food_item_style{
            @include fj;
            line-height: 1.8 * $rem;
            span{
                @include sc(.65 * $rem, #666);
            }
            .food_name{
                width: 10 * $rem;
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
    }
    .determine{
        background-color: #fff;
        @include sc(.7 * $rem, #3190e8);
        text-align: center;
        margin: 0 .7 * $rem;
        line-height: 1.8 * $rem;
        border-radius: 0.2 * $rem;
        margin-top: 0.5 * $rem;
        font-weight: bold;
    }
    
</style>
