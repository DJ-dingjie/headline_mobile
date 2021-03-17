<template>
  <div class="contain">
    <van-nav-bar title="登录" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template slot="left"><van-icon name="cross"/></template>
    </van-nav-bar>
    <van-form @submit="login" ref="formRef">
      <van-field
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
      >
        <!-- 使用作用域插槽显示字体图标 -->
        <template slot="left-icon">
          <i class="iconfont iconshouji"></i>
        </template>
      </van-field>
      <van-field
        autocomplete="new-password"
        type="number"
        maxlength="6"
        :rules="userFormRules.code"
        v-model="user.code"
        name="code"
        placeholder="请填写验证码"
      >
        <template slot="left-icon">
          <i class="iconfont iconyanzhengma"></i>
        </template>
        <template #button>
          <!-- .prevent 阻止默认行为 -->
          <van-button v-if="!isdisabled" size="small" type="primary" @click.prevent="countDown"
            >发送验证码</van-button
          >
          <van-button class="time-count" v-if="isdisabled" disabled size="small" type="primary">{{
            time + 's'
          }}</van-button>
        </template>
      </van-field>
      <div class="login-btn">
        <van-button square block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <div class="tips">
      <div class="tips-text">万能账号:13911111111 验证码:246810</div>
    </div>
    <!-- <div>
      <van-button square type="info">点击</van-button>
      <van-count-down :time="1000 * 10" format="ss s" />
    </div> -->
  </div>
</template>
<script>
// 导入 请求模块 两种方式
// import { login } from '../../api/user'
import { login, getCode } from '@/api/user'
export default {
  data() {
    return {
      // 禁用按钮
      isdisabled: false,
      // 定时器
      time: 60,
      // 表单数据
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 表单验证
      userFormRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机格式不正确' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      }
    }
  },
  methods: {
    // 开启计时器
    async countDown() {
      // 先检验手机号码是否合理
      try {
        await this.$refs.formRef.validate('mobile')
      } catch (error) {
        return
      }
      // 发送验证码
      try {
        await getCode(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        if (error.response.status === 404) {
          this.$toast('手机号不正确')
          return
        } else if (error.response.status === 429) {
          this.$toast('操作频繁')
          return
        }
      }
      this.isdisabled = !this.isdisabled
      // 开启计时器
      const timer = setInterval(() => {
        this.time--
        if (this.time < 0) {
          // 开启按钮
          this.isdisabled = !this.isdisabled
          // 清除计时器
          clearInterval(timer)
          // 让time 重新等于 60
          this.time = 60
        }
      }, 1000)
    },
    onClickLeft() {
      this.$router.back(-1)
    },
    onClickRight() {},
    // 登录提交
    async login() {
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续时间，默认为2000毫秒，如果为 0 则一直显示
      })
      // 默认形参 values 就是用户在表单填入的信息
      // try catch 用于处理同步任务
      try {
        const { data } = await login(this.user)
        this.$toast.success('登陆成功')
        // 将用户登录成功后的权限信息存储到 vuex 的 userinfo 变量中
        this.$store.commit('setUserinfo', data.data)
        this.$router.push('/layout')
      } catch (error) {
        // error.response 是调用接口时失败返回的对象
        if (error.response.status === 400) {
          this.$toast.fail('手机号格式不正确或验证码失效')
        } else {
          this.$toast.fail('登陆失败请稍后再试')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.contain {
  .van-nav-bar {
    background-color: #1989fa;
  }
  .van-field {
    display: flex;
    align-items: center;
    .iconfont::before {
      font-size: 37px;
    }
    .time-count {
      width: 100px;
      font-size: 30px !important;
    }
  }
  .login-btn {
    padding: 53px 33px;
    opacity: 0.5;
  }
  .tips {
    display: flex;
    background-color: #ccc;
    margin-left: 33px;
    margin-right: 33px;
    // box-sizing: border-box;
    justify-content: center;
    .tips-text {
      font-size: 30px !important;
      color: black;
    }
  }
}
</style>
