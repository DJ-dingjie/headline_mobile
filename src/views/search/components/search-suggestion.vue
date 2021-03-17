<template>
  <div class="search-suggestion">
    <van-cell v-for="(option, index) in searchSuggestion" :key="index" @click="showContentBox(option)" icon="search">
      <template #title>
        <!-- <span v-html="option"></span> -->
        <span v-html="showActiveText(option)"></span>
      </template>
    </van-cell>
  </div>
</template>
<script>
import { getSearchSuggestions } from '../../../api/search'
// 导入lodash库，实现防抖效果
// 按需加载 debounce函数
import { debounce } from 'lodash'
export default {
  data() {
    return {
      searchSuggestion: []
    }
  },
  computed: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  methods: {
    showContentBox(q) {
      // 点击搜索建议的任何一项都会直接跳转到相关内容
      this.$emit('show_box', true, q)
    },
    showActiveText(option) {
      // 正则表达式加入变量，i 表示忽略大小写，g表示全局匹配
      const reg = new RegExp(this.q, 'gi')
      option = option.replace(reg, '<span style="color: #3296fa">' + this.q + '</span>')
      return option
    }
  },
  watch: {
    q: {
      handler: debounce(async function(val, oldval) {
        if (val !== oldval && val !== '') {
          try {
            const { data } = await getSearchSuggestions(this.q)
            this.searchSuggestion = data.data.options
          } catch (error) {}
        }
      }, 200),
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.search-suggestion {
  margin-top: 112px;
  .active {
    color: blue;
  }
  .no-active {
    .no-color {
      color: inherit;
    }
  }
}
</style>
