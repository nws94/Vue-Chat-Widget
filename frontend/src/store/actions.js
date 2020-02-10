import router from '../router/index';
import VueSocketIO from 'vue-socket.io'
import Vue from 'vue';
import SocketIO from "socket.io-client";

const actions = {
  //로그인하기 위한 메소드
  login({commit,state,dispatch},loginObj) {
    this.$http.post("/login",loginObj).then((res) => {
      
      //data의 길이가 0이면 회원가입한 유저 정보가 없으므로 mutation loginError를 실행
      if(res.data.length === 0) {
        commit("loginError")
      }else {
        // 관리자만 볼 수 있는 페이지나 버튼이 있으므로 관리자이면 admin을 true로 바꿔줌
        if(res.data[0].nickname === "관리자") state.admin = true;
        //  이메일과 비밀 번호가 맞으므로 mutation loginSuccess을 실행
        commit("loginSuccess",{email: loginObj.data.email, nickname: res.data[0].nickname});

        // 채팅을 하기 위하여 유저 닉네임을 보내 소켓을 실행시킴.
        dispatch("SocketConn");
        router.push({name:'home'});
      }
    }).catch((err)=> {
      console.log(err);
    })
  },
  // 소켓이 연결되도록 하는 메소드 
  SocketConn({state}) {
    Vue.use(new VueSocketIO({
      debug: true,
      connection: SocketIO(`http://localhost:3000`
      , {
       query: {userNickname: state.userInfo.nickname}
      })
    }))
  },
  // 구글로 auth 로그인시 실행되는 메소드
  auth_login({commit,dispatch},loginObj) {
    this.$http.post("/login/auth",loginObj).then((res) => {

      //data 길이가 0이면 유저 정보가 DB에 없으므로 저장
      if(res.data.length === 0) {
        //DB에 저장하고 mutation loginSuccess 실행
        this.$http.post("/register/auth",loginObj).then((res2) => {
          commit("loginSuccess", {email: loginObj.data.email, nickname: res2.data[0].nickname});
        }).catch((err) => {
          console.log(err);
        })
      }
      //이미 유저 정보가 DB에 저장 돼있으므로 바로 loginSuccess 실행
      else {
        commit("loginSuccess",{email: loginObj.data.email,nickname: res.data[0].nickname});
      }
      //소켓 연결
      dispatch("SocketConn");

      router.push({name:'home'});
    })
  },
  //로그아웃 메소드
  logout({commit}) {
    //유저정보를 state에서 없애는 logout메소드 실행
    commit("logout");
    router.push({name: 'home'});
  },
  //회원 가입 메소드
  register({commit}, registerObj) {

    //이메일, 비밀번호, 닉네임을 입력 안했을 시 registerError를 실행.
    if(registerObj.data.email === '' || registerObj.data.password === '' || registerObj.data.nickname === '' || registerObj === ''){
      commit('registerError')
    }else {
      //유저 정보를 DB에 저장 및 registerSuccess 실행
      this.$http.post("/register",registerObj).then((res) => {
        commit("registerSuccess");
        console.log(res);
      })
      router.push({name: 'login'});
    }
  }
}

export default actions;