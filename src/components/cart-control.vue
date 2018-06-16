<template>
  <div class="cartControl">
    <transition name="fade">
        <div class="cart-decrease" v-show="food.GoodsCount>0" @click.stop.prevent="decreaseCart($event)">
          <transition name="inner">
          <i class="ion-ios-minus-outline inner iconfont"></i>
          </transition>
        </div>
    </transition>
    <span class="cart-count" v-show="food.GoodsCount > 0 " @click.stop.prevent="popupVisible">
      
      {{food.GoodsCount}}
    </span>
    <i class="ion-ios-plus iconfont cart-add" @click.stop.prevent="addCart($event)"></i>
  </div>
</template>

<script >
  // import Vue from 'vue'
  export default {
    name: 'cartControl',
    data () {
      return {
      }
    },
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      popupVisible () {
        this.$store.commit('setNumberPicker', {food: this.food, show: true})
      },
      addCart (event) {
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return
        }
        // if (!this.food.GoodsCount) {
        //   Vue.set(this.food, 'GoodsCount', 1)
        // } else {
        this.food.GoodsCount++
        // }
//        event.srcElement.outerHTML
        this.$emit('increment', event.target) // 子组件通过 $emit触发父组件的方法 increment   还
      },
      decreaseCart (event) {
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return
        }
        this.food.GoodsCount--
        this.$emit('decrement', event.target)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../style.scss';
.cartControl {
  font-size: 0;
  text-align: right;
  .cart-decrease {
    display: inline-block;
    padding: 0;
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.4s linear;
    }
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      transform: translate3d(24px, 0, 0);
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
  }
  .cart-count{ 
    display: inline-block;
    font-size: 18px;
    line-height: 24px;
    width: 24px;
    vertical-align: top;
    padding: 0 8px;
    text-align: center;
    color: rgb(147, 153, 159);
  }
  .cart-add{    
    display: inline-block;
    padding: 0;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: $primary-color;
  }
}
</style>
