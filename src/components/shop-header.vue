<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
          <img width="64" height="64" :src="seller.Cover">
      </div>
      <div class="content">
        <div class="title">
          <span class="name">{{seller.Name}}</span>
        </div>
          <div class="description">
            <!-- {{$store.state.room.RoomAreaName || ''}} - <router-link :to="{path:'room', query:{shopID:$route.query.shopID, code: $route.query.code, state: $route.query.state}}"  class="description">{{$store.state.room.RoomName || ''}}</router-link> -->
            {{$store.state.room.RoomAreaName || ''}} - {{$store.state.room.RoomName || ''}}
            <!-- <router-link :to="{path:'room', query:{t:1, code: $route.query.code, state: $route.query.state, shopID:encodeURI($route.query.shopID)}}" class="description">{{$store.state.room.RoomName || ''}}</router-link> -->
          </div>
        <div v-if="seller.supports" class="support">
          <img class="icon" 
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzMyNUMwOUZFMzFDMTFFNDg1OEVBNjFDOTIyRDVFMkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzMyNUMwQTBFMzFDMTFFNDg1OEVBNjFDOTIyRDVFMkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMzI1QzA5REUzMUMxMUU0ODU4RUE2MUM5MjJENUUyQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMzI1QzA5RUUzMUMxMUU0ODU4RUE2MUM5MjJENUUyQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Przz/CIAAB6eSURBVHja7F0JsBXV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"></img>
          <span class="text">{{seller.Support[0]}}</span>
        </div>
      </div>
      <div v-if="seller.Support" class="supports-count" @click="showDetail">
        <span class="count">{{seller.Support.length}}个</span>
        <i class="icon iconfont icon-zuoyoujiantou"></i>
      </div>
    </div>
    <div class="background">
      <img :src="seller.Cover" alt="" class="" width="100%" height="100%">
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="detail" @click="hideDetail" transition="fade">
      <div class="detail-wrapper clearFix">
        <div class="detail-main">
          <h1 class="name">{{seller.Name}}</h1>
          <div class="star-wrapper">
<!--             <star :size="48" :score="seller.score"></star> -->
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item, index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="iconfont icon-cha"></i>
      </div>
    </div>
    </transition>
  </div>
</template>
<script >
export default {
  name: 'shopHeader',
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
  }
}
</script>
<style lang="scss">
.header {
  position: relative;
  color: #fff;
  overflow: hidden;
  background: rgba(7, 17, 27, 0.5);
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;
    z-index: 1;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
      }
    }
    .content {
      display: inline-block;
      font-size: 14px;
      margin-left: 16px;
      .title {
        margin: 2px 0 8px 0;
        .brand {
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }
        .name {
          font-size: 18px;
          line-height: 18px;
          font-weight: bold;
        }
      }
      .description {
        margin-bottom: 10px;
        line-height: 16px;
        font-size: 16px;
        color: #fff;
      }
      .support {
        .icon {
          position: absolute;
          bottom: 10px;
          display: inline-block;
          width: 36px;
          height: 36px;
          vertical-align: top;
          margin-right: 4px;
          background-size: 16px 16px;
          background-repeat: no-repeat;
        }
        .text {
          margin-left: 40px;
          line-height: 12px;
          font-size: 12px;
        }
      }
    }
    .supports-count {
      position: absolute;
      right: 12px;
      bottom: 14px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.2);
      text-align: content;
      .count {
        font-size: 10px;
        vertical-align: top;
      }
      .icon {
        margin-left: 2px;
        line-height: 24px;
        font-size: 10px;
      }
    }
  }
  .bulletin-wrapper {
    position: relative;
    background-color: rgba(7, 17, 27, 0.2);
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 12px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    .bulletin-title {
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }
    .bulletin-text {
      vertical-align: top;
      margin: 0 4px;
      font-size: 10px;
    }
    .icon {
      position: absolute;
      font-size: 20px;
      right: 12px;
      top: 0px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    filter: blur(10px);
  }
  .detail {
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
    -webkit-backdrop-filter: blur(10px);
    &.fade-enter-active {
      animation: bounce-in 0.5s;
    }
    &.fade-leave-active {
      animation: bounce-out 0.5s;
    }
  }
}

@-moz-keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}


@-webkit-keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}


@-o-keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}


@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}


@-moz-keyframes bounce-out {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(0);
  }
}


@-webkit-keyframes bounce-out {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(0);
  }
}


@-o-keyframes bounce-out {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(0);
  }
}


@keyframes bounce-out {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(0);
  }
}


.detail-wrapper {
  width: 100%;
  min-height: 100%;
  .detail-main {
    margin-top: 64px;
    padding-bottom: 64px;
    .name {
      line-height: 16px;
      text-align: center;
      font-size: 16px;
      font-weight: 700px;
    }
    .star-wrapper {
      margin-top: 18px;
      padding: 2px 0;
      text-align: center;
    }
    .title {
      width: 80%;
      display: flex;
      margin: 28px auto 0 auto;
      .line {
        flex: 1;
        position: relative;
        top: -6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }
      .text {
        padding: 0px 12px;
        font-size: 16px;
        font-weight: 700px;
      }
    }
    .supports {
      width: 80%;
      margin: 22px auto;
      .support-item {
        padding: 0 12px;
        font-size: 0px;
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0px;
        }
        .icon {
          display: inline-block;
        //  width: 16px;
        //  height: 16px;
          vertical-align: top;
          margin-right: 6px;
       //   background-size: 16px 16px;
          background-repeat: no-repeat;
        }
        .text {
          line-height: 12px;
          font-size: 12px;
          color: #fff;
        }
      }
    }
    .bulletin {
      width: 80%;
      height: 200px;
      margin: 22px auto;
      .content {
        padding: 0 12px;
        line-height: 24px;
        font-size: 12px;
      }
    }
  }
}

.detail-close {
  position: relative;
  width: 32px;
  height: 32px;
  margin: -64px auto 0 auto;
  clear: both;
  font-size: 32px;
}
</style>
