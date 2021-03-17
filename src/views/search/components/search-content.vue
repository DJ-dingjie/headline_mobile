<template>
  <div class="search-content">
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(list, index) in lists" :key="index" :title="list.title"></van-cell>
    </van-list>
  </div>
</template>
<script>
import { getSearchRes } from '../../../api/search'
export default {
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      lists: [],
      query: {
        q: this.text,
        page: 1,
        per_page: 12
      }
    }
  },
  props: {
    text: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getSearchRes(this.query)
        // 将获得到的文章列表存储到list中，一个一个存储进去
        for (let i = 0; i < data.data.results.length; i++) {
          this.lists.push(data.data.results[i])
        }
        // 加载状态结束
        this.loading = false
        if (data.data.results.length <= 0) {
          this.finished = true
        } else {
          // 改变页码，获取下一页的内容
          this.query.page = this.query.page + 1
        }
      } catch (error) {
        // 获取内容失败，显示失败文本
        this.error = true
        // 关闭 下拉刷新的状态
        this.loading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.search-content {
  margin-top: 112px;
}
</style>
