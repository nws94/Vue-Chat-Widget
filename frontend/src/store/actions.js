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
        if(res.data[0].nickname === "admin") state.admin = true;
        else state.admin = false;
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
  auth_login({commit,dispatch,state},loginObj) {
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
      state.admin = false;
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
      }).catch((err) => {
        console.log(err);
      })
      router.push({name: 'login'});
    }
  },
  //상대방과 대화한 대화들을 가져오는 메소드
  async GET_CHAT({state, commit}) {
    //자신의 닉네임과 상대방 닉네임을 backend 서버로 보내 대화를 가져와 state chats에 저장하는 mutation 실행.
    let chats = await this.$http.get(`/chat/${state.userInfo.nickname}/${state.toNickname}`);
    commit("GET_CHAT",chats.data);
  },
  //최근 대화한 유저 닉네임 및 대화한 글 리스트를 가져오는 메소드
  async GET_RECENT_CHATLIST({state,commit}) {
    let recentChatList = await this.$http.get(`/chat/${state.userInfo.nickname}`);
    commit("GET_RECENT_CHATLIST",recentChatList.data);
  },
  //상대방에게 메세지를 보냈을때 state에 저장하는 메소드
  ADD_CHAT({commit},payload) {
    commit("ADD_CHAT", payload);
  },
  //최근 대화한 유저 닉네임 및 대화한 글 리스트를 state에 저장하는 메소드
  ADD_RECENT_CHATLIST({commit},payload) {
    commit("ADD_RECENT_CHATLIST",payload);
  },
  // 상대방 닉네임을 state에 저장하는 메소드
  SET_TONICKNAME({commit}, payload) {
    commit("SET_TONICKNAME", payload);
  },
  // 상대방을 찾는 메소드
  findUser({commit,state},findObj) {
    //자기 자신은 빼고 상대방만 찾기위하여 자신의 닉네임과 상대방 닉네임을 Backend 서버로 보냄.
    this.$http.get(`/userfind/${findObj.data.findNickname}/${state.userInfo.nickname}`).then((res) => {
      // data 길이가 0이라면 찾는 사용자가 없으므로 state를 변경
      if(res.data.length === 0) {
        commit("isFindError",{0: {nickname: "사용자를 찾을 수 없습니다."}})
      } 
      // 유저 리스트를 state에 저장
      else {
        commit("isFind",res.data)
      }
    })
  },
  //실적 리스트 id를 가져오는 메소드
  GET_PERFORMANCEID({commit}) {
    this.$http.get("/performance/id").then((res) => {
      let id = res.data[0].id;
      if(res.data[0].id === null){
        id = 0;
      }
      commit("GET_PERFORMANCEID",id+1);
    }).catch((err) => {
      console.log(err);
    })
  },
  //실적 리스트에 상세 페이지 데이터를 가져오는 메소드
  SET_DETAILPERFORID({commit},payload) {
    commit("SET_DETAILPERFORID",payload)
  }
  
}

export default actions;