<template>
  <transition name="fade">
    <div v-show="showFlag" class="food">
      <div class="fond-content">
        <div class="image-header" v-if="food.images">
          <mt-swipe :auto="0">
            <mt-swipe-item><img :src="food.images[0]" alt=""  @error="setErrorImg"></mt-swipe-item>
            <mt-swipe-item><img :src="food.images[1]" alt=""  @error="setErrorImg"></mt-swipe-item>
            <mt-swipe-item><img :src="food.images[2]" alt=""  @error="setErrorImg"></mt-swipe-item>
          </mt-swipe>
          
          
        </div>
        <div class="content">
          <h1 class="title">{{food.GoodsName}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating"> 好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.Price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div v-if="food.IsPack" class="specButton" @click.stop.prevent="selectSpec(food)">
            <i v-if="specDone(food)" class="ion-ios-checkmark iconfont spec-ok"></i>
            <i v-else class="ion-android-alert iconfont spec-need" ></i>
            套餐
          </div>
          <div class="cartControl-wrapper">
            <numControl v-if="food.GoodsRemarks && food.GoodsRemarks.length > 0" :count="food.GoodsCount" @increment="remarkChange(food)" @decrement="remarkChange(food)"></numControl>
            <cartControl v-else :food="food" @increment="increment" @decrement="decrement"></cartControl>
          </div>
          <transition name="buy">
            <div class="buy" @click.stop.prevent="addFirst($event)" v-show="!food.GoodsCount || food.GoodsCount === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <split></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingSelect @increment="incrementTotal" :select-type="selectType" :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings"></ratingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px"
                  v-for="rating in food.ratings">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img width="12" height="12" :src=rating.avatar alt="" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i class="iconfont"
                     :class="{'icon-damuzhi':rating.rateType === 0,'icon-down':rating.rateType === 1,}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || food.ratings.length === 0"></div>
          </div>
        </div>
      </div>
      <div class="back" @click="hide">
        <i class="ion-chevron-left iconfont "></i>
      </div>
    </div>
  </transition>

</template>

<script >
  import BScroll from 'better-scroll'
  import cartControl from './cart-control.vue'
  import split from './split/split.vue'
  import ratingSelect from './rating-select.vue'
  import {specDone} from '../common/js/tools.js'
  import numControl from '../components/num-control.vue'
  import {formatDate} from '../common/js/date'
//  const POSITIVE = 0
//  const NEGATIVE = 1
  const ALL = 2
  export default {
    name: 'Food',
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartControl,
      ratingSelect,
      numControl,
      split
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    mounted () {
      // console.log(this.food.images)
    },
    methods: {
      remarkChange (food) {
        this.$emit('remarkChange', food)
      },
      specDone (food) {
        return specDone(food)
      },
      selectSpec (food) {
        this.$emit('selectSpec', food)
      },
      setErrorImg (e) {
        e.target.src = 'http://nstart.cc:8686/uploads/shop/3.jpg'
      },
      show () {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$el, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      incrementTotal (type, data) {
        this[type] = data
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      increment (target) {
        this.$emit('increment', target)
      },
      decrement (target) {
        this.$emit('decrement', target)
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.GoodsRemarks.length > 0) {
          this.$emit('remarkChange', this.food)
        } else {
          this.food.GoodsCount++
          this.$emit('increment', event.target)
        }
        // Vue.set(this.food, 'count', 1)
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
@import "../common/scss/mixin.scss";
@import '../../style.scss';
.food{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #ffffff;
  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.2s linear;
    transform: translate3d(0, 0, 0);
  }
  &.fade-enter, &.fade-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .image-header{

    position: relative;
    width: 100%;
    height: 400px;
  //  padding-top: 100%;
    img{
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
    
  }

  .content{
    position: relative;
    padding: 18px;
    .specButton{
      font-size: $smaller-font;
      vertical-align: top;
      box-sizing: border-box;
      border: 1px solid $primary-color;
      align-items: center;
      text-align: center;
      border-radius: 12px;
      color: $primary-color;
      width: 80px;
      position: absolute;
      line-height: 24px;
      height: 24px;
      right: 128px;
      bottom: 18px;
      z-index: 10;
      .spec-ok {
        margin-top: -1px;
        font-size: $middle-font;
        color: $success-color;
        display: inline-block;
        padding: -2px 2px 0 0;
        line-height: 24px;
       // font-size: 24px;
        vertical-align: top;
      }
      .spec-need {
        margin-top: -1px;
        display: inline-block;
        padding: 0 2px 0 0;
        line-height: 24px;
       // font-size: 24px;
        vertical-align: top;
        font-size: $middle-font;
        color: $accent-color;
      }
    }
    .title{

      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail{   
      margin-bottom: 18px;
      line-height: 10px;
      font-size: 0;
      height: 10px;
      .sell-count, .rating{
        font-size: 10px;
        display: inline-block;
        color: rgb(147, 153, 159);
      }
      .sell-count{
        margin-right: 12px;
      }
    }
    .price{

      font-weight: 700px;
      line-height: 24px;
      .now{

        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old{

        font-size: 10px;
        color: rgb(147, 153, 159);
        text-decoration: line-through;
      }
    }
  }
    .cartControl-wrapper{

      position: absolute;
      right: 18px;
      bottom: 18px;
    }
    .buy{

      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: $smaller-font;
      color: #fff;
      background: rgb(0, 160, 220);
      &.buy-enter-active, &.buy-leave-active {
        transition: all 0.2s;
        opacity: 0;
      }
      &.buy-enter, &.buy-leave-active {
        opacity: 0;

      }
    }
  .info{
    padding: 18px;
    .title{      
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .text{      
      font-size: 12px;
      line-height: 24px;
      padding: 0 8px;
      color: rgb(77, 85, 93);
    }
  }
  .rating{
    padding-top: 18px;
    .title{      
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .rating-wrapper{
      padding: 0 18px;
      .rating-item{

        position: relative;
        padding: 16px 0;
        border: -1px(rgba(1, 17, 27, 0.1));
        .user{
          position: absolute;
          right: 0;
          top: 16px;
          font-size: 0;
          line-height: 12px;
          .name{
            display: inline-block;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
            margin-right: 6px;
          }
          .avatar{
            border-radius: 50%;
          }
        }
        .time{
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .text{    
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          .iconfont{
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }
          .icon-damuzhi{
            color: rgb(0, 160, 220);
          }
          .icon-down{
            color: rgb(147, 153, 159);
          }
        }
      }
      .no-rating{      
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
  .back{
    position: fixed;
    top: 20px;
    left: 20px;
    height: 40px;
    width: 40px;
    background-color: #5e625f;  
    opacity: 0.6;
    border-radius: 50%; 
    text-align: center;
    .iconfont{
      display: block;
      line-height: 40px;
      font-size: 20px;
      color: #ffffff;  
    }   
  }
}
</style>
