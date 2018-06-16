<template>
    <div class="profile_page">
        <head-top go-back='true' :head-title="profiletitle"></head-top>
        <section>
            <section class="profile-number">
                <router-link :to="userInfo&&userInfo.user_id? '/profile/info' : '/login'" class="profile-link">
                    <img :src="userInfo.headimgurl" class="privateImage" v-if="userInfo&&userInfo.openid">
                    <span class="privateImage" v-else>
                        <svg class="privateImage-svg">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#headimgurl-default"></use>
                        </svg>
                    </span>
                    <div class="user-info">
                        <p>{{nickname}}</p>
                        <p>
                            <span class="user-icon">
                                <i class="ion-android-phone-portrait" style="color:white;"></i>
                            </span>
                            <span class="icon-mobile-number">{{mobile}}</span>
                        </p>
                    </div>
                    <span class="arrow">
                        <i class="ion-ios-arrow-right" style="color:white;"></i>
                    </span>
                </router-link>
            </section>
            <section class="info-data">
                <ul class="clear">
                    <div tag="li" class="info-data-link">
                        <span class="info-data-top"><b>{{parseInt(balance).toFixed(2)}}</b>元</span>
                        <span class="info-data-bottom">会员卡余额</span>
                    </div>
                    <div tag="li" class="info-data-link">
                        <span class="info-data-top"><b>{{count}}</b>个</span>
                        <span class="info-data-bottom">我的优惠</span>
                    </div>
                    <div tag="li" class="info-data-link">
                        <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
                        <span class="info-data-bottom">我的积分</span>
                    </div>
                </ul>
            </section>
            <section class="profile-1reTe">
                <!-- 我的订单 -->
                <router-link to='/order' class="myorder">
                    <i class="ion-ios-list iconfont ordercolor"></i>
                    <div class="myorder-div">
                        <span>&nbsp;我的订单</span>
                    </div>
                    <span class="myorder-divsvg">
                        <i class="ion-ios-arrow-right iconfont noticeColor"></i>
                    </span>
                </router-link>
            </section>
            <section class="profile-1reTe" v-if="cardNumber !== 0">
                <router-link :to="{path:'/profile/paycode', query: {cardNumber: cardNumber}}" class="myorder">
                    <i class="ion-ios-barcode iconfont ordercolor"></i>
                    <div class="myorder-div">
                        <span>&nbsp;付钱</span>
                    </div>
                    <span class="myorder-divsvg">
                        <i class="ion-ios-arrow-right iconfont noticeColor"></i>
                    </span>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link :to="{path:'/book', query: {shopID: this.$store.state.shop.shopID}}" class="myorder">
                    <i class="ion-ios-list-outline iconfont ordercolor"></i>
                    <div class="myorder-div">
                        <span>&nbsp;预约订座</span>
                    </div>
                    <span class="myorder-divsvg">
                        <i class="ion-ios-arrow-right iconfont noticeColor"></i>
                    </span>
                </router-link>
            </section>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import headTop from '@/components/header/head'
import {mapState, mapMutations} from 'vuex'
import Util from '@/libs/util.js'

