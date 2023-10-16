<template>
  <img :src="src" class="img" :style="{ width, height, objectFit }" @error="imgError" />
</template>

<script>
import Person from '@/assets/images/person.png'
export default {
  props: {
    src: {
      default: undefined,
    },
    width: {
      default: '100%',
    },
    height: {
      default: '100%',
    },
    objectFit: {
      default: '',
    },
  },

  data() {
    return {
      loading: false,
      error: false,
      Person: Person,
    }
  },
  mounted() {
    // this.loadImage()
  },
  methods: {
    imgError(e) {
      e.target.src = Person
    },
    name() {
      const img = document.querySelector('img')
      // 1. 监听图片的error事件
      img.onerror = (e) => {
        handleError(img, img.getAttribute('retry'))
      }

      function handleError(El, retry) {
        retry = parseInt(retry)

        // 开启一个定时器,这里每1500ms执行一次
        let timer = setTimeout(() => {
          // 如果重试次数大于3
          if (retry > 3) {
            console.log('连接失败')
            // 图片使用占位图片url
            El.src = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png' // 存在的图片地址
            // 清除定时器
            clearTimeout(timer)
          } else {
            // 重试次数在规定内
            console.log('重试次数', retry)
            // 计数器+1
            retry += 1
            El.setAttribute('retry', retry)
            El.src = 'https://www.baidu.com/img.png' //不存在的图片地址
          }
        }, 1500)
      }
    },
    loadImage() {
      // reset status
      this.loading = true
      this.error = false

      const img = new Image()
      img.onload = (e) => this.handleLoad(e, img)
      img.onerror = (e) => {
        // this.handleError.bind(this)
        this.handleError(e, img)
      }

      // bind html attrs
      // so it can behave consistently

      Object.keys(this.$attrs).forEach((key) => {
        const value = this.$attrs[key]
        img.setAttribute(key, value)
      })
      img.src = this.src
    },
    handleLoad(e, img) {
      // this.imageWidth = img.width;
      // this.imageHeight = img.height;
      this.loading = false
      this.error = false
      // console.log('handleLoad', e)
    },
    handleError(e, img) {
      this.loading = false
      this.error = true
      // img.src = Person
      img.src = 'https://img2.baidu.com/it/u=3853345508,384760633&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1200'
      console.log('handleError', e, img)
      // this.$emit('error', e)
    },
  },
}
</script>

<style lang="less" scoped>
.img {
  width: 100%;
  height: 100%;
}
</style>
