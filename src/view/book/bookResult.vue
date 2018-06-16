 <template>
    <div class="rating_page">
        <head-top head-title="预订结果"></head-top>
        <section class="show_success">
          <el-table
            :data="bookHistory"
            height="400"
            style="width: 100%">
            <el-table-column
              prop="No"
              label="编号">
            </el-table-column>
            <el-table-column
              prop="Amount"
              label="人数">
            </el-table-column>
            <el-table-column
              prop="BookDate"
              label="日期">
            </el-table-column>
          </el-table>
        </section>
        <p class="determine" @click="goToMenuPage">开始点菜</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'
    import Util from '../../libs/util.js'

    export default {
      data () {
        return {
          showAlert: false,
          alertText: null,
          shopID: undefined,
          queue: [],
          bookHistory: []
        }
      },
      components: {
        headTop,
        alertTip
      },
      computed: {
        ...mapState([
          'userInfo'
        ])
      },
      created () {
        this.shopID = this.$route.query.shopID
        this.initData()
        this.getQueue()
        console.log('book result')
      },
      mounted () {
      },
      props: [],
      methods: {
        // 初始化信息
        initData () {
        },
        goToMenuPage () {
          this.$router.push(`/goods?shopID=${this.$store.state.shop.shopID}|roomID=${this.$store.state.orginalRoom.roomID}`)
        },
        getQueue () {
          var self = this
          Util.ajax.post(`/qcalling/queue/info`, {
            ShopID: self.shopID
          })
          .then(res => {
            self.queue = res.data
            if (self.queue && self.queue.hasOwnProperty('Waitings')) {
              let _queue = self.queue.Waitings
              let tel = self.userInfo.cardNumber
              self.bookHistory = []
              _queue.forEach((item, i) => {
                if (item.Telphone === tel) {
                  self.bookHistory.push(item)
                }
              })
              console.log(self.bookHistory)
            }
          })
        },
        closeTipFun () {
          this.showAlert = false
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
        margin: 0 .5 * $rem 1 * $rem;
        @include sc(.7 * $rem, #fff);
        background-color: #4cd964;
        padding: .5 * $rem 0;
        border: 1px;
        border-radius: 0.15 * $rem;
        text-align: center;
    }
    
</style>
