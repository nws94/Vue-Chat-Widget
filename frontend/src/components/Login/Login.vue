<template>
  <v-container fill-height style="max-width:450px;">
    <v-layout align-center row wrap>
      <v-flex xs12>
        <v-alert :value="isLoginError" type="error">
          이메일와 비밀번호를 확인해주세요.
        </v-alert>
        <v-alert :value="isLogin" type="success">
          로그인이 완료되었습니다.
        </v-alert>
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>로그인</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-text-field
              v-model="email"
              type="email"
              label="이메일을 입력하세요."
            ></v-text-field>
            <v-text-field
              v-model="password"
              type="password"
              label="패스워드를 입력하세요."
            ></v-text-field>
            <v-btn large block depressed color="primary" @click="login({
              data: {
                email: email,
                password: password
              }
            })">로그인</v-btn>
            <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess">구글 로그인</GoogleLogin>

          </div>
          
        </v-card>      
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import {  mapState,mapActions} from "vuex";
import GoogleLogin from  'vue-google-login'
export default {
  data() {
    return {
      email: '',
      password: '',
      message:'',
      isError: false,
      loginSuccess: false,
       renderParams: {
                    width: 400,
                    height: 50,
                    longtitle: true
                },
                
    }
  },
  computed: {
    ...mapState(["isLogin","isLoginError","params"])
  },
  created() {
    console.log(this.params);
  },
  methods: {
    
    ...mapActions(["login"]),

    onSuccess(googleUser) {
          let nickname = '',
                email = '';

          if( googleUser.getBasicProfile().U3 === undefined) {
             nickname = googleUser.getBasicProfile().Au.split('@')[0],
             email = googleUser.getBasicProfile().Au;
          }else {
             nickname = googleUser.getBasicProfile().U3.split('@')[0],
             email = googleUser.getBasicProfile().U3;
          }
          //google login이 성공하면 data를 auth_login으로 보냄.
          this.$store.dispatch("auth_login",{data: {
             email: email,
             nickname: nickname
            }
           })

          
        }

  },
  components: {
          GoogleLogin
      }
}
</script>