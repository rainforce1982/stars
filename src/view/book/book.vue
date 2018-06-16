<template>
    <div class="bookContainer" v-if="shop">
        <head-top head-title="预约订座" goBack="true" signin-up='book'>
        </head-top>
        <form class="bookForm">
            <div class="shop_logo">
              <img :src="shop.Cover" height="100" width="100" />
            </div>
            <section class="shop_container">
              <div class="shop_name">{{shop.Name}}</div>
            </section>
            <section class="input_container">
              <span>就餐人数</span>
              <span>
                <i class="ion-ios-minus-outline inner iconfont" @click="decrement"></i>
                {{personCounter}} 
                <i class="ion-ios-plus iconfont remark-add" @click="increment"></i>
              </span>
            </section>
            <section class="input_container">
              <span>姓名</span>
              <span>{{userName}}</span>
            </section>
            <section class="input_container">
              <span>性别</span>
              <span>{{sex === 1 ? '先生' : '女士'}}</span>
            </section>
            <section class="input_container">
              <span>联系电话</span>
              <span>
                <input type="text" class="mint-field-core" dir="rtl" placeholder="" name="phone" maxlength="11" v-model="phoneNumber">
              </span>
            </section>
            <section class="book_btn_container">
              <div class="book_btn" @click="checkin">立即预定</div>
              <div class="book_result" @click="goToBookResultPage">预订结果</div>
            </section>
        </form>
        
        <div class="waiting_container" v-if="queue">
          <el-table
            :data="waitingQueue"
            style="width: 100%">
            <el-table-column
              prop="QueueName"
              label="队列名称">
            </el-table-column>
            <el-table-column
              prop="CustomerCount"
              label="就餐人数">
            </el-table-column>
            <el-table-column
              prop="WaitingCount"
              label="等待桌数">
            </el-table-column>
          </el-table>
        </div>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { Toast } from 'mint-ui'
    import headTop from '@/components/header/head'
    import loading from '@/components/common/loading'
    import Util from '../../libs/util.js'

    export default {
      data () {
        return {
          showLoading: true,
          personCounter: 8,
          shopID: 0,
          shop: undefined,
          userName: undefined,
          phoneNumber: undefined,
          sex: 1,
          queue: [],
          waitingQueue: [{
            QueueName: '1-4人',
            CustomerCount: '1-4',
            minCount: 1,
            maxCount: 4,
            WaitingCount: 0
          }, {
            QueueName: '5-8人',
            CustomerCount: '5-8',
            minCount: 5,
            maxCount: 8,
            WaitingCount: 0
          }, {
            QueueName: '9-16人',
            CustomerCount: '9-16',
            minCount: 9,
            maxCount: 16,
            WaitingCount: 0
          }, {
            QueueName: '17人以上',
            CustomerCount: '17以上',
            minCount: 17,
            maxCount: 32,
            WaitingCount: 0
          }],
          bookedAsset: undefined
        }
      },
      components: {
        headTop,
        loading
      },
      created () {
        this.shopID = this.$route.query.shopID
        this.getShop()
        this.getQueue()
        this.initUser()
        console.log('lll')
      },
      computed: {
        ...mapState([
          'userInfo'
        ]),
        rightPhoneNumber: function () {
          return /^1\d{10}$/gi.test(this.phoneNumber)
        }
      },
      methods: {
        headerClassName () {
          return 'header-row'
        },
        getShop () {
          Util.ajax.get(`/shop/${this.shopID}`).then(res => {
            this.showLoading = false
            this.shop = res.data
          })
        },
        initUser () {
          let self = this
          if (self.userInfo) {
            self.phoneNumber = self.userInfo.cardNumber
            self.userName = self.userInfo.nickname
            self.sex = self.userInfo.sex
          } else {
            alert('请先登录')
          }
        },
        genGroupQueue (_queue) {
          var self = this
          if (Array.isArray(_queue)) {
            _queue.forEach((w, i) => {
              if (w.Amount > 0 && w.Amount < 4) {
                ++self.waitingQueue[0].WaitingCount
              } else if (w.Amount <= 8) {
                ++self.waitingQueue[1].WaitingCount
              } else if (w.Amount <= 16) {
                ++self.waitingQueue[2].WaitingCount
              } else {
                ++self.waitingQueue[3].WaitingCount
              }
            })
          }
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
              self.genGroupQueue(_queue)
            }
          })
        },
        increment () {
          ++this.personCounter
        },
        decrement () {
          if (this.personCounter > 1) {
            --this.personCounter
          }
        },
        checkin () {
          var self = this
          Util.ajax.post(`/qcalling/checkin?isAvailable=true`, {
            ShopID: self.shopID,
            Name: self.userName,
            Telphone: self.phoneNumber,
            Amount: self.personCounter,
            Sex: self.sex
          })
          .then(res => {
            self.bookedAsset = res.data
            Toast({
              message: '预订成功',
              iconClass: 'icon ion-checkmark-round'
            })
            self.$router.push(`/book/bookSuccess?shopID=${this.$store.state.shop.shopID}&roomID=${this.$store.state.orginalRoom.roomID}`)
            // self.getQueue()
          })
        },
        goToBookResultPage () {
          this.$router.push(`/book/bookResult?shopID=${this.$store.state.shop.shopID}&roomID=${this.$store.state.orginalRoom.roomID}`)
        }
      }
    }
