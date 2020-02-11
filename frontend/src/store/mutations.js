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
  GET_CHAT(state,payload) {
    state.chats = payload;
  },
  ADD_CHAT(state, payload) {
    state.chats.push(payload);
  },
  GET_RECENT_CHATLIST(state,payload) {
    state.recentChatList = payload;
  },
  ADD_RECENT_CHATLIST(state,payload) {
    state.recentChatList.push(payload);
  },
  SET_USERLIST(state,payload) {
    state.userList = payload;
  },
  SET_TONICKNAME(state, payload) {
    state.toNickname = payload;
  },
  GET_PERFORMANCEID(state, payload) {
    state.performanceID  = payload;
  },
  SET_DETAILPERFORID(state,payload) {
    state.detailPerforID = payload;
  },
  isFind(state, payload) {
    state.userList = payload;
    state.isFind = true;
  },
  isFindError(state, payload) {
    state.userList = payload;
    state.isFind = false;
  }
}

export default mutations;