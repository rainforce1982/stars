 <template>
    <div class="rating_page">
        <head-top head-title="预约成功"></head-top>
        <section class="show_success">
        	<i class="ion-checkmark" style="font-size: 100px;"></i>
          <div>预约成功</div>
        </section>
        <p class="main_btn" @click="goToMenuPage">开始点菜</p>
        <p class="other_btn" @click="goToBookResultPage">查看编号</p>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'

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
        },
        goToMenuPage () {
          this.$router.push(`/goods?shopID=${this.$store.state.shop.shopID}|roomID=${this.$store.state.orginalRoom.roomID}`)
        },
        goToBookResultPage () {
          this.$router.push(`/book/bookResult?shopID=${this.$store.state.shop.shopID}&roomID=${this.$store.state.orginalRoom.roomID}`)
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
        background-color: #eee;
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
    .main_btn{
        margin: 0 .5 * $rem 1 * $rem;
        @include sc(.7 * $rem, #fff);
        background-color: #4cd964;
        padding: .5 * $rem 0;
        border: 1px;
        border-radius: 0.15 * $rem;
        text-align: center;
    }
    .other_btn{
        margin: 0 .5 * $rem 1 * $rem;
        @include sc(.7 * $rem, #333);
        background-color: #fff;
        padding: .5 * $rem 0;
        border: 1px;
        border-radius: 0.15 * $rem;
        text-align: center;
    }
    
</style>
