<template>
  <div class="home-contain">
    <van-nav-bar fixed>
      <template #title>
        <van-button to="/search" class="search" icon="search" size="small" round plain hairline type="info">
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" animated swipeable>
      <van-tab v-for="(channel, index) in channelList" :key="index" :title="channel.name">
        <article-list :channel_id="channel.id" :channel_name="channel.name"></article-list>
      </van-tab>
      <!-- 右侧内容 -->
      <div slot="nav-right" class="empty"></div>
      <div slot="nav-right">
        <i @click="openPopup" class="iconfont icongengduo"></i>
        <!-- 弹出层 -->
        <van-popup
          closeable
          close-icon-position="top-left"
          position="bottom"
          v-model="isShowPopup"
          :style="{ height: '100%' }"
        >
          <van-cell class="edit-cell" :border="false" center title="我的频道">
            <template #default>
              <van-button @click="isShowClear = !isShowClear" size="small" hairline round plain type="danger">{{
                isShowClear ? '完成' : '编辑'
              }}</van-button>
            </template>
          </van-cell>
          <van-grid direction="horizontal" class="my-channel" :border="false">
            <van-grid-item
              @click="delOrTriggerChannel(index, channel)"
              v-for="(channel, index) in channelList"
              :key="index"
            >
              <!--  -->
              <span slot="text" :class="{ active: active === index ? true : false }" class="my-channel-name">{{
                channel.name
              }}</span>
              <template #icon>
                <van-icon v-if="isShowClear && !fixedMyChannelId.includes(channel.id)" class="clear" name="clear" />
              </template>
            </van-grid-item>
          </van-grid>
          <van-cell :border="false" center title="频道推荐"> </van-cell>
          <van-grid class="channel-recommendation" direction="horizontal" :border="false">
            <van-grid-item
              @click="addMyChannel(index, value)"
              v-for="(value, index) in recommendationChannelList"
              :key="index"
            >
              <template #text>
                <span class="recome-channel-name">{{ value.name }}</span>
              </template>
              <template #icon>
                <van-icon class="plus" name="plus" />
              </template>
            </van-grid-item>
          </van-grid>
        </van-popup>
      </div>
    </van-tabs>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getUserLabelChannels, getAllLabelChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { setItem, getItem } from '../../../utils/localStorage'
