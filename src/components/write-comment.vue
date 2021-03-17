<template>
  <div class="write-comment">
    <van-field border v-model="message" rows="3" autosize type="textarea" placeholder="请输入内容" />
    <van-button @click="comment" :disabled="isDisabled">发布</van-button>
  </div>
</template>
<script>
import JSONBig from 'json-bigint'
import { commentArticle } from '../api/comment'
export default {
  data() {
    return {
      message: '',
      isDisabled: true
    }
  },
  inject: {
    wenzhangId: {
      type: [String, Number, Object],
      default: null
    }
  }, // 也可以向 props那样写数据
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  methods: {
    async comment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0 // 为 0 就是持续展示，具体数值则是 多少毫秒
      })
      const id = JSONBig.stringify(this.articleId)
      console.log(this.articleId.toString())
      console.log(this.wenzhangId)
      const nullOrArticleId = this.articleId.toString() === this.wenzhangId ? null : this.wenzhangId
      console.log(nullOrArticleId)
      // 或者  this.articleId.toString()
      try {
        const { data } = await commentArticle({
          target: id,
          content: this.message,
          // 如果对文章评论就不需要传递这个参数，如果对回复评论则需要添加此参数
          art_id: nullOrArticleId
        })
        this.$toast.success('评论成功')
        this.message = ''
        this.$emit('close', false)
        const newComment = data.data.new_obj
        newComment.dianzanLoading = false
        this.$emit('comment', newComment)
        console.log(data)
        console.log(data.data.new_obj)
      } catch (error) {
        this.$toast.fail('评论失败,稍后重试')
      }
    }
  },
  watch: {
    message: function() {
      if (this.message.trim().length > 0) {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.write-comment {
  margin: 20px 0;
  display: flex !important;
  padding: 0 30px !important;
  justify-content: space-between !important;
  align-items: center !important;
  .van-field {
    background-color: #f5f7f9 !important;
    height: 230px !important;
  }
  .van-button {
    margin-left: 20px;
    width: 140px;
    font-size: 28px;
    padding: 0;
    background-color: #fff;
    border: none;
    color: #1989fa;
  }
  .van-button--default {
    background-color: #fff !important;
  }
}
</style>
