<template>
  <div class="article-detail-contain">
    <van-nav-bar ref="title" title="文章详情" left-text="" left-arrow @click-left="goback" />
    <van-loading v-if="loading" size="34px">加载中...</van-loading>
    <div class="article-detail-item" v-if="article_detail.title">
      <!-- 标题区域 -->
      <h1 class="article-title">{{ article_detail.title }}</h1>
      <!-- 作者信息区域 -->
      <van-cell center>
        <template #title>
          <div class="author-info">
            <van-image fit="cover" :src="article_detail.aut_photo" />
            <div>
              <span class="text author">{{ article_detail.aut_name }}</span>
              <span class="text time">{{ article_detail.pubdate | relativeTime }}</span>
            </div>
          </div>
        </template>
        <!-- <van-button slot="default" icon="plus" round type="info">关注</van-button> -->
        <follow-user
          @follow="article_detail.is_followed = $event"
          :authorId="article_detail.aut_id"
          :followed="article_detail.is_followed"
        ></follow-user>
      </van-cell>
      <div ref="article_content" class="article-content markdown-body " v-html="article_detail.content"></div>
      <van-divider>正文结束</van-divider>
      <van-list v-model="commentLoading" :finished="finished" finished-text="已显示全部评论" @load="onLoad">
        <article-comments
          v-for="(comment, index) in list"
          :key="index"
          :commentItem="comment"
          :articleId="article_detail.art_id"
          @reply-click="replyClick($event)"
        ></article-comments>
      </van-list>
      <div class="article-bottom">
        <van-button class="comment-btn" type="default" round size="small" @click="writeComments">写评论</van-button>
        <van-popup v-model="show" position="bottom" :style="{ height: '20%' }">
          <write-comment
            @comment="fabuComment($event)"
            @close="show = $event"
            :articleId="article_detail.art_id"
          ></write-comment>
        </van-popup>
        <!-- 或者 info="0" -->
        <van-icon @click="onClickIcon" name="comment-o" :badge="total" color="#777" />
        <collect-article
          @collect="article_detail.is_collected = $event"
          :collected="article_detail.is_collected"
          :articleId="article_detail.art_id"
        ></collect-article>
        <dianzan-article
          @liked="article_detail.attitude = $event"
          :articleId="article_detail.art_id"
          :liked="article_detail.attitude"
        ></dianzan-article>
        <van-icon @click="onClickIcon" name="share" color="#777777"></van-icon>
      </div>
      <!-- 文章评论 -->
    </div>
    <!-- 加载失败：404 -->
    <div class="error-wrap" v-else-if="status === 404">
      <van-icon name="failure" />
      <p class="text">该资源不存在或已删除！</p>
    </div>
    <!-- /加载失败：404 -->

    <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
    <div ref="error" class="error-wrap" v-if="btnClick">
      <van-icon name="failure" />
      <p class="text">内容加载失败！</p>
      <van-button @click="getArticleDetails" class="retry-btn">点击重试</van-button>
    </div>
    <!-- 回复评论弹出层 -->
    <!-- 注意：弹出层是懒渲染的，只有第一次显示时才会渲染里面的内容，即数据，第二次及其以后都只是在做弹出层的显示与影藏 -->
    <!-- 解决：在comment-detail 里 添加 v-if 依据其值动态渲染这个comment-detail组件 -->
    <van-popup v-model="isReply" position="bottom" :style="{ height: '70%' }">
      <comment-detail @close="isReply = false" :commentItem="currentComment"></comment-detail>
    </van-popup>
  </div>
