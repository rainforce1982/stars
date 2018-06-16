<template>
  <div class="remarkControl">
    <div>
      <transition name="fade">
          <div class="remark-decrease" v-show="remark.RemarkCount>0" @click="decrement($event)">
            <transition name="inner">
            <i class="ion-ios-minus-outline inner iconfont"></i>
            </transition>
          </div>
      </transition>
       <span class="remark-count" v-show="remark.RemarkCount > 0 ">
        {{remark.RemarkCount}}
      </span>
      <i class="ion-ios-plus iconfont remark-add" @click="increment($event)"></i>
    </div>
  </div>
</template>

<script >
  // import Vue from 'vue'
  export default {
    name: 'remarkControl',
    props: {
      remark: {
        type: Object
      }
    },
    methods: {
      increment (event) {
        // if (!this.food.RemarkCount) {
        //   Vue.set(this.food, 'RemarkCount', 1)
        // } else {
        this.remark.RemarkCount++
        // }
//        event.srcElement.outerHTML
        this.$emit('increment', event.target) // 子组件通过 $emit触发父组件的方法 increment
      },
      decrement (event) {
        this.remark.RemarkCount--
        this.$emit('decrement', event.target)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../style.scss';
.remarkControl {
  font-size: 0;
  text-align: right;
  .remark-decrease {
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
  .remark-count{ 
    display: inline-block;
    font-size: 16px;
    line-height: 24px;
    width: 12px;
    vertical-align: top;
    padding: 0 10px;
    text-align: center;
    color: rgb(147, 153, 159);
  }
  .remark-add{    
    display: inline-block;
    padding: 0;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: $primary-color;
  }
}
</style>
