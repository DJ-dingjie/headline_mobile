<template>
  <div class="user-edit">
    <van-nav-bar title="个人信息" left-text="返回" left-arrow @click-left="goback" />
    <van-cell is-link class="first-cell" title="头像">
      <template #default>
        <div class="touxiang">
          <!-- 也可以用input:file 点击图片时触发input：file 点击事件, 通过属性· files 获得选中的图片 -->
          <!-- 通过 window.URL.createObjectURL 将图片转换为 url 地址 -->
          <van-uploader :after-read="updateImage">
            <van-image fit="cover" round :src="user.photo" />
            <van-popup v-model="showImage" position="bottom" :style="{ height: '100%' }">
              <update-image
                @update-photo="user.photo = $event"
                @complete="showImage = $event"
                @close="showImage = $event"
                :img="imgURL"
              ></update-image>
            </van-popup>
          </van-uploader>
        </div>
      </template>
    </van-cell>
    <van-cell is-link title="昵称">
      <template #default>
        <span @click="openShowName">{{ user.name }}</span>
        <van-popup v-model="showName" position="bottom" :style="{ height: '100%' }">
          <van-nav-bar
            title="设置昵称"
            left-text="取消"
            right-text="确认"
            @click-left="closeShowName"
            @click-right="updateName"
          />
          <van-field
            :class="{ text: username.length >= 10 }"
            v-model="username"
            rows="1"
            autosize
            type="textarea"
            maxlength="10"
            placeholder="请输入昵称"
            show-word-limit
          />
        </van-popup>
      </template>
    </van-cell>
    <van-cell is-link title="性别">
      <template #default>
        <span @click="showGender = true" v-text="user.gender ? '女' : '男'"></span>
        <van-popup v-model="showGender" position="bottom" :style="{ height: '40%' }">
          <van-picker @confirm="updateGender" @cancel="closeShowGender" title="性别" show-toolbar :columns="columns" />
        </van-popup>
      </template>
    </van-cell>
    <van-cell is-link title="生日">
      <template #default>
        <span @click="showBirthday = true">{{ user.birthday }}</span>
        <van-popup v-model="showBirthday" position="bottom" :style="{ height: '40%' }">
          <van-datetime-picker
            @confirm="updateBirthday"
            @cancel="closeShowBirthday"
            :max-date="new Date()"
            type="date"
            title="选择年月日"
          />
        </van-popup>
      </template>
    </van-cell>
    <van-cell style="color:red" title="注意：后台接口有问题,无法修改用户资料"></van-cell>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getPersonalData, updatePersonalData } from '../../api/user'
import UpdateImage from './components/update-image'
export default {
  data() {
    return {
      user: {},
      showBirthday: false,
      showGender: false,
      showName: false,
      showImage: false,
      columns: ['男', '女'],
      username: '',
      imgURL: null
    }
  },
  components: {
    UpdateImage
  },
  methods: {
    goback() {
      this.$router.back(-1)
    },
    async getPersonalData() {
      try {
        const { data } = await getPersonalData(this.userId)
        console.log(data.data)
        this.user = data.data
      } catch (error) {}
    },
    // 打开设置昵称框
    openShowName() {
      this.showName = true
      this.username = this.user.name
    },
    // 关闭设置昵称框
    closeShowName() {
      this.showName = false
    },
    // 更新名字
    async updateName() {
      try {
        const name = this.username
        const { data } = await updatePersonalData({
          name
        })
        console.log(data.data)
        this.$toast.success('更新成功')
        this.user.name = name
      } catch (error) {
        this.$toast.fail('更新失败,稍后重试')
      }
      this.showName = false
    },
    // 更新头像
    updateImage(file) {
      // console.log(file)
      const fileURL = window.URL.createObjectURL(file.file)
      console.log(fileURL)
      this.imgURL = fileURL
      console.log(this.imgURL)
      this.showImage = true
    },
    // 关闭设置性别框
    closeShowGender() {
      this.showGender = false
    },
    // 更新性别
    async updateGender(value) {
      const gender = value === '男' ? 0 : 1
      try {
        const { data } = await updatePersonalData({
          gender
        })
        console.log(data)
        this.user.gender = gender
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败,稍后重试')
      }
      this.showGender = false
    },
    // 关闭设置出生日期框
    closeShowBirthday() {
      this.showBirthday = false
    },
    // 更新出生日期
    async updateBirthday(value) {
      let birthday = new Date(value)
      const year = birthday.getFullYear()
      const month = birthday.getMonth() + 1 < 10 ? '0' + (birthday.getMonth() + 1) : birthday.getMonth() + 1
      const day = birthday.getDate() < 10 ? '0' + birthday.getDate() : birthday.getDate()
      birthday = year + '-' + month + '-' + day
      try {
        await updatePersonalData({
          birthday
        })
        this.user.birthday = birthday
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败,稍后重试')
      }
      this.showBirthday = false
      console.log('value')
      console.log(value)
      console.log(birthday)
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {
    this.getPersonalData()
  }
}
</script>
<style lang="less" scoped>
.user-edit {
  .van-nav-bar {
    background-color: #3296fa;
  }
  .first-cell {
    height: 100px;
    .van-icon {
      top: 6px;
    }
  }
  .van-cell {
    .touxiang {
      .van-image {
        width: 60px;
        height: 60px;
      }
    }
  }
  /deep/.text {
    .van-field__value {
      .van-field__word-limit {
        .van-field__word-num {
          color: red;
        }
      }
    }
  }
}
</style>
