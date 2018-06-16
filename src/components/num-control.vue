<template>
  <div class="remarkControl">
    <div>
      <transition name="fade">
          <div class="remark-decrease" v-show="count>0" @click.stop.prevent="decrement($event)">
            <transition name="inner">
            <i class="ion-ios-minus-outline inner iconfont"></i>
            </transition>
          </div>
      </transition>
       <span class="remark-count" v-show="count > 0 ">
        {{count}}
      </span>
      <i class="ion-ios-plus iconfont remark-add" @click.stop.prevent="increment($event)"></i>
    </div>
  </div>
</template>

<script >
  // import Vue from 'vue'
  export default {
    name: 'numControl',
    props: {
      data: {
        type: Object
      },
      count: {
        type: Number
      }
    },
    methods: {
      increment (event) {
        // if (!this.food.RemarkCount) {
        //   Vue.set(this.food, 'RemarkCount', 1)
        // } else {
        // }
//        event.srcElement.outerHTML
        this.$emit('increment', event.target) // 子组件通过 $emit触发父组件的方法 increment
      },
      decrement (event) {
        // this.remark.RemarkCount--
        this.$emit('decrement', event.target)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
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
    font-size: 18px;
    line-height: 24px;
    width: 24px;
    vertical-align: top;
    padding: 0 8px;
    text-align: center;
    color: #93999f;
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
