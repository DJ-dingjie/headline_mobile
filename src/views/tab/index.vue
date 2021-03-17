<template>
  <div class="tab-contain">
    <div>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </div>
    <!-- route 表示开启路由模式，此时active已被无效，以路由的地址为依据 -->
    <van-tabbar route v-model="active">
      <van-tabbar-item to="/home" name="home" icon="home-o">
        <span>主页</span>
        <template #icon>
          <i class="iconfont iconshouye"> </i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa" name="qa" icon="search">
        <span>问答</span>
        <template #icon> <i class="iconfont iconwenda"> </i> </template>
      </van-tabbar-item>
      <van-tabbar-item to="/vedio" name="vedio" icon="friends-o">
        <span>视频</span>
        <template slot="icon">
          <i class="iconfont iconshipin"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my" name="my" icon="setting-o">
        <span>{{userinfo ? '我的' : '未登录'}}</span>
        <template slot="icon">
          <i class="iconfont iconwode"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapState(['userinfo'])
  }
}
</script>
<style lang="less" scoped>
.tab-contain {
  .van-tabbar {
    .van-tabbar-item {
      .iconfont {
        font-size: 40px;
      }
      span {
        font-size: 20px;
      }
    }
  }
}
</style>