</template>
<script>
import { getCommentsList } from '../api/comment'
import { getArticleDetails } from '../api/article'
import { mapMutations } from 'vuex'
import { ImagePreview } from 'vant'
import CollectArticle from './collect-article'
import DianzanArticle from './dianzan-article'
import FollowUser from './follow-user'
import ArticleComments from './article-comments'
import WriteComment from './write-comment'
import JSONBig from 'json-bigint'
import CommentDetail from './comment-detail'
export default {
  provide: function() {
    return {
      wenzhangId: this.id
      // this.article_detail.art_id
    }
  },
  props: ['id'],
  // 或者
  // props: {
  //   id: {
  //     type: [Number, String], 数组表示可能多类型
  //     required: true
  //   }
  // }
  data() {
    return {
      article_detail: {},
      status: 0,
      loading: true,
      btnClick: false,
      // 评论总数量
      total: 0,
      show: false,
      commentLoading: false,
      finished: false,
      list: [],
      query: {
        type: 'a',
        source: null,
        limit: 10,
        offset: null
      },
      isReply: false,
      // 回复评论弹出层的当前评论
      currentComment: {},
      test: ['1', '3']
    }
  },
  // 让此组件的所有后代组件都能得到这个数据
  // 在后代组件中需要使用 inject: ['article_id'] 得到
  components: {
    'collect-article': CollectArticle,
    'dianzan-article': DianzanArticle,
    'follow-user': FollowUser,
    'article-comments': ArticleComments,
    WriteComment,
    CommentDetail
  },
  methods: {
    replyClick(comment) {
      this.isReply = true
      this.currentComment = comment
    },
    async onLoad() {
      this.query.source = JSONBig.stringify(parseInt(this.id))
        ? JSONBig.stringify(parseInt(this.id))
        : parseInt(this.id)
      try {
        const { data } = await getCommentsList(this.query)
        console.log(data.data)
        const results = data.data.results
        this.total = data.data.total_count
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
    goback() {
      this.$router.back(-1)
    },
    async getArticleDetails() {
      this.loading = true
      this.btnClick = false
      try {
        const { data } = await getArticleDetails(this.id)
        console.log(this.id)
        console.log(data.data)
        this.article_detail = data.data
        // this.query.source = data.data.art_id
        console.log(this.query.source)
        //  由于数据发生变化了会导致依赖数据的视图发生变化，由于 v-if,v-else-if,v-else的存在，数据变化不会立即导致视图的变化
        // console.log(this.$refs.article_content) // undefined
        // console.log(this.$refs.title)
        // 但是可以通过异步任务来得到结果
        setTimeout(() => {
          const imgs = this.$refs.article_content.querySelectorAll('img')
          const imgSrcs = []
          imgs.forEach(img => {
            imgSrcs.push(img.src)
          })
          for (let i = 0; i < imgs.length; i++) {
            imgs[i].onclick = function() {
              ImagePreview({
                images: imgSrcs,
                startPosition: i
              })
            }
          }
        }, 0)
        // console.log(this.$refs.title) // 能得到值
        this.btnClick = false
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.status = 404
        } else {
          this.btnClick = true
        }
      }
      this.loading = false
    },
    ...mapMutations(['showActiveChannel']),
    writeComments() {
      this.show = true
    },
    onClickIcon() {
      this.$toast('点击')
      console.log('test')
      console.log(this.test)
    },
    onMouseleave() {
      console.log('leave')
    },
    onMouseenter() {
      console.log('enter')
    },
    fabuComment(eve) {
      this.list.unshift(eve)
    }
  },
  created() {
    this.getArticleDetails()
    // 因为加了loading 加载状态，所以要判断art_id 是否已有，有了才加载
    // if (this.article_detail.art_id) {
    //   console.log('id exit')
    //   this.onLoad()
    // }
    // 手动 触发 onload 时，不会开启加载状态，需要自己手动开启加载状态
    this.onLoad()
  }
}
</script>
<style lang="less" scoped>
// 在style里面导入css文件
@import './css/github-markdown.css';
.article-detail-contain {
  /deep/.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .van-loading {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }
  .van-nav-bar {
    background-color: #1989fa;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
  }
  .article-detail-item {
    margin-top: 92px;
    margin-bottom: 200px;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }
    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
    /deep/.van-cell {
      display: flex;
      justify-content: center;
      padding: 0 32px;
      height: 84px;
      .van-button {
        width: 170px;
        height: 58px;
        font-size: 14px;
        color: rgb(255, 255, 255);
        background: rgb(50, 150, 250);
        border-color: rgb(50, 150, 250);
        .van-icon-plus {
          margin-right: 2px;
        }
      }
      .author-info {
        width: 100%;
        display: flex;
        flex-direction: row;
        .van-image {
          position: relative;
          top: 4px;
          width: 70px;
          height: 70px;
          margin-right: 17px;
          .van-image__img {
            border-radius: 50% !important;
          }
        }
        div {
          display: flex;
          justify-content: center;
          // align-items: center; // 水平居中
          flex-direction: column;
          .text {
            color: #ccc;
            font-size: 12px;
          }
          .author {
            height: 48px;
            line-height: 48px;
            color: #3a3a3a;
          }
          .time {
            height: 36px;
            line-height: 36px;
          }
        }
      }
    }
  }
}
</style>
