<template>
  <div>
    <loading v-if="showLoading"></loading>
  </div>
</template>
<script>
  import Util from '../libs/util.js'
  import loading from '@/components/common/loading'

  export default{
    name: 'Index',
    data () {
      return {
        showLoading: true
      }
    },
    components: {
      loading
    },
    created () {
      this.getWXCode()
    },
    methods: {
      getWXCode () {
        let self = this
        let $path = window.encodeURI(`http://www.starstech.cc/goods?shopID=${this.$route.query.shopID}_${this.$route.query.roomID}`)
        let url = '/wepay/webAuthCodeUrl?path=' + $path
        Util.ajax.get(url).then(res => {
          let wxUrl = res.data
          self.showLoading = false
          window.location.href = wxUrl
        })
      }
    }
  }
</script>
<style lang="scss">
</style>