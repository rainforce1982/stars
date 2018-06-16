<template>
  <transition name="fade">
    <div class="pagemask" v-show="maskShow" @click.self.prevent="maskHide">

    </div>
  </transition>
</template>
<script>
export default {
  name: 'pageMask',
  props: {
    // maskShow: {
    //   type: Boolean,
    //   default: false
    // }
  },
  computed: {
    maskShow () {
      console.log('maskShow', this.$store.state.maskShow)
      return this.$store.state.maskShow
    }
  },
  data () {
    return {
    }
  },
  methods: {
    maskHide () {
      this.$store.commit('setMask', false)
      this.$emit('maskHide')
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="scss">
.pagemask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
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
</style>