export default {
  name: 'Profile',
  data () {
    return {
      profiletitle: '我的',
      nickname: '登录/注册', // 用户名
      resetname: '',
      mobile: '暂无绑定手机号', // 电话号码
      balance: 0, // 我的余额
      count: 0, // 优惠券个数
      pointNumber: 0, // 积分数
      cardNumber: 0, // 卡号
      headimgurl: '', // 头像地址
      responseData: null
    }
  },
  mounted () {
    this.initData()
  },
  components: {
    headTop
  },

  computed: {
    ...mapState([
      'userInfo'
    ]),
    // 后台会返回两种头像地址格式，分别处理
    imgpath: function () {
      let path
      if (this.headimgurl.indexOf('/') !== -1) {
        path = this.headimgurl
      } else {
        path = this.getImgPath(this.headimgurl)
      }
      this.SAVE_AVANDER(path)
      return path
    }
  },
  methods: {
    ...mapMutations([
      'SAVE_AVANDER'
    ]),
    initData () {
      let self = this
      // let obj = {}
      // obj.openid = 'o7nyGwlRb_o3C2e9czq0RVgJRMxE'
      // Util.ajax.post(`/bridge/getWxMember?shopId=${this.$store.state.shop.shopID}`, obj).then(res => {
      //   self.responseData = res.data
      //   if (res && res.data) {
      //     self.userInfo.mobile = res.data.Telephone
      //     self.userInfo.balance = res.data.CurrentAmount
      //     self.userInfo.point = res.data.CurrentScore
      //   }
      // })
      if (self.userInfo && self.userInfo.openid) {
        let obj = {}
        obj.openid = self.userInfo.openid
        Util.ajax.post(`/bridge/getWxMember?shopId=${this.$store.state.shop.shopID}`, obj).then(res => {
          self.responseData = res.data
          // let log = JSON.stringify(res.data)
          // alert(log)
          if (res && res.data && res.data.d) {
            let data = JSON.parse(res.data.d)
            self.mobile = self.userInfo.mobile = data.Telephone
            self.balance = self.userInfo.balance = data.CurrentAmount
            self.pointNumber = self.userInfo.point = data.CurrentScore
            self.cardNumber = self.userInfo.cardNumber = data.CardNo
            self.$store.commit('setUserInfo', self.userInfo)
          }
        })
        self.headimgurl = self.userInfo.headimgurl
        self.nickname = self.userInfo.nickname
        self.mobile = self.userInfo.mobile || '暂无绑定手机号'
        self.balance = self.userInfo.balance || 0
        self.count = self.userInfo.gift_amount || 0
        self.pointNumber = self.userInfo.point || 0
        self.cardNumber = self.userInfo.cardNumber || 0
        // self.$store.commit('setUserInfo', self.userInfo)
      } else {
        self.nickname = '登录/注册'
        self.mobile = '暂无绑定手机号'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
@import '../../../style.scss';
.profile_page{
    p, span{
        font-family: Helvetica Neue,Tahoma,Arial;
    }
}
.profile-number{
    padding-top:1.95*$rem;
    .profile-link{
        text-decoration: none;
        display:block;
        display:flex;
        box-align: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background:$blue;
        padding: .666667*$rem .6*$rem;
        .privateImage{
            display:inline-block;
            @include wh(2.5*$rem,2.5*$rem);
            border-radius:50%;
            vertical-align:middle;
            .privateImage-svg{
                background:$fc;
                border-radius:50%;
                @include wh(2.5*$rem,2.5*$rem);
            }
        }
        .user-info{
            margin-left:.48*$rem;
            -webkit-box-flex: 1;
            -ms-flex-positive: 1;
            flex-grow: 1;
            p{
                font-weight:700;
                @include sc(.8*$rem,$fc);
                .user-icon{
                    @include wh(0.5*$rem,0.75*$rem);
                    display:inline-block;
                    vertical-align:middle;
                    line-height:0.75*$rem;
                    .icon-mobile{
                        @include wh(100%,100%);
                    }
                }
                .icon-mobile-number{
                    display:inline-block;
                    @include sc(.57333*$rem,$fc);

                }
            }

        }
        .arrow{
            @include wh(.46667*$rem,.98*$rem);
            display:inline-block;
            svg{
               @include wh(100%,100%);
            }
        }
    }
}
.info-data{
    width:100%;
    background:$fc;
    box-sizing: border-box;
    ul{
        display: flex;
        .info-data-link{
            float:left;
            width:33.33%;
            display:inline-block;
            border-right:1px solid #f1f1f1;
            span{
                display:block;
                width:100%;
                text-align:center;
            }
            .info-data-top{
                @include sc(.55*$rem,#333);
                padding: .853333*$rem 0 .453333*$rem;
                b{
                    display:inline-block;
                    @include sc(1.2*$rem,#f90);
                    font-weight:700;
                    line-height:1*$rem;
                    font-family: Helvetica Neue,Tahoma;
                }
            }
            .info-data-bottom{
                @include sc(.57333*$rem,#666);
                font-weight:400;
                padding-bottom:.453333*$rem;

            }
        }
        .info-data-link:nth-of-type(2){
            .info-data-top{
                b{
                    color:#ff5f3e;
                }
            }

        }
        .info-data-link:nth-of-type(3){
            border:0;
            .info-data-top{
                b{
                    color:#6ac20b;
                }
            }
        }
    }
}
.profile-1reTe{
    margin-top:.4*$rem;
    background:$fc;
    .myorder{
        text-decoration: none;
        padding-left:0.6*$rem;
        display:flex;
        font-size: 24px;
        line-height:24px;
        align-items: center;
        .iconfont {
            font-size: 24px;
        }
        .ordercolor{
            color: #4aa5f0;
        }
        .myorder-divsvg{
            padding-right: .433333*$rem;
        }
        .myorder-div{
            width:100%;
            border-bottom:1px solid #f1f1f1;
            padding:.433333*$rem .266667*$rem .433333*$rem 0;
            @include sc(.7*$rem,#333);
            display:flex;
            justify-content:space-between;
            span{
                display:block;
            }            
        }
    }
    .myorder:nth-of-type(3) .myorder-div{
        border:0;
    }
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2*$rem, 0, 0);
    opacity: 0;
}
</style>
