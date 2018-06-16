<template>
<div class="comment" >

  <div class="header">
    <div class="row">
      <div class="col col-20">
        <img class="avatar" :src="comment.avatar?comment.avatar:'/static/default.jpg'">
      </div>
      <div class="col title">
        <div>{{comment.owner}}</div>
        <div>{{comment.starttime}}</div>
      </div>
    </div>
  </div>

  <div class="content">
    <p>
      {{comment.comment}}
    </p>
  </div>

</div>
</template>

<script>

export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped lang="scss">
@import "../../style.scss";

$notice-color: #919191;
$notice-font-size:0.30rem;

.expandcomment {
  margin: 0.30rem 0rem;
}

.collapsecomment {
  margin: 0.30rem 0.30rem;
}

.comment {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  -webkit-transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
  transition: box-shadow .28s cubic-bezier(.4,0,.2,1);
  will-change: box-shadow;
  display: block;
  position: relative;
 /* padding: 0.24rem; */
  border-radius: 2px;
  font-family: Roboto,Helvetica Neue,sans-serif;
  font-size: $common-font-size;
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

      .comment-visitor{
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
    .full-image {
      width: 100%
    }
    p {
      padding: 0 0.24rem 0.24rem 0.24rem;
      margin: 0 0 0.24rem 0;
    }
  }

  .footer {
    .mint-button{
      font-size:$notice-font-size;
    }
    
    padding: 0 0 0.24rem 0;

  }
}
</style>