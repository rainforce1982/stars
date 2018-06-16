 <template>
    <div class="rating_page">
        <section v-if="!showLoading">
            <head-top head-title="订单备注" go-back='true'></head-top>
            <section class="quick_remark" v-if="remarkList.remarks.length">
                <header class="header_style">快速备注</header>
                <ul class="remark_arr_list_ul">
                    <li class="remark_arr_list_li" v-for="(item,index) in remarkList.remarks" :key="index">
                        <span :class="{first: remarkIndex == 0, last: remarkIndex == item.length - 1, choosed: localRemarkText[index]&&(localRemarkText[index][0] == remarkIndex)}" class="remark_item_li" v-for="(remarkTtem, remarkIndex) in item" :key="remarkIndex" @click="chooseRemark(index, remarkIndex, remarkTtem)">{{remarkTtem}}</span>
                    </li>
                </ul>
            </section>
            <section class="input_remark quick_remark">
                <header class="header_style">其他备注</header>
                <textarea class="input_text" v-model="localInputText" placeholder="请输入备注内容(可不填)" maxlength="200"></textarea>
            </section>
            <div class="determine" @click="confirmRemark">确定</div>
        </section>
        <loading v-if="showLoading"></loading>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    // import {getRemark} from 'src/service/getData'
    import loading from '@/components/common/loading'
    import {mapState, mapMutations} from 'vuex'

    export default {
      data () {
        return {
          id: null,
          sig: null,
          remarkList: null,
          showLoading: true,
          localRemarkText: {},
          localInputText: null
        }
      },
      created () {
        this.id = this.$route.query.id
        this.sig = this.$route.query.sig
      },
      mounted () {
        this.initData()
      },
      mixins: [],
      components: {
        headTop,
        loading
      },
      computed: {
        ...mapState([
          'remarkText', 'inputText'
        ])
      },
      props: [],
      methods: {
        ...mapMutations([
          'CONFIRM_REMARK'
        ]),
        // 初始化信息
        initData () {
          this.remarkList = {}
          this.remarkList.remarks = [['不要辣', '少点辣', '多点辣'], ['不要香菜']]
          this.localRemarkText = this.remarkText || {}
          this.localInputText = this.inputText
          this.showLoading = false
        },
        // 选择备注
        chooseRemark (index, remarkIndex, text) {
          // 如果已选择就取消选择，否则添加
          let isAdded = false
          for (let p in this.localRemarkText) {
            if (parseInt(p) === index) {
              if (this.localRemarkText[p][0] === remarkIndex && this.localRemarkText[p][1] === text) {
                isAdded = true
              }
            }
          }
          if (isAdded) {
            delete this.localRemarkText[index]
          } else {
            this.localRemarkText[index] = [remarkIndex, text]
          }
          this.localRemarkText = JSON.parse(JSON.stringify(this.localRemarkText))
        },
        // 确认选择
        confirmRemark () {
          this.CONFIRM_REMARK({remarkText: this.localRemarkText, inputText: this.localInputText})
          this.$router.go(-1)
        }
      }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    $rem: 23.4375px;
    .rating_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 204;
        padding-top: 1.95 * $rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .header_style{
        @include sc(.65 * $rem, #333);
        line-height: 2 * $rem;
    }
    .quick_remark{
        background-color: #fff;
        margin-top: .4 * $rem;
        padding: 0 .6 * $rem 1 * $rem;
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right: .6 * $rem;
                margin-bottom: .6 * $rem;
                span{
                    @include sc(.6 * $rem, #333);
                    padding: .3 * $rem .6 * $rem;
                    border: 0.025 * $rem solid #3190e8;
                    border-left: 0;
                }
                .first{
                    border-left: 0.025 * $rem solid #3190e8;
                    border-top-left-radius: .2 * $rem;
                    border-bottom-left-radius: .2 * $rem;
                }
                .last{
                    border-top-right-radius: .2 * $rem;
                    border-bottom-right-radius: .2 * $rem;
                }
                .choosed{
                    color: #fff;
                    background-color: #3190e8;
                }
            }
        }
    }
    .input_remark{
        background-color: #fff;
        .input_text{
            width: 95%;
            background-color: #f9f9f9;
            border: 0.025 * $rem solid #eee;
            resize: none;
            min-height: 4.5 * $rem;
            border-radius: .2 * $rem;
            @include sc(.6 * $rem, #666);
            padding: .5 * $rem;
        }
    }
    .determine{
        background-color: #4cd964;
        @include sc(.7 * $rem, #fff);
        text-align: center;
        margin: 0 .7 * $rem;
        line-height: 1.8 * $rem;
        border-radius: 0.2 * $rem;
    }
    
</style>