// 导入 文章列表组件
import Article from '@/components/article'
export default {
  components: {
    'article-list': Article
  },
  data() {
    return {
      active: 0,
      // 当前用户频道列表
      channelList: [],
      // 是否展示popup弹出层
      isShowPopup: false,
      // 是否显示频道的删除图标
      isShowClear: false,
      // 全部列表
      allChannels: [],
      // 我的频道固定列表不可删除
      fixedMyChannelId: [0]
    }
  },
  watch: {
    active: function() {
      this.showActiveChannel(this.active)
    }
  },
  computed: {
    ...mapState(['userinfo', 'activeChannel']),
    // 推荐频道列表
    recommendationChannelList() {
      // 数组相减去掉重复的项
      const recommendationChannelList = []
      for (let i = 0; i < this.allChannels.length; i++) {
        for (let j = 0; j < this.channelList.length; j++) {
          if (this.allChannels[i].id === this.channelList[j].id) {
            break
          }
          if (recommendationChannelList.includes(this.allChannels[i])) {
          } else {
            if (j === this.channelList.length - 1) {
              recommendationChannelList.push(this.allChannels[i])
            }
          }
        }
      }
      return recommendationChannelList
    }
  },

  // 获取频道列表
  methods: {
    ...mapMutations(['showActiveChannel']),
    // 获取全部频道列表
    async getAllLabelChannels() {
      try {
        const { data } = await getAllLabelChannels()
        // 全部列表
        this.allChannels = data.data.channels
      } catch (error) {}
    },
    // 获取当前用户的频道列表
    async getUserLabelChannels() {
      if (this.userinfo) {
        try {
          const { data } = await getUserLabelChannels()
          this.channelList = data.data.channels
        } catch (error) {
          this.$toast('获取频道失败')
        }
      } else {
        console.log('未登录')
        if (getItem('TOUTIAO_CHANNELS').length > 0) {
          this.channelList = getItem('TOUTIAO_CHANNELS')
        } else {
          try {
            const { data } = await getUserLabelChannels()
            this.channelList = data.data.channels
            console.log('未登录')
            setItem('TOUTIAO_CHANNELS', this.channelList)
          } catch (error) {
            this.$toast('获取频道失败')
          }
        }
      }
    },
    // 打开弹出层
    openPopup() {
      // alert('弹出层')
      this.isShowPopup = true
      this.getAllLabelChannels()
    },
    // 删除我的频道或者切换频道，后端接口有问题
    async delOrTriggerChannel(index, channel) {
      if (this.userinfo) {
        if (this.isShowClear) {
          if (this.fixedMyChannelId.includes(channel.id)) {
            return this.$toast({
              message: '不可删除',
              position: 'top'
            })
          }
          try {
            const { data } = await deleteUserChannel(channel.id)
            console.log(data)
          } catch (error) {
            this.$toast('删除失败')
          }
          if (this.active === index) {
            this.active -= 1
          }
        } else {
          this.active = index
          this.isShowPopup = false
        }
      } else {
        this.channelList.splice(index, 1)
        // 因为没有登录所有将频道数据存到 localStorage 中
        setItem('TOUTIAO_CHANNELS', this.channelList)
      }
    },
    // 添加我的频道，后端接口有问题
    async addMyChannel(i, channel) {
      if (this.userinfo) {
        try {
          const { data } = await addUserChannel({
            id: channel.id,
            seq: this.channelList.length - 0
          })
          this.getUserLabelChannels()
          console.log(data)
        } catch (error) {
          this.$toast('添加失败,稍后重试')
        }
      } else {
        this.channelList.push(channel)
        // 因为没有登录所有将频道数据存到 localStorage 中
        setItem('TOUTIAO_CHANNELS', this.channelList)
      }
    }
  },
  created() {
    this.getUserLabelChannels()
    this.active = this.activeChannel
  }
}
</script>
<style lang="less" scoped>
.home-contain {
  padding-top: 92px;
  .search {
    background-color: #5babfb;
    color: #fff;
  }
  .van-nav-bar {
    background-color: #1989fa;
    .van-button {
      width: 555px;
      height: 64px;
      font-size: 30px;
    }
  }
  /deep/ .van-tabs {
    .van-tabs__wrap {
      // 这是一个标签导航栏，如果不设置left和right，由于加了fixed定位，则标签导航栏不会动
      position: fixed;
      left: 0;
      right: 0;
      z-index: 2;
    }
    .van-tabs__content {
      box-sizing: border-box;
      padding-top: 92px;
      padding-bottom: 100px;
    }
    .van-tab {
      // 去除 flex
      flex-shrink: 0 !important;
      width: 200px;
      height: 88px;
      padding: 0 10px;
    }
    .iconfont {
      position: fixed;
      width: 66px;
      height: 82px;
      font-size: 32px;
      background-color: rgba(255, 255, 255, 0.902);
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0;
    }
    .empty {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
      background-color: rgba(255, 255, 255, 0.902);
      color: rgba(255, 255, 255, 1);
    }
    .van-tabs__nav {
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    // 弹出层样式
    .van-popup {
      .my-channel-name,
      .recome-channel-name {
        font-size: 26px;
        white-space: nowrap;
      }
      .active {
        color: red;
      }
      padding: 85px 0;
      box-sizing: border-box;
      .edit-cell {
        .van-button {
          width: 104px;
          height: 48px;
        }
      }
      .channel-recommendation {
        .van-grid-item {
          margin-top: 10px;
          height: 90px;
          overflow: hidden;
          .van-grid-item__content {
            .van-grid-item__icon-wrapper {
              top: -4px;
              position: relative;
            }
            box-sizing: border-box;
            margin-left: 10px;
            margin-right: 10px;
            background-color: #f4f5f6;
          }
          .plus {
            margin-right: 5px;
          }
          .van-icon-plus {
            font-size: 10px;
          }
        }
      }
      .my-channel {
        .van-grid-item {
          position: relative;
          margin-top: 10px;
          overflow: hidden;
          height: 90px;
          .van-grid-item__content {
            box-sizing: border-box;
            margin-left: 10px;
            margin-right: 10px;
            background-color: #f4f5f6;
            .van-grid-item__icon-wrapper {
              position: inherit; // 清除浮动
              .clear {
                z-index: 10;
                position: absolute;
                right: 4px;
                top: 0;
                font-size: 32px;
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
