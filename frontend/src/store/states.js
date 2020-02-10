import google from '../../google.json'

const state = {
  params: {
    client_id : google.params.client_id
  },
  isLogin: false,
  isLoginError: false,
  isRegister: false,
  isRegisterError: false,
  isFind: false,
  userInfo: null,
  toNickname: null,
  message: '',
  chats: null,
  recentChatList: null,
  userList: null,
  performanceID: null,
  detailPerforID: null,
  admin: false,
}
export default state;