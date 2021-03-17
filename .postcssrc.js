module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      // rootValue: 37.5,
      // lib-flexible 的 REM 适配方案：把一行分为 10 份，每份就是十分之一
      // 所以 rootValue 应该设置为你的设计稿宽度的十分之一
      // 我们的设计稿是 750，所以应该设置为 750 / 10 = 75
      // 但是 Vant 建议设置为 37.5，为什么？因为 Vant 是基于 375 写的
      //   如果是 Vant 的样式，就按照 37.5 来转换
      //   如果是 我们自己 的样式，就按照 75 来转换
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的样式属性
      // * 代表所有属性
      propList: ['*'],
      // 设置不需要经过 postcss插件转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
