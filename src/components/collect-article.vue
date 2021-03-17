<template>
  <van-button
    :loading="loading"
    :class="{ collected: collected }"
    @click="collectArticle"
    color="#777"
    :icon="collected ? 'star' : 'star-o'"
  />
</template>
<script>
import { mapState } from 'vuex'
import { collectArticle, cancelCollectArticle } from '../api/article'
export default {
  data() {
    return {
      loading: false
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    },
    collected: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['userinfo'])
  },
  methods: {
    async collectArticle() {
      if (this.userinfo) {
        this.loading = true
        let status = null
        try {
          if (this.collected) {
            //  取消文章收藏
            await cancelCollectArticle(this.articleId)
            status = false
          } else {
            // 收藏文章
            await collectArticle(this.articleId)
            status = true
          }
          const text = status ? '收藏成功' : '取消收藏'
          this.$toast.success(text)
          // 修改父组件的数据
          this.$emit('collect', status)
        } catch (error) {
          this.$toast.fail('操作失败,稍后重试')
        }
        this.loading = false
      } else {
        this.$toast.fail('请先登录')
      }
      // van-loading__circular
    }
  }
}
</script>
<style scoped lang="less">
.van-button {
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  background-color: #fff !important;
  .van-icon-star-o {
    height: 50px;
    color: rgb(119, 119, 119);
  }
  // 设置加载状态的颜色
  .van-loading__circular {
    color: rgb(119, 119, 119);
  }
}
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
