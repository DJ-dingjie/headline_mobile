<template>
  <div class="comment-item">
    <van-cell>
      <van-image slot="icon" class="avatar" round fit="cover" :src="commentItem.aut_photo" />
      <div slot="title" class="title-wrap">
        <div class="user-name">{{ commentItem.aut_name }}</div>
        <van-button
          :loading="commentItem.dianzanLoading"
          @click="likeComment(commentItem)"
          class="like-btn"
          :icon="commentItem.is_liking ? 'good-job' : 'good-job-o'"
          >{{ commentItem.like_count ? commentItem.like_count : '赞' }}</van-button
        >
      </div>

      <div slot="label">
        <p class="comment-content">{{ commentItem.content }}</p>
        <div class="bottom-info">
          <span class="comment-pubdate">{{ commentItem.pubdate | relativeTime }}</span>
          <van-button @click="reply(commentItem)" class="reply-btn">回复 {{ commentItem.reply_count }}</van-button>
        </div>
      </div>
    </van-cell>
  </div>
</template>
<script>
import { likeComment, cancelLikeComment } from '../api/comment'
import { mapState } from 'vuex'
import JSONBig from 'json-bigint'
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      total: 0,
      dianzanLoading: false
      // query: {
      //   type: 'a',
      //   source: 0,
      //   limit: 10,
      //   offset: null
      // }
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    },
    commentItem: {
      type: Object,
      required: true
    }
  },
  created() {
    // this.onLoad()
  },
  computed: {
    ...mapState(['userinfo'])
  },
  methods: {
    reply(comment) {
      this.$emit('reply-click', comment)
      console.log(comment)
      console.log(comment.com_id)
    },
    async likeComment(item) {
      item.dianzanLoading = true
      const id = JSONBig.parse(item.com_id) ? JSONBig.parse(item.com_id) : item.com_id
      if (!this.userinfo) {
        return this.$toast.fail('请先登录')
      }
      try {
        if (item.is_liking) {
          // 取消点赞
          const { data } = await cancelLikeComment(id)
          this.$toast.success('取消点赞')
          item.is_liking = false
          item.like_count--
          console.log(data)
        } else {
          // 点赞
          const { data } = await likeComment(id)
          this.$toast.success('点赞成功')
          item.like_count++
          item.is_liking = true
          console.log(data)
        }
      } catch (error) {
        this.$toast.fail('操作失败,稍后重试')
      }
      item.dianzanLoading = false
    }
  }
}
</script>
<style lang="less" scoped>
.comment-item {
  .van-cell {
    height: 240px !important;
  }
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222 !important;
    background-color: #fff !important;
    border: none;
  }
  .like-btn {
    background-color: #fff !important;
    color: #222 !important;
    width: inherit !important;
    height: inherit !important;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
