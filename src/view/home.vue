<template>
  <div class="good">
    <div style="width:100%">
    code: {{code}}
    </div>
    <div style="width:100%">
    res: {{res}}
    </div>
    <div class="app">
        <div class="gun" @click="launch($event)"></div>
        <div class="shells-wrapper">
          <transition v-for="shell in shells" key="shell.id " name="launch-shell" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="shell" v-show="shell.show">
              <div class="inner"></div>
            </div>
          </transition>
        </div>
        <div class="goal"></div>
    </div>
  </div>
</template>
<script>
  // import Util from '../libs/util.js'
  //  const ERR_OK = 0
  export default {
    name: 'Home',
    // props: {
    //   seller: {
    //     type: Object
    //   }
    // },
    data () {
      return {
        goods: [],
        seller: null,
        listHeight: [],
        scrolly: 0,
        selectedFood: {},
        imgs: [],
        menuSelect: 0,
        code: null,
        res: null,
        shells: [
          {
            id: 1,
            show: false
          },
          {
            id: 2,
            show: false
          },
          {
            id: 3,
            show: false
          }
        ]
      }
    },
    created () {
      this.getWx()
    },
    mounted () {
    //      this.$nextTick(() => {
    //       this._initScroll()
    //      })
    },
    computed: {
    },
    methods: {
      getWx () {
        this.code = this.$route.query.code
        console.log(this.$route.query.code)
        let user = {}
        user.id = Date.now()
      },
      launch (event) {
        for (let i = 0; i < this.shells.length; i++) {
          let shell = this.shells[i]
          if (!shell.show) {
            shell.show = true
            shell.target = event.target
            return
          }
        }
      },
      beforeEnter (el) {
        let count = this.shells.length
        while (count--) {
          let shell = this.shells[count]
          if (shell.show) {
            let rect = shell.target.getBoundingClientRect()
            let left = rect.left - 32
            let top = -(window.innerHeight - rect.top - 15)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${top}px,0)`
            el.style.transform = `translate3d(0,${top}px,0)`
            let inner = el.getElementsByClassName('inner')[0]
            inner.style.webkitTransform = `translate3d(${left}px,0,0)`
            inner.style.transform = `translate3d(${left}px,0,0)`
          }
        }
      },
      enter (el, done) {
        /* eslint-disable no-unused-vars */
        let refresh = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
        done()
      },
      afterEnter (el) {
        let ball = this.shells[0]
        ball.show = false
        el.style.display = 'none'
      }
    },
    components: {
    }
  }
</script>
<style lang="scss">
</style>
