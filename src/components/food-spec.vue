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
        <h4 class="ellipsis">{{food.GoodsName}}</h4>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1"class="specs_cancel" @click="maskHide">
            <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
            <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
        </svg>
      </header>
      <section class="specs_details">
        <section v-for="group in specGroups">
          <b>{{group.name}}</b>
          <ul>
              <li v-for="(item, itemIndex) in group.GoodsDetails" :class="{specs_activity: itemIndex == specsIndex && group.name === specsName}" @click="chooseSpecs(itemIndex, group.name)">
                <div class="row">
                  <div class="col col-60 specName">
                    {{item.GoodsName}}
                  </div>
                  <div class="col">
                    <specControl :food.sync="item" @change="specChange"></specControl>
                  </div>
                </div>
              </li>
          </ul>
        </section>
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
    },
    food: {
      type: Object
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
    specChange (add, groupName) {
      this.food.GoodsDetails = this.food.GoodsDetails.map(gd => {
        if (!gd.IsFixed && gd.GroupName === groupName) {
          add ? gd.GroupLimit-- : gd.GroupLimit++
        }
        // console.log(add, groupName, this.food.GroupName, gd.GroupLimit, gd.IsFixed, !gd.IsFixed && this.food.GroupName === groupName)
        return gd
      })
      console.log(this.specGroups)
    },
    chooseSpecs (index, name) {
      this.specsIndex = index
      this.specsName = name
    },
    maskHide () {
      this.$emit('hideSpecs')
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
        position: fixed;
        top: 10%;
        left: 10%;
        width: 80%;
        max-height: 80%;
        overflow: scroll;
        background-color: #fff;
        z-index: 101;
        border: 1px;
        border-radius: 0.2*$rem;
        .specs_list_header{
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
        }
        .specs_details{
            padding: .5*$rem;
            .specs_details_title{
              //  @include sc(.6*$rem, #666);
            }
            ul{
                display: flex;
                flex-wrap: wrap;
                padding: .4*$rem 0;
                li{
                    font-size: $small-font;
                    width: 100%;
                    padding: .3*$rem .5*$rem;
                    border-bottom: 1px solid #ddd;
                  //  border-radius: .2*$rem;
                  //  margin-right: .5*$rem;
                  //  margin-bottom: .2*$rem;
                }
                .specs_activity{
                    border-color: #3199e8;
                    color: #3199e8;
                }
            }
        }
        .specs_footer{
          //  @include fj;
            align-items: center;
            background-color: #f9f9f9;
            padding: 0.5*$rem;
            border: 1px;
            border-bottom-left-radius: .2*$rem;
            border-bottom-right-radius: .2*$rem;
            .specs_price{
                span{
                    color: #ff6000;
                }
                span:nth-of-type(1){
                    font-size: .5*$rem;
                }
                span:nth-of-type(2){
                    font-size: .8*$rem;
                    font-weight: bold;
                    font-family: Helvetica Neue,Tahoma;
                }
            }
            .specs_addto_spec{
              //  @include wh(4*$rem, 1.3*$rem);
                background-color: #3199e8;
                border: 1px;
                border-radius: 0.15*$rem;
              //  @include sc(.6*$rem, #fff);
                text-align: center;
                line-height: 1.3*$rem;
            }
        }
    }
}
</style>