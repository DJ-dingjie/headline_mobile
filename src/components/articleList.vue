<template>
  <div class="article-list-item">
    <!-- :label="article.aut_name + ' ' + article.comm_count + '评论' + article.pubdate" -->
    <van-cell @click="openArticleDetail">
      <div slot="title" class="title">{{ article.title }}</div>
      <template slot="label">
        <div v-if="article.cover.images.length === 3" class="article-images">
          <van-image fit="cover" v-for="(img, index) in article.cover.images" :key="index" :src="img"></van-image>
        </div>
        <div>
          <span class="text" v-text="article.aut_name"></span>
          <span class="text" v-text="article.comm_count + '评论'"></span>
          <span class="text">{{ article.pubdate | relativeTime }}</span>
        </div>
      </template>
      <template slot="default">
        <van-image fit="cover" v-if="article.cover.images.length === 1" :src="article.cover.images[0]" />
      </template>
    </van-cell>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    openArticleDetail() {
      // console.log(this.article)
      this.$router.push(`/article/${this.article.art_id}`)
      // 或者在 van-cell 中添加to属性，后面直接接路由地址
      // 或者to属性也可以一个放对象
      // {
      //   name: 路由名字,
      //   params: {
      //     路由动态参数名称: 值
      //   }
      // }
    }
  },
  computed: {},
  created() {}
}
</script>
<style lang="less" scoped>
.article-list-item {
  .van-cell {
    font-size: 32px;
    color: #3a3a3a;
    .title {
      // 设置文本只有两行超出显示省略号或者也可以使用 vant 来设置
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
    }
    // .van-cell__title {.}
    .van-cell__value {
      flex: unset;
      width: 232px;
      height: 146px;
      padding-left: 25px;
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .article-images {
      padding: 30px 0;
      display: flex;
      .van-image {
        flex: 1;
        height: 146px;
        // 表示不选中 van-image 类的最后一个元素，&  表示的就是 父级
        &:not(:last-child) {
          padding-right: 4px;
        }
      }
    }
    .text {
      margin-right: 25px;
    }
  }
}
</style>
