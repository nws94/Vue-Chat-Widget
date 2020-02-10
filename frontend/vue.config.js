module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  //backend 서버와 연동.
  devServer: {
    proxy: {
      '/*': {
        target: 'http://localhost:3000',
        changeOrigin:true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}