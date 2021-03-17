<template>
  <div class="search-history">
    <van-cell center title="搜索历史">
      <template #right-icon>
        <van-icon @click="isDel = false" v-if="isDel" class="open-close color" name="delete-o" />
        <div v-else class="color">
          <span @click="delAllHistorys" class="first">全部删除</span>
          <span @click="isDel = true">完成</span>
        </div>
      </template>
    </van-cell>
    <van-cell @click="showContentBox(history)" v-for="(history, index) in historys" :key="index" center>
      <template #title>
        <span>{{ history }}</span>
      </template>
      <template #right-icon>
        <van-icon v-if="!isDel" class="color del" name="close" />
      </template>
    </van-cell>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 是否可以删除搜索历史
      isDel: true
    }
  },
  props: {
    // 用户搜索历史
    // props 里面的数据
    // 1. 如果是普通数据（数字，字符串，布尔值）是不允许修改的，即使修改了也不会传给父组件，父组件的数据也不会变
    // 2. 如果是复杂数据类型（数组，对象），可以修改，如  数组.push，但是不能重新赋值
    historys: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 删除用户搜索的所有历史
    delAllHistorys() {
      this.$emit('delAll')
    },
    // 子组件改变父组件的数据
    showContentBox(history) {
      if (this.isDel) {
        this.$emit('show_content_box', true, history)
      } else {
        const index = this.historys.findIndex(item => {
          return item === history
        })
        // console.log(index)
        // this.$toast(history)
        this.historys.splice(index, 1)
      }
    }
  },
  created() {}
}
</script>
<style lang="less" scoped>
.search-history {
  margin-top: 112px;
  .van-cell {
    .first {
      margin-right: 10px;
    }
    .color {
      color: rgb(150, 151, 153);
    }
    .open-close {
      top: -6px;
    }
    .del {
      top: -4px;
    }
    div.color {
      top: -4px;
    }
  }
}
</style>
