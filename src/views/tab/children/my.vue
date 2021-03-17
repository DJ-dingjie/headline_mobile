<template>
  <div class="my-contain">
    <!-- <div class="header login"></div> -->
    <div v-if="!userinfo" class="header not-login">
      <!-- 登录注册按钮 -->
      <div class="login-btn" @click="$router.push('/login')">
        <img src="../../../assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <div v-if="userinfo" class="header user-info">
      <div class="base-info">
        <div class="user-head-portrait-name">
          <van-image fit="cover" round :src="user.photo" />
          <span class="name">{{ user.name }}</span>
        </div>
        <div class="edit-user-info">
          <van-button class="editing-userinfo" size="mini" round to="/user-edit">编辑用户资料</van-button>
        </div>
      </div>
      <div class="data-status">
        <div class="data-list">
          <span class="count">{{ user.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-list">
          <span class="count">{{ user.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-list">
          <span class="count">{{ user.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-list">
          <span class="count">{{ user.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <van-grid :column-num="2" clickable>
      <van-grid-item>
        <template #icon>
          <i class="iconfont iconshoucang"></i>
        </template>
        <template slot="text">
          <span>收藏</span>
        </template>
      </van-grid-item>
      <van-grid-item>
        <template #icon>
          <i class="iconfont iconlishi"></i>
        </template>
        <template #text>
          <span>历史</span>
        </template>
      </van-grid-item>
    </van-grid>
    <van-cell-group>
      <van-cell center title="消息通知" is-link />
      <van-cell center title="小智同学" is-link />
      <van-cell v-if="userinfo" @click="logout" class="login-out" title="退出登录" clickable></van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getUserinfo } from '@/api/user'
export default {
  data() {
    return {
      // 存储用户的信息
      user: {}
    }
  },
  computed: {
    ...mapState(['userinfo'])
  },
  methods: {
    ...mapMutations(['setUserId']),
    logout() {
      // 弹框组件
      this.$dialog
        .confirm({
          title: '确认退出吗'
        })
        .then(() => {
          // 删除 token 和 vuex 里面的数据 userinfo
          this.$store.commit('setUserinfo', null)
          this.$store.commit('setUserId', null)
        })
        .catch(() => {})
    },
    async getUserinfoList() {
      try {
        const { data } = await getUserinfo()
        console.log(data.data)
        this.user = data.data
        this.setUserId(data.data.id)
        console.log(this.user)
      } catch (error) {
        console.log(error)
      }
    }
  },
  created() {
    // 如果用户登录成功了，才加载
    if (this.userinfo) {
      this.getUserinfoList()
    }
  }
}
</script>
<style lang="less" scoped>
.my-contain {
  .header {
    height: 361px;
    background-image: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    .login-btn {
      // 解决 justify-content: center 不起作用：设置高度
      height: 100%;
      display: flex;
      // 让盒子里面的元素垂直排列
      flex-direction: column;
      // 设置水平垂直居中
      align-items: center; //  水平居中
      justify-content: center;
      img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        color: #fff;
        font-size: 28px;
      }
    }
  }
  .user-info {
    .edit-user-info {
      .editing-userinfo {
        position: relative;
        top: 20px;
      }
    }
    .data-status {
      height: 130px;
      display: flex;
      .data-list {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        .count {
          font-size: 40px;
        }
        .text {
          font-size: 28px;
        }
      }
    }
    .base-info {
      display: flex;
      justify-content: space-between;
      align-content: center;
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      .user-head-portrait-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .van-image {
          height: 132px;
          width: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 35px;
          color: #fff;
        }
      }
    }
  }
  .van-grid {
    .van-grid-item {
      height: 141px;
      i.iconshoucang {
        color: #eb5253;
      }
      i.iconlishi {
        color: #ff9d1d;
      }
      i.iconfont {
        font-size: 45px;
      }
      span {
        font-size: 28px;
      }
    }
  }
  .van-cell-group {
    .login-out {
      text-align: center;
      color: red;
    }
  }
}
</style>
