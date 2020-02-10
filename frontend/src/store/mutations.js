const mutations = {
  loginSuccess(state, payload) {
    state.isLogin = true;
    state.isLoginError = false;
    state.userInfo = payload;
  },
  loginError(state) {
    state.isLogin = false;
    state.isLoginError = true;
  },
  logout(state) {
    state.isLogin = false;
    state.isLoginError = false;
    state.userInfo = null;
  },
  registerSuccess(state) {
    state.isRegister = true;
    state.isRegisterError = false;
  },
  registerError(state) {
    state.isRegister = false;
    state.isRegisterError = true;
  },
  SET_CHAT(state,payload) {
    state.chats = payload;
  },
  ADD_CHAT(state, payload) {
    state.chats.push(payload);
  },
  SET_CHATLIST(state,payload) {
    state.chatList = payload;
  },
  ADD_CHATLIST(state,payload) {
    state.chatList.push(payload);
  },
  SET_USERLIST(state,payload) {
    state.userList = payload;
  },
  SET_TONICKNAME(state, payload) {
    state.toNickname = payload;
  },
  SET_PERFORMANCEID(state, payload) {
    state.performanceID  = payload;
  },
  SET_DETAILPERFORID(state,payload) {
    state.detailPerforID = payload;
  }
}

export default mutations;