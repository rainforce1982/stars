<template>
<div class="spec" >
<!--   <div type="primary" @click.stop.prevent="showSpecMenu">规格</div> -->
<!--   <transition name="fade">
    <div class="specs_cover" @click="showChooseList" v-if="showSpecs"></div>
  </transition> -->
  <transition name="fade">
    <div class="specs_cover" v-show="show" @click.self.prevent="maskHide">
    </div>
  </transition>
  <transition name="fadeBounce">
    <div class="specs_list" v-if="show">
      <header class="specs_list_header">
        <h4 class="ellipsis"><i class="ion-android-alert iconfont spec-need"></i> 不能提交</h4>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1"class="specs_cancel" @click="maskHide">
            <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
            <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
        </svg>
      </header>
      <section class="specs_details">
        购物车中有规格未完成
      </section>
    </div>
  </transition>

</div>
</template>

<script>
import specControl from './spec-control'
export default {
  name: 'Spec',
  components: {
    specControl
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      specsIndex: 0,
      specsName: ''
    }
  },
  computed: {
    specGroups () {
      let speclist = new Set()
      this.food.GoodsDetails.forEach(g => {
        speclist.add(g.GroupName)
      })
      return [...speclist].map(s => {
        let sg = {}
        sg.name = s
        sg.GoodsDetails = this.food.GoodsDetails.filter(gd => gd.GroupName === s)
        return sg
      })
    }
  },
  methods: {
    maskHide () {
      this.$emit('hide')
    },
    showChooseList () {
      // this.showSpecs = false
    }
  }
}
</script>
<style scoped lang="scss">
@import "../../style.scss";

.spec {
  .specs_cover{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
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
  .specs_list{
    font-size: 24px;
    color: $notice-color;
    position: fixed;
    top: 40%;
    left: 10%;
    width: 80%;
    max-height: 80%;
    overflow: scroll;
    background-color: #fff;
    z-index: 101;
    border: 1px;
    border-radius: 0.2*$rem;
    .specs_list_header {
        h4{
          //  @include sc(.7*$rem, #222);
            font-weight: normal;
            margin: 0;
            text-align: center;
            padding: .5*$rem;
        }
        .specs_cancel{
            position: absolute;
            right: .5*$rem;
            top: .5*$rem;
        }
        .spec-need {
          color: $accent-color;
          font-size: 36px
        }
    }
    .specs_details {
      text-align: center;
      padding: .5*$rem;
    }
  }
}
</style>