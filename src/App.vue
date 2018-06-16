<template>
  
<div id="app" >
  <transition :name="transitionName">
    <router-view class="child-view"></router-view>
  </transition>
</div>
</template>

<script>
import svgIcon from './components/common/svg'
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  mounted () {
  },
  // 监听路由的路径，可以通过不同的路径去选择不同的切换效果
  watch: {
    '$route' (to, from) {
      if (to.path === '/goods') {
        this.transitionName = 'slide-right'
      } else if (from.path === '/order') {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
    }
  },
  components: {
    svgIcon
  }
}
</script>

<style lang="scss">
@import "../style.scss";
#app {
//  font-family: 'Avenir', Helvetica, Arial, sans-serif;
//  -webkit-font-smoothing: antialiased;
//  -moz-osx-font-smoothing: grayscale;
//  text-align: center;
//  color: #2c3e50;
 // margin-top: 1rem;
  height: -webkit-fill-available;
  background-color: #f5f5f5;
}

body {
  margin: 0;
}

.el-textarea__inner{
//  font-size:0.54rem;
}

p { 
  max-height: 999999px; 
}

.mint-field {
  .mint-cell-value {
//    font-size: $common-font-size !important;
  }
}
h1{
  margin: 0;
}

ul, menu, dir {
    display: block;
    list-style-type: disc;
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
    list-style:none;
}

.child-view {  
  position: absolute;  
  left: 0;  
  top: 0;  
  width: 100%;  
  height: 100%;  
  transition: all .2s linear;  
}  

.slide-left-enter, .slide-right-leave-active {  
  opacity: 0;  
  -webkit-transform: translate(50%, 0);  
  transform: translate(50%, 0);  
}  
.slide-left-leave-active, .slide-right-enter {  
  opacity: 0;  
  -webkit-transform: translate(0, 0);  
  transform: translate(0, 0);  
}
</style>
