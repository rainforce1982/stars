<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList($event)">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="ion-ios-cart iconfont icon-gouwuche" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
          <!-- <div class="desc">另需配送费￥{{deliveryPrice}}元</div> -->
        </div>
        <div class="content-right" @click.stop.prevent="pay" v-if="totalCount > 0">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
        <div class="content-right" v-else>
          <div class="disabled-button">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="shopcart-food" v-for="food in selectFoods">
                <div class="row">
                  <div class="col"><div class="name">{{food.GoodsName}}</div></div>
                  <div class="col col-25"><div >
                    <span v-if="food.IsPack" class="specButton" @click.stop.prevent="selectSpec(food)">
                      <i v-if="specDone(food)" class="ion-ios-checkmark iconfont spec-ok"></i>
                      <i v-else class="ion-android-alert iconfont spec-need" ></i>
                    </span>
                    <span class="price">￥{{(food.Price * food.GoodsCount * 100) / 100}}</span></div>
                  </div>  
                  <div class="col col-25"><div class="cartControl-wrapper">
                    <numControl v-if="food.GoodsRemarks.length > 0" :count="food.GoodsCount" @increment="remarkChange(food)" @decrement="remarkChange(food)"></numControl>
                    <cartControl v-else :food="food" @increment="increment" @decrement="decrement"></cartControl>
                </div></div>  
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script >
  import cartControl from './cart-control.vue'
  import BScroll from 'better-scroll'
  import {specDone} from '../common/js/tools.js'
  import numControl from '../components/num-control.vue'
  export default {
    name: 'shopCart',
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [{price: 20, count: 2}]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      gotoPay: {
        type: Boolean,
        default: false
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        hideCart: true
      }
    },
    watch: {
      // 如果 `question` 发生改变，这个函数就会运行
      gotoPay: function (gotoPay) {
        if (gotoPay) {
          this.pay()
        }
      }
    },
    mounted () {
    },
    computed: {
      allSpecDone () {
        let done = true
        this.selectFoods.forEach(s => {
          if (!specDone(s)) {
            done = false
          }
        })
        return done
      },
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.Price * food.GoodsCount * 100
        })
        total = total / 100
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.GoodsCount
        })
        return count
      },
      payDesc () {
        // if (this.totalPrice === 0) {
        //   return `￥${this.minPrice}元起送`
        // } else if (this.totalPrice < this.minPrice) {
        //   let diff = this.minPrice - this.totalPrice
        //   return `还差￥${diff}元起送`
        // } else {
        return '去结算'
        // }
      },
      payClass () {
        // if (this.totalPrice < this.minPrice) {
        //   return 'not-enough'
        // } else {
        return 'enough'
        // }
      },
      listShow () {
        if (!this.totalCount) {
          this.hideCart = true
          return false
        }
        if (!this.hideCart) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return !this.hideCart
      }
    },
    methods: {
      remarkChange (food) {
        this.$emit('remarkChange', food)
      },
      increment (target) {
        console.log('increment, shop-cart')
        this.$emit('increment', target)
      },
      decrement (target) {
        this.$emit('decrement', target)
      },
      selectSpec (food) {
        this.$emit('selectSpec', food)
      },
      specDone (food) {
        return specDone(food)
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.hideCart = !this.hideCart
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.GoodsCount = 0
          food.GoodsRemarks = food.GoodsRemarks.map(r => {
            r.RemarkCount = 0
            return r
          })
        })
        this.$emit('decrement', [])
      },
      hideList () {
        this.hideCart = true
      },
      pay () {
        // if (this.totalPrice < this.minPrice) {
        //   return
        // }
        if (!this.allSpecDone) {
          this.$emit('needSpecDone')
          return
        }
        let cart = {}
        cart.roomID = this.$store.state.room.roomID
        cart.Sum = 0
        cart.RoomCode = this.$store.state.room.RoomCode
        cart.RoomOpCode = this.$store.state.room.RoomOpCode
        cart.RoomName = this.$store.state.room.RoomName
        cart.RoomTypeName = 0
        cart.SubmitOrders = this.selectFoods
        cart.userNo = '2'
        cart.cardNo = ''
        cart.isPresent = false
        cart.orderType = '落单'
        cart.CartDone = true
        cart.tel = ''
        this.$store.commit('setCart', cart)
        this.$emit('confirm')
        // window.alert('支付' + this.totalPrice + '元')
        this.$router.push('/confirmOrder')
      },
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          if (!this.balls[i].show) {
            this.balls[i].show = true
            this.balls[i + 1].el = el
            this.balls[i + 1].show = true
            this.balls[i].el = el
            this.dropBalls.push(this.balls[i])
            this.dropBalls.push(this.balls[i + 1])
            return
          }
        }
      },
      beforeEnter (el) {
        console.log('beforeEnter')
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            el.style.display = ''
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      moveBall (el) {
        this.$nextTick(() => {
          // el.style.webkitTransform = 'translate3d(100px,0,0)'
          // el.style.transform = 'translate3d(100px,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(100px,0,0)'
          inner.style.transform = 'translate3d(100px,0,0)'
        })
      },
      enter (el) {
      //          let rf = el.offestHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
        ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    },
    components: {
      numControl,
      cartControl
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
@import "../common/scss/mixin.scss";
@import '../../style.scss';

.shopCart {
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 50;
  width: 100%;
  height: 48px;
  .content {
    display: flex;
    background: #141d27;
    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: #f01414;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
        .logo {
          width: 100%;
          height: 100%;
          text-align: center;
          border-radius: 50%;
          background: #2b343c;
          &.highlight {
            background: #00a0dc;
          }
          .icon-gouwuche {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;
            &.highlight {
              color: #fff;
            }
          }
        }
      }
    
      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.4);
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        vertical-align: top;
        line-height: 24px;
        margin-left: 12px;
        margin-top: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 700;
        background: #2b333b;
        &.not-enough {
          background: #2b333b;
          disabled: disabled;
        }
        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
      .disabled-button{
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 700;
        background: #2b343c;
      }
    }
  }
  .ball-container .ball {
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
    .inner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #00a0dc;
      transition: all 0.4s linear;
    }
  }
  .shopcart-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s;
      transform: translate3d(0, -100%, 0);
    }
    &.fade-enter, &.fade-leave-active {
      transform: translate3d(0, 0, 0);
    }
    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title {
        float: left;
        font-size: 14px;
        color: #07111b;
      }
      .empty {
        float: right;
        font-size: 12px;
        color: #00a0dc;
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 400px;
      overflow: scroll;
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      .shopcart-food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border-1px(rgba(7,17,27,0.1));
        .name {
          line-height: 24px;
          font-size: 14px;
          color: #07111b;
          text-align: left;
        }
        .specButton{
          font-size: $middle-font;
          .spec-ok {
            color: $success-color;
          }
          .spec-need {
            color: $accent-color;
          }
        }
        .price {
        //  position: absolute;
        //  right: 90px;
        //  bottom: 12px;
          text-align: right;
          font-size: 14px;
          font-weight: 700;
          color: #f01414;
          display: inline-block;
        //  font-size: 16px;
          line-height: 24px;
        //  width: 12px;
          vertical-align: top;
        //  padding: 0 10px;
          text-align: center;
        //  color: #93999f;
        }
        .cartControl-wrapper {
        //  position: absolute;
        //  right: 0;
        //  bottom: 6px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);
  &.fade-enter-active, &.fade-leave-active {
    opacity: 1;
    transition: all 0.5s;
    background: rgba(7, 17, 27, 0.6);
  }
  &.fade-enter, &.fade-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>
