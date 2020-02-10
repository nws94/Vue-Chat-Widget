<template>
  <v-container fill-height style="max-width:450px;">
    <v-layout align-center row wrap>
      <v-flex xs12>
        <v-alert :value="isRegisterError" type="error">
          아이디와 비밀번호,이름을 모두 입력해주세요.
        </v-alert>
        <v-alert :value="isRegister" type="success">
          로그인이 완료되었습니다.
        </v-alert>
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>회원가입</v-toolbar-title>
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
            <v-text-field
              v-model="nickname"
              type="text"
              label="이름을 입력하세요."
            ></v-text-field>
            <v-btn large block depressed color="primary" @click="register({
              data: {
                email: email,
                password: password,
                nickname: nickname
              }
            })">회원가입</v-btn>
          </div>
          
        </v-card>      
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      nickname: ''
    }
  },
  computed: {
    ...mapState(["isRegister","isRegisterError"])
  },
  methods: {
    ...mapActions(['register'])

  }
}
</script>