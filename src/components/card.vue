<template>
<div :class="{ expandCard: expandflag,collapseCard:! expandflag}" class="card" >

  <div class="header">
    <div class="row">
      <div class="col col-20">
        <img class="avatar" :src="card.avatar?card.avatar:'/static/default.jpg'">
      </div>
      <div class="col title">
        <b>{{card.title}}</b>
        <div>{{card.role}} {{card.starttime}}</div>
      </div>
      <div class="card-visitor">
        <i class="ion-person-stalker"></i>{{card.visitors?card.visitors.length:0}}
      </div>
    </div>
  </div>

  <div class="content">
    <img class="full-image" :src="card.cover">
    <p>
      {{content}}
    </p>
    <div v-if="card.subcontents && expandflag">
      <div v-for="sub in card.subcontents">
        <img class="full-image" :src="sub.illustration">
        <p >
          {{sub.content}}
        </p>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="row">
      <div class="col col-20">
        <div v-if="(card.description.length|0) > 60">
          <mt-button v-if="!expandflag" size="large" @click="expandCard">
            <i class="ion-ios-arrow-down"></i>
            展开
          </mt-button>
          <mt-button v-else size="large" @click="collapseCard">
            <i class="ion-ios-arrow-up"></i>
            收起
          </mt-button>
        </div>
      </div>
      <div class="col">            
        
      </div>
      <div class="col col-20">
        <mt-button size="large" @click="likeDone?null:addlike()">
          <div>
            <i v-if="!likeDone" class="ion-ios-heart-outline" ></i>
            <i v-else class="ion-ios-heart"></i>
            <span v-if="expandflag">赞</span>
            {{card.likes?card.likes.length:0}} 
          </div>
        </mt-button>
      </div>
      <div class="col col-20">
        <mt-button size="large" @click="commentButtonClick">
          <i class="ion-ios-list-outline"></i>
          <span v-if="expandflag">评论</span>
          {{card.comments.length}}
        </mt-button>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Util from '../libs/util.js'

export default {
  name: 'Card',
  props: {
    card: {
      type: Object,
      default: function () {
        return {}
      }
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  data () {
    return {
      expandflag: this.expand
    }
  },
  computed: {
    content: function () {
      return (this.card.description.length > 60 && !this.expandflag) ? this.card.description.substr(0, 60) + '...' : this.card.description
    },
    user () {
      return this.$store.getters.userlocal
    },
    likeDone: function () {
      console.log(this.card, 'likeDone')
      return this.card.likes ? this.card.likes.find(l => l.id === this.user.id) : null
    }
  },
  methods: {
    expandCard () {
      this.expandflag = true
    },
    collapseCard () {
      this.expandflag = false
    },
    commentButtonClick () {
      this.$emit('comment-button', this.card)
    },
    addlike () {
      let people = {}
      people.id = this.user.id
      people.nickname = this.user.nickname
      people.avatar = this.user.avatar
      if (!this.card.likes) {
        this.card.likes = []
      }
      if (!this.card.likes.find(f => f.id === this.user.id)) {
        Util.ajax.put('/like', {
          id: this.card.id,
          likes: [people]
        }).then(res => {
          console.log(res)
          this.$emit('update:card', res.data.data)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import "../../style.scss";

.expandCard {
  margin: 0.30rem 0rem;
}

.collapseCard {
  margin: 0.30rem 0.30rem;
}

.card {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  -webkit-transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
  will-change: box-shadow;
  display: block;
  position: relative;
 /* padding: 0.24rem; */
  border-radius: 2px;
 /* font-family: Roboto,Helvetica Neue,sans-serif; */
  /* margin: 0.30rem 0.30rem; */
  text-align:left;
  overflow: hidden;
  .header {
    padding: 0.24rem 0.24rem 0 0.24rem;

    .row{
      .col{
        .avatar{
          background-size: cover;
          width: 1.20rem;
          height: 1.20rem;
          border-radius: 50%;
        }
      }
      
      .title {
        line-height:0.60rem;
        font-size:$notice-font-size;
      }

      .card-visitor{
        font-size:$notice-font-size;
        color:$notice-color;
        text-align:right;
        float: right;
      }

    }
    .avatar{
 
    }

  }

  .content {  
    white-space: pre-line;
    font-size: $common-font-size;
    .full-image {
      width: 100%
    }
    p {
      padding: 0.24rem;
      margin: 0 0 0.24rem 0;
    }
  }

  .footer {
    .mint-button{
      font-size:$notice-font-size;
      color:$primary-color;
    }
    
    padding: 0 0 0.24rem 0;

  }
}
</style>