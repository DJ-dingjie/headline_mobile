<template>
  <div class="comment-item">
    <van-nav-bar @click-right="onClickRight">
      <template #title>
        <span class="text">{{ commentItem.reply_count > 0 ? commentItem.reply_count + '条回复' : '暂无回复' }}</span>
      </template>
      <template #right>
        <van-icon class="text" name="cross" />
      </template>
    </van-nav-bar>
    <van-cell class="reply">
      <van-image slot="icon" class="avatar" round fit="cover" :src="commentItem.aut_photo" />
      <div slot="title" class="title-wrap">
        <div class="user-name">{{ commentItem.aut_name }}</div>
        <van-button
          :loading="loading"
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
          <van-button class="reply-btn">回复 {{ commentItem.reply_count }}</van-button>
        </div>
      </div>
    </van-cell>
    <van-cell title="全部回复"></van-cell>
    <!-- 展示回复列表 -->
    <van-list v-model="commentLoading" :finished="finished" finished-text="已显示全部评论" @load="onReplyLoad">
      <van-cell v-for="(item, index) in list" :key="index" class="reply">
        <van-image slot="icon" class="avatar" round fit="cover" :src="item.aut_photo" />
        <div slot="title" class="title-wrap">
          <div class="user-name">{{ item.aut_name }}</div>
          <van-button
            :loading="item.dianzanLoading"
            @click="likeComment(item)"
            class="like-btn"
            :icon="item.is_liking ? 'good-job' : 'good-job-o'"
            >{{ item.like_count ? item.like_count : '赞' }}</van-button
          >
        </div>

        <div slot="label">
          <p class="comment-content">{{ item.content }}</p>
          <div class="bottom-info">
            <span class="comment-pubdate">{{ item.pubdate | relativeTime }}</span>
            <van-button class="reply-btn">回复 {{ item.reply_count }}</van-button>
          </div>
        </div>
      </van-cell>
    </van-list>
    <van-cell style="color: red" title="后台接口有问题,得不到数据"></van-cell>
    <!-- 写评论 -->
    <van-button @click="isShowWriteBox = true" class="write-reply">回复评论</van-button>
    <van-popup v-model="isShowWriteBox" position="bottom">
      <write-comment v-if="isShowWriteBox" @comment="reply($event)" :articleId="commentItem.com_id"></write-comment>
    </van-popup>
  </div>
</template>
<script>
import { likeComment, cancelLikeComment, getCommentsList } from '../api/comment'
import { mapState } from 'vuex'
import JSONBig from 'json-bigint'
import WriteComment from './write-comment'
export default {
  components: {
    WriteComment
  },
  props: {
    commentItem: {
      type: Object,
      required: true
    }
    // type: {
    //   type: String,
    //   // 不传则就是 a 如果传了 就是 传来的值
    //   default: 'a', // 默认值
    //   // default: () => [] // 默认值，复杂数据类型
    //   // 定义验证规则
    //   validator(value) {
    //     //  value 传来的值
    //     // 表示 传回来的值 只能是 a 或者 c
    //     return ['a', 'c'].includes(value)
    //   }
    // }
  },
  data() {
    return {
      query: {
        type: 'c',
        source: 0,
        limit: 10,
        offset: null
      },
      loading: false,
      commentLoading: false,
      finished: false,
      // 回复评论
      list: [],
      isShowWriteBox: false
    }
  },
  computed: {
    ...mapState(['userinfo'])
  },
  methods: {
    onClickRight() {
      this.$emit('close')
    },
    async likeComment(item) {
      console.log(item === this.commentItem)
      if (item === this.commentItem) {
        this.loading = true
      } else {
        item.dianzanLoading = true
      }
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
      this.loading = false
      item.dianzanLoading = false
    },
    async onReplyLoad() {
      try {
        console.log(this.commentItem.com_id)
        const { data } = await getCommentsList({
          type: 'c',
          source: JSONBig.stringify(this.commentItem.com_id)
            ? JSONBig.stringify(this.commentItem.com_id)
            : this.commentItem.com_id,
          limit: 10,
          offset: this.query.offset
        })
        console.log(data.data)
        const results = data.data.results
        this.list = results
        for (let i = 0; i < results.length; i++) {
          results[i].dianzanLoading = false // 给每个点赞项添加loading状态，以便区分每个点赞项
          this.list.push(results[i])
        }
        this.commentLoading = false
        if (results.length <= 0) {
          this.finished = true
        } else {
          this.query.offset = data.data.last_id
        }
      } catch (error) {
        this.$toast.fail('获取评论失败,稍后重试')
        console.log(error)
      }
    },
    reply(eve) {
      this.list.unshift(eve)
      this.isShowWriteBox = false
      this.commentItem.reply_count++
    }
  }
}
</script>
<style lang="less" scoped>
.comment-item {
  .write-reply {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #ccc;
  }
  .van-nav-bar {
    .text {
      color: #1980fa !important;
    }
  }
  .reply {
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
