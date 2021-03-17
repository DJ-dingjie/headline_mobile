<template>
  <van-button
    :class="{ liked: liked === 1 }"
    :loading="loading"
    @click="dianzan"
    :icon="liked === 1 ? 'good-job' : 'good-job-o'"
  />
</template>
<script>
import { cancelLike, likeArticle } from '../api/article'
import { mapState } from 'vuex'
export default {
  methods: {
    async dianzan() {
      if (this.userinfo) {
        this.loading = true
        let status = 0
        try {
          if (this.liked === 1) {
            // 则取消点赞
            await cancelLike(this.articleId)
            status = -1
          } else {
            // 点赞
            await likeArticle(this.articleId)
            status = 1
          }
          // 提示文本
          const text = status === 1 ? '点赞成功' : '取消点赞'
          this.$toast.success(text)
          // 更新父组件的数据，以便更新视图
          this.$emit('liked', status)
        } catch (error) {
          this.$toast.fail('操作失败,稍后重试')
        }
        this.loading = false
      } else {
        this.$toast.fail('请先登录')
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  props: {
    liked: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  computed: {
    ...mapState(['userinfo'])
  }
}
</script>
<style lang="less" scoped>
.van-button {
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  .van-icon-good-job-o {
    height: 50px;
    color: rgb(119, 119, 119);
  }
}
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
