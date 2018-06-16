<template>
    <div class="loginContainer">
        <head-top head-title="会员登录" goBack="true" signin-up='login'>
        </head-top>
        <form class="loginForm">
            <section class="input_container">
                <input type="text" placeholder="请输入手机号" name="phone" maxlength="11" v-model="phoneNumber">
                <span class="empty">获取验证码</span>
            </section>
            <section class="input_container">
                <input type="text" placeholder="请输入短信验证码" name="mobileCode" maxlength="4" v-model="mobileCode">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
        </form>
        <div class="login_container" @click="mobileLogin">绑定</div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'
    import {mapMutations} from 'vuex'
    import Util from '@/libs/util.js'

    export default {
      data () {
        return {
          loginWay: false, // 登录方式，默认短信登录
          showPassword: false, // 是否显示密码
          phoneNumber: null, // 电话号码
          mobileCode: null, // 短信验证码
          validate_token: null, // 获取短信时返回的验证值，登录时需要
          computedTime: 0, // 倒数记时
          userInfo: null, // 获取到的用户信息
          userAccount: null, // 用户名
          passWord: null, // 密码
          captchaCodeImg: null, // 验证码地址
          codeNumber: null, // 验证码
          showAlert: false, // 显示提示组件
          alertText: null // 提示的内容
        }
      },
      components: {
        headTop,
        alertTip
      },
      create: {},
      computed: {
        // 判断手机号码
        rightPhoneNumber: function () {
          return /^1\d{10}$/gi.test(this.phoneNumber)
        }
      },
      methods: {
        ...mapMutations([
          'RECORD_USERINFO'
        ]),
        // 获取短信验证码
        getVerifyCode () {
          let self = this
          if (this.rightPhoneNumber) {
            this.computedTime = 60
            this.timer = setInterval(() => {
              this.computedTime --
              if (this.computedTime === 0) {
                clearInterval(this.timer)
              }
            }, 1000)
            // 发送短信验证码
            let obj = {}
            obj.openid = this.$store.state.userInfo.openid
            obj.telePhone = this.phoneNumber
            Util.ajax.post(`/bridge/sendVerifySms?shopId=${self.$store.state.shop.shopID}`, obj).then(res => {
            })
            // this.validate_token = res.validate_token
          }
        },
        // 发送登录信息
        mobileLogin () {
          let self = this
          if (!self.rightPhoneNumber) {
            self.showAlert = true
            self.alertText = '手机号码不正确'
            return
          } else if (!(/^\d{4}$/gi.test(self.mobileCode))) {
            self.showAlert = true
            self.alertText = '短信验证码不正确'
            return
          }

          let obj = {}
          obj.openid = this.$store.state.userInfo.openid
          obj.telePhone = this.phoneNumber
          obj.verifyCode = this.mobileCode
          // 手机号登录
          Util.ajax.post(`/bridge/wxUserBind?shopId=${self.$store.state.shop.shopID}`, obj).then(res => {
            self.$router.go(-1)
          })
          // this.RECORD_USERINFO(this.userInfo)
          // 如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
          // if (!this.userInfo.user_id) {
          //   this.showAlert = true
          //   this.alertText = this.userInfo.message
          //   // if (!this.loginWay) this.getCaptchaCode();
          // } else {
          //   this.RECORD_USERINFO(this.userInfo)
          //   this.$router.go(-1)
          // }
        },
        closeTip () {
          this.showAlert = false
        }
      }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    $rem: 23.4375px;

    .loginContainer{
        padding-top: 1.95 * $rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .change_login{
        position: absolute;
        @include ct;
        right: 0.75 * $rem;
        @include sc(.7 * $rem, #fff);
    }

    .loginForm{
        background-color: #fff;
        margin-top: .6 * $rem;
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
        }
        .empty{
            @include sc(.65 * $rem, #fff);
            padding: .28 * $rem .4 * $rem;
            border: 1px;
        }
        .phone_number{
            padding: .3 * $rem .8 * $rem;
        }
        .captcha_code_container{
            height: 2.2 * $rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5 * $rem, 1.5 * $rem);
                    margin-right: .2 * $rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2 * $rem;
                    justify-content: center;
                    p{
                        @include sc(.55 * $rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2 * $rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5 * $rem, red);
        padding: .4 * $rem .6 * $rem;
        line-height: .5 * $rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{
        margin: 0 .5 * $rem 1 * $rem;
        @include sc(.7 * $rem, #fff);
        background-color: #4cd964;
        padding: .5 * $rem 0;
        border: 1px;
        border-radius: 0.15 * $rem;
        text-align: center;
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
    .change_to_text{
        background-color: #4cd964;
    }
    .to_forget{
        float: right;
        @include sc(.6 * $rem, #3b95e9);
        margin-right: .3 * $rem;
    }
</style>
