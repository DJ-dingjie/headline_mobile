<template>
  <div class="search-contain">
    <form class="form" action="/">
      <van-search
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        show-action
        v-model="searchText"
        background="#4fc08d"
        placeholder="请输入搜索关键词"
      >
      </van-search>
    </form>
    <!-- 搜索历史 -->
    <search-history
      :historys="userAddHistory"
      @show_content_box="showContentBox"
      @delAll="userAddHistory = []"
      v-if="!searchText && !isContent"
    ></search-history>
    <!-- 搜索建议 -->
    <search-suggestion :q="searchText" @show_box="showContentBox" v-if="searchText && !isContent"></search-suggestion>
    <!-- 搜索内容 -->
    <search-content :text="searchText" v-if="isContent"></search-content>
  </div>
</template>
<script>
import searchContent from './components/search-content'
import searchHistory from './components/search-history'
import searchSuggesion from './components/search-suggestion'
import { setItem, getItem } from '../../utils/localStorage'
export default {
  data() {
    return {
      // 输入框的内容，也可以用来判断是否显示历史框或者建议框
      searchText: '',
      // 是否显示搜索内容
      isContent: false,
      // 用户搜索的历史
      userSearchHistory: [],
      // 添加用户搜索历史或用户的搜索历史
      userAddHistory: getItem('TOUTIAO_SEARCH_HISTORYS')
    }
  },
  watch: {
    // 监听searchText的变化，当它为空的时候显示搜索历史
    searchText: function(val, oldval) {
      if (val === '') {
        this.isContent = false
      }
    },
    // 监听用户搜索历史数组的变化，只要发生变化就将它存储到本地存储中
    userAddHistory: function(val, oldval) {
      setItem('TOUTIAO_SEARCH_HISTORYS', val)
    }
  },
  components: {
    'search-content': searchContent,
    'search-history': searchHistory,
    'search-suggestion': searchSuggesion
  },
  methods: {
    // 用户敲击回车后触发，得到用户搜索的结果
    onSearch(q) {
      // 不添加重复的历史记录
      if (this.userAddHistory.includes(q)) {
        const index = this.userAddHistory.findIndex(item => {
          return item === q
        })
        this.userAddHistory.splice(index, 1)
      }
      this.userAddHistory.unshift(q)
      this.isContent = true
    },
    // 在点击搜索框右侧取消按钮时触发
    onCancel() {
      this.$router.back(-1)
    },
    // van-search 获得焦点的时候触发
    onFocus() {
      // 获得焦点只显示搜索建议框关闭内容框
      this.isContent = false
    },
    // 当用户点击搜索建议后显示搜索内容
    // 或者当用户啥也不点击直接点击之前的历史记录
    showContentBox(e, q) {
      // 不添加重复的历史记录
      if (this.userAddHistory.includes(q)) {
        const index = this.userAddHistory.findIndex(item => {
          return item === q
        })
        this.userAddHistory.splice(index, 1)
      }
      this.userAddHistory.unshift(q)
      this.searchText = q
      this.isContent = e
    }
  },
  created() {}
}
</script>
<style lang="less" scoped>
.search-contain {
  .form {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 999;
    .van-search {
      background-color: #5aa1e6 !important;
      .van-search__action {
        color: #fff;
      }
    }
  }
}
</style>
