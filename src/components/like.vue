<template>
    <div style="display:flex;overflow:wrap;width:100%;flex-flow: row wrap;">
        <div v-for="item in like" v-bind:key="item.id" >
            <img class="icon-img" :src="item.avatar"></img>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Like',
  props: {
    like: {
      type: Array,
      default: function () {
        return []
      }
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expandflag: this.expand
    }
  },
  methods: {
    expands () {
      this.expandflag = true
    },
    collapses () {
      this.expandflag = false
    }
  },
  mounted () {
    console.log(this.like)
  }
}
</script>
<style scoped>

.icon-img {
    width: .80rem;
    height: .80rem;
    border: 1px solid #007aff;
    border-radius: 100%;
    overflow: hidden;
    padding: 0.3rem auto;
}
.icon-img img{width: 100%;}
</style>