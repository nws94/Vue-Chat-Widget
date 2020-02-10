const actions = {
  test() {
    this.$http.get('/test').then(ret => {
      console.log("vuex",ret);
    })
  }
}

export default actions;