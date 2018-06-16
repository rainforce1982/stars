<template>
  <div class="specControl">
    <div v-if="food.IsFixed">
      {{food.GoodsDetailCount}}
      <i class="ion-android-lock iconfont spec-lock" ></i>
    </div>
    <div v-else>
      <transition name="fade">
          <div class="spec-decrease" v-show="food.GoodsDetailCount>0" @click="decreasespec($event)">
            <transition name="inner">
            <i class="ion-ios-minus-outline inner iconfont"></i>
            </transition>
          </div>
      </transition>
       <span class="spec-count" v-show="food.GoodsDetailCount > 0 ">
        {{food.GoodsDetailCount}}
      </span>
      <i v-if="food.GroupLimit>0" class="ion-ios-plus iconfont spec-add" @click="addspec($event)"></i>
      <i v-else-if="food.GoodsDetailCount>0" class="ion-ios-checkmark iconfont spec-ok"></i>
    </div>
  </div>
</template>

<script >
  // import Vue from 'vue'
  export default {
    name: 'specControl',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addspec (event) {
        // if (!this.food.GoodsDetailCount) {
        //   Vue.set(this.food, 'GoodsDetailCount', 1)
        // } else {
        this.food.GoodsDetailCount++
        // }
//        event.srcElement.outerHTML
        this.$emit('change', true, this.food.GroupName) // 子组件通过 $emit触发父组件的方法 increment   还
      },
      decreasespec (event) {
        this.food.GoodsDetailCount--
        this.$emit('change', false, this.food.GroupName)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
@import '../../style.scss';
.specControl {
  font-size: 0;
  text-align: right;
  .spec-decrease {
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
  .spec-count{ 
    display: inline-block;
    font-size: 16px;
    line-height: 24px;
    width: 12px;
    vertical-align: top;
    padding: 0 10px;
    text-align: center;
    color: rgb(147, 153, 159);
  }
  .spec-add{    
    display: inline-block;
    padding: 0;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: $primary-color;
  }
  .spec-lock {
    display: inline-block;
    padding: 0 2px 0 0;
    line-height: 24px;
    font-size: 26px;
    vertical-align: top;
    color: $accent-color;
  }
  .spec-ok {
    display: inline-block;
    padding: 0 2px 0 0;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: $success-color;
  }
}
</style>
