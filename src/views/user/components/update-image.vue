<template>
  <div class="update-image">
    <div class="image">
      <img ref="img" class="img" :src="img" alt="" />
    </div>
    <div class="bottom-btn">
      <span @click="onCancel" class="btn">取消</span>
      <span @click="updateImage" class="btn">完成</span>
    </div>
  </div>
</template>
<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '../../../api/user'
export default {
  props: {
    img: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cropper: null
    }
  },
  mounted() {
    // 获得 DOM 元素
    const image = this.$refs.img
    console.log(1)
    console.log(image)
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false
    })
    console.log(this.cropper)
  },
  methods: {
    onCancel() {
      this.$emit('close', false)
    },
    updateImage() {
      console.log(this.cropper)
      this.$emit('complete', false)
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续展示
        })
        try {
          // 错误的用法
          // 如果接口要求 Content-Type 是 application/json
          // 则传递普通 JavaScript 对象
          // updateUserPhoto({
          //   photo: blob
          // })

          // 如果接口要求 Content-Type 是 multipart/form-data
          // 则你必须传递 FormData 对象
          const formData = new FormData()
          formData.append('photo', blob)

          const { data } = await updateUserPhoto(formData)

          // 关闭弹出层
          this.$emit('complete', false)
          // 更新视图
          this.$emit('update-photo', data.data.photo)
          console.log(data)
          this.$toast.success('更新成功')
        } catch (err) {
          this.$toast.fail('更新失败')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.update-image {
  position: relative;
  background-color: black;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .image {
    width: 100%;
    margin-top: 750px;
    transform: translateY(-320px);
    .img {
      width: 100%;
      display: block;
    }
  }
  .bottom-btn {
    // position: absolute; // 会影响 display: flex
    position: fixed;
    left: 0;
    right: 0;
    bottom: 20px;
    display: flex;
    padding: 0 30px;
    justify-content: space-between;
    .btn {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