</script>

<style lang="scss" scoped>
    @import '../../../style.scss';
    @import '../../style/mixin';
    $rem: 23.4375px;
    
    .bookContainer{
        padding-top: 1.95 * $rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .bookForm{
        background-color: #fff;
        margin-top: 4 * $rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6 * $rem .8 * $rem;
            border-bottom: 1px solid #f1f1f1;
            span{
              padding-right: 0.1 * $rem;
              line-height: 1 * $rem;
            }
            input{
                @include sc(.65 * $rem, #666);
                border: 0;
                line-height: 1 * $rem;
            }
            button{
                @include sc(.65 * $rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28 * $rem .4 * $rem;
                border: 1px;
                border-radius: 0.15 * $rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
            .custom-icon {
              border-radius: 50%;
              height: 1.5 * $rem;
              width: 2 * $rem;
              border: 1px solid skyblue;
              font-style: normal;
            }
        }
        .shop_logo {
            position: absolute;
            top: 3 * $rem;
            margin: 0 auto;
            height: 100px;
            text-align: center;
            width: 100%;
            img {
              border-radius: 50%;            
            }
          }
        .shop_container {
          display: flex;
          justify-content: center;
          .shop_name {
            height: $rem;
            padding-top: 2 * $rem;
          }          
        }
        .empty{
            @include sc(.65 * $rem, #fff);
            padding: .28 * $rem .4 * $rem;
            border: 1px;
        }
        .phone_number{
            padding: .3 * $rem .8 * $rem;
        }
        .book_btn_container {
          padding-top: 0.5 * $rem;
          padding-bottom: 0.05 * $rem;
          .book_btn{
            margin: 0 .5 * $rem 1 * $rem;
            @include sc(.7 * $rem, #fff);
            background-color: #4cd964;
            padding: .5 * $rem 0;
            border: 1px;
            border-radius: 0.15 * $rem;
            text-align: center;
          }
          .book_result {
            margin: 0 .5 * $rem 1 * $rem;
            font-size: x-small;
            text-align: right;
            color: #333;
          }
        }
    }
    .waiting_container {
      background-color: #fff;
      margin-top: $rem;
      .el-table th {
        background: #fff;
      }
    }
    .button_switch{
        background-color: #ccc;
        display: flex;
        justify-content: center;
        @include wh(2 * $rem, .7 * $rem);
        padding: 0 .2 * $rem;
        border: 1px;
        border-radius: 0.5 * $rem;
        position: relative;
        .circel_button{
            transition: all .3s;
            position: absolute;
            top: -0.2 * $rem;
            z-index: 1;
            left: -0.3 * $rem;
            @include wh(1.2 * $rem, 1.2 * $rem);
            box-shadow: 0 0.026667 * $rem 0.053333 * $rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;
        }
        .trans_to_right{
            transform: translateX(1.3 * $rem);
        }
        span{
            @include sc(.45 * $rem, #fff);
            transform: translateY(.05 * $rem);
            line-height: .6 * $rem;
        }
        span:nth-of-type(2){
            transform: translateY(-.08 * $rem);
        }
    }
    .remark-add{    
      display: inline-block;
      padding: 0;
      line-height: 24px;
      font-size: 24px;
      vertical-align: top;
      color: $primary-color;
    }
    .inner{
      display: inline-block;
      line-height: 24px;
      font-size: 24px;
      vertical-align: top;
      color: $primary-color;
      &.inner-enter-active, &.inner-leave-active {
        transition: all 0.4s linear;
        transform: rotate(0);
      }
      &.inner-enter, &.inner-leave-active {
        opacity: 0;
        transform: rotate(180deg);
      }
    }
</style>
