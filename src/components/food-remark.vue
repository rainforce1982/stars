<template>
  <mt-popup
    v-model="showRemark"
    position="bottom" class="foodRemark">
    <section class="remarks_details">
      <section class="remarksHeader">
        <b>{{food.GoodsName}} x {{food.GoodsCount}}</b>
        <b class="price">￥ {{food.Price*food.GoodsCount}}</b>
      </section>
      <section class="remarkContent">
        <ul v-if="food.GoodsRemarks">
            <li v-for="(item, itemIndex) in food.GoodsRemarks">
              <div class="row remarkList">
                <div class="col col-60 remarkName">
                  {{item.RemarkName}}
                </div>
                <div class="col">
                  <remarkControl :remark.sync="item" @increment="increment" @decrement="decrement"></remarkControl>
                </div>
              </div>
            </li>
        </ul>
      </section>
    </section>
  </mt-popup>
<!--   <transition name="fade">
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

    </div>
  </transition> -->
</template>

<script>
import remarkControl from './remark-control'
export default {
  name: 'foodRemark',
  components: {
    remarkControl
  },
  props: {
    show: {
      type: Boolean
    },
    food: {
      type: Object
    }
  },
  mounted () {
    console.log(this.show, this.showRemark)
  },
  data () {
    return {
      specsIndex: 0,
      showRemark: this.show,
      specsName: ''
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    show: function (newValue) {
      this.showRemark = newValue
    },
    showRemark: function (newValue) {
      this.$emit('update:show', newValue)
    }
  },
  computed: {
    // specGroups () {
    //   let speclist = new Set()
    //   this.food.GoodsDetails.forEach(g => {
    //     speclist.add(g.GroupName)
    //   })
    //   return [...speclist].map(s => {
    //     let sg = {}
    //     sg.name = s
    //     sg.GoodsDetails = this.food.GoodsDetails.filter(gd => gd.GroupName === s)
    //     return sg
    //   })
    // }
  },
  methods: {
    increment (target) {
      console.log(target)
      this.food.GoodsCount ++
    },
    decrement (target) {
      console.log(target)
      this.food.GoodsCount --
    }
    // specChange (add, groupName) {
    //   this.food.GoodsDetails = this.food.GoodsDetails.map(gd => {
    //     if (!gd.IsFixed && gd.GroupName === groupName) {
    //       add ? gd.GroupLimit-- : gd.GroupLimit++
    //     }
    //     // console.log(add, groupName, this.food.GroupName, gd.GroupLimit, gd.IsFixed, !gd.IsFixed && this.food.GroupName === groupName)
    //     return gd
    //   })
    //   console.log(this.specGroups)
    // },
    // chooseSpecs (index, name) {
    //   this.specsIndex = index
    //   this.specsName = name
    // },
    // maskHide () {
    //   this.$emit('hideSpecs')
    // },
    // showChooseList () {
    //   // this.showSpecs = false
    // }
  }
}
</script>
<style lang="scss">
@import "../../style.scss";

.foodRemark {
  width: 100%;
}

.remarksHeader {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  .price {
    float: right;
    text-align: right;
    font-size: 14px;
    font-weight: 700;
    color: #f01414;
    display: inline-block;
    line-height: 40px;
    vertical-align: top;
    text-align: center;
  }
}

.remarkContent {
  padding: 0 18px;
  max-height: 400px;
  overflow: scroll;
  background: #fff;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .remarkList {
    padding: 10px 0;
  }
}


</style>