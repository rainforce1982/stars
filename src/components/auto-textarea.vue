<template>
  <div class="auto-textarea-wrapper">
    <pre class="auto-textarea-block" :class="{}" :style="maxHeight"><br/>{{temp_value}} </pre>
    <textarea 
    :autofocus="s_autofocus" 
    @keyup="change" 
    spellcheck="false"  
    :placeholder="placeholder" 
    v-model="temp_value" 
    :class="{'no-border': !border , 'no-resize': !resize}" 
    class="auto-textarea-input" >
      </textarea>
  </div>
</template>

<script>
export default {
  name: 'autoTextarea',
  data () {
    return {
      temp_value: (() => {
        return this.value
      })(),
      s_autofocus: (() => {
        if (this.autofocus) {
          return 'autofocus'
        } else {
          null
        }
      })()
    }
  },
  created () {
  },
  computed: {
    maxHeight () {
      const maxHeight = {maxHeight: (0.46 * this.rows) + 'rem'}
      return this.rows ? maxHeight : null
    }
  },
  props: {
    autofocus: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: 0
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    resize: {
      type: Boolean,
      default: false
    },
    onchange: {
      type: Function,
      default: null
    }
  },
  methods: {
    change ($event) {
      if (this.onchange) {
        this.onchange(this.temp_value, $event)
      }
    }
  },
  watch: {
    value: function (val, oldVal) {
      this.temp_value = val
    },
    temp_value: function (val, oldVal) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
@import "../../style.scss";
  .auto-textarea-wrapper{

    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    line-height: normal;
    .auto-textarea-block{
      display: block;
      white-space: pre-wrap;
      word-wrap: break-word !important;
      visibility: hidden;
      overflow: hidden;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-size: 100%;
    }
    .auto-textarea-input{

      font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;
      overflow-y: hidden;
      color: #2C3E50;
      font-size: $common-font-size;
      &.no-border{
        outline: 0 none;
        border: none !important;
      }
      &.no-resize{

        resize: none;
      }
    }
  }
</style>
