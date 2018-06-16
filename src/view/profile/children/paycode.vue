<template>
    <div class="loginContainer">
        <head-top head-title="向商家付钱" goBack="true" signin-up='login'>
        </head-top>
        <div class="head">
          <img :src="headimgurl" class="privateImage" v-if="headimgurl">
          <span class="privateImage" v-else>
            <svg class="privateImage-svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#headimgurl-default"></use>
            </svg>
          </span>
        </div>
        <div class="canvasContainer">
          <div style="width:20px;"></div>
          <div style="width:100%">
            <canvas id="canvas"></canvas>
          </div>
          <div style="width:20px;"></div>
        </div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'
    import QRCode from 'qrcode'
    // import {mapMutations} from 'vuex'
    // import Util from '@/libs/util.js'

    export default {
      data () {
        return {
          showAlert: false, // 显示提示组件
          headimgurl: null,
          alertText: null // 提示的内容
        }
      },
      components: {
        headTop,
        alertTip
      },
      created () {
      },
      mounted () {
        this.initData()
      },
      computed: {
      },
      methods: {
        initData () {
          this.headimgurl = this.$store.state.userInfo.headimgurl
          let timestamp = Date.parse(new Date())
          let url = `cardNumber=${this.$route.query.cardNumber}&timestamp=${timestamp}`
          // alert(url)
          QRCode.toCanvas(document.getElementById('canvas'), url, {scale: 8}, function (error) {
            if (error) {
              alert(error)
            }
          })
        },
        closeTip () {
          this.showAlert = false
        }
      }
    }
</script>

<style lang="scss" scoped>
    @import '../../../style/mixin';
    $rem: 23.4375px;

    .loginContainer{
      padding-top: 1.95 * $rem;
    }
    .head{
      background-color: #3190e8;
      padding: 6px 0;
      text-align: center;
    }
    .privateImage{
      display:inline-block;
      @include wh(2.5*$rem,2.5*$rem);
      border-radius:50%;
      vertical-align:middle;
      .privateImage-svg{
          background-color: white;
          border-radius:50%;
          @include wh(2.5*$rem,2.5*$rem);
      }
    }
    .canvasContainer{
      display: flex;
      text-align: center;
      padding-top: 0.5 * $rem;
      background-color: #3190e8;
      height: 100%;
    }
</style>
