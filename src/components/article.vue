// 这是文章列表组件，每一个频道都对应一个组件（article组件），并且这个article组件在每个频道之间的数据互相独立， //
有多少个频道就会创建多少个article组件
<template>
  <div class="article">
    <van-pull-refresh
      :success-text="successOrErrorText"
      success-duration="1500"
      v-model="refreshing"
      @refresh="onRefresh"
    >
      <van-list
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.title" /> -->
        <article-list-item v-for="(item, index) in list" :key="index" :article="item"></article-list-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getCurrentChannelList } from '../api/channel'
import ArticleList from './articleList'
export default {
  components: {
    'article-list-item': ArticleList
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      // 获取当前频道的文章列表所需要的参数
      quary: {
        channel_id: this.channel_id,
        with_top: 0,
        timestamp: Date.now()
      },
      error: false,
      refreshing: false,
      // 刷新失败或成功的文本
      successOrErrorText: '刷新成功'
    }
  },
  // 父组件向子组件传递数据需要用到 props
  // props: ['channel_id', 'channel_name']
  // 第二种写法
  props: {
    channel_name: {
      type: String,
      required: true
    },
    channel_id: {
      type: Number
    }
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getCurrentChannelList(this.quary)
        // 将获得到的文章列表存储到list中，一个一个存储进去
        for (let i = 0; i < data.data.results.length; i++) {
          this.list.push(data.data.results[i])
        }
        // 测试加载失败
        // if (Math.random() > 0.2) {
        //   JSON.parse('123423r')
        // }
        // 加载状态结束
        this.loading = false
        // 判断数据全部加载完
        if (data.data.results.length <= 0) {
          this.finished = true
        } else {
          // 改变时间戳，再次执行 onLoad 时  则会获取不一样的内容
          this.quary.timestamp = data.data.pre_timestamp
        }
      } catch (error) {
        // 获取文章失败
        this.error = true
        // 关闭 下拉刷新的状态
        this.loading = false
      }
    },
    async onRefresh() {
      try {
        const { data } = await getCurrentChannelList(this.quary)
        for (let i = 0; i < data.data.results.length; i++) {
          this.list.unshift(data.data.results[i])
        }
        this.loading = false
        if (data.data.results.length <= 0) {
          this.finished = true
        } else {
          this.quary.timestamp = data.data.pre_timestamp
        }
        // 关闭加载
        this.refreshing = false
        this.successOrErrorText = `刷新成功,更新了${data.data.results.length}条内容`
      } catch (error) {
        this.refreshing = false
        this.successOrErrorText = '刷新失败'
      }
    }
  }
}
</script>
<style lang="less" scoped>
// 设置记住滚动条位置
.article {
  // vw 可视窗口的宽度的 百分之一
  height: 79vh; // vh 可视窗口高度的 百分之一
  overflow-y: auto;
}
</style>
