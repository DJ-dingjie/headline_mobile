<template>
  <!-- <van-button plain v-if="followed" @click="followUser" slot="default" round type="info">已关注</van-button> -->
  <van-button
    ref="btn"
    @mouseover="onMouseleave"
    @mouseout="onMouseenter"
    :loading="loadingFollowed"
    class="followed"
    @click="follow"
    v-if="followed"
    plain
    type="info"
    >已关注</van-button
  >
  <van-button
    class="no-followed"
    :loading="loadingNoFollowed"
    v-else
    @click="follow"
    slot="default"
    icon="plus"
    round
    type="info"
    >关注</van-button
  >
</template>
<script>
import { mapState } from 'vuex'
import { followUser, cancelFollowUser } from '../api/user'
export default {
  data() {
    return {
      loadingFollowed: false,
      loadingNoFollowed: false
    }
  },
  props: {
    followed: {
      type: Boolean,
      required: true
    },
    authorId: {
      type: Number,
      required: true
    }
  },
  methods: {
    async follow() {
      if (this.userinfo) {
        if (this.authorId === this.userId) {
          return this.$toast('用户不能关注自己')
        }
        let status = true
        try {
          if (this.followed) {
            // 取消关注
            this.loadingFollowed = true
            status = false
            await cancelFollowUser(this.authorId)
          } else {
            // 关注用户
            this.loadingNoFollowed = true
            status = true
            await followUser(this.authorId)
          }
          this.$emit('follow', status)
          const text = status ? '关注成功' : '取消关注'
          this.$toast.success(text)
        } catch (error) {
          console.log(error)
          this.$toast.fail('操作失败,稍后重试')
        }
        this.loadingFollowed = false
        this.loadingNoFollowed = false
      } else {
        this.$toast.fail('请先登录')
      }
    },
    onMouseleave() {
      console.log('leave')
    },
    onMouseenter() {
      console.log('enter')
    }
  },
  computed: {
    ...mapState(['userId', 'userinfo'])
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.followed {
  color: inherit !important;
  background-color: inherit !important;
}
.no-followed {
  .van-loading__circular {
    color: rgb(119, 119, 119) !important;
  }
}
</style>
