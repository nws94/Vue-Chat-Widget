<template>
    <v-menu
          v-model="menu"
          :close-on-content-click="false"
          top
          offset-y  
    >
      <template v-slot:activator="{ on }">

        <v-btn
          color="indigo"
          fab
          dark
          v-on="on"
        >
           <v-icon v-if="!menu" large>mdi-comment-question-outline</v-icon>
           <v-icon v-else>mdi-close</v-icon>
        </v-btn>
         <!-- </v-badge> -->
      </template>

      <v-card  
          max-width="300"
          width='300'
          height='500'
          max-height="500"
          
          class="mb-50 overflow-hidden">
          <v-container fill-height grid-list-md text-xs-center v-if="!isChat && !isEmail">
            <v-layout row wrap align-center>
              <v-flex class="text-center" v-if="isLogin">
                    <v-badge
                  v-if="cnt != 0"
                  color="indigo accent-4"
                  :content="cnt"
              
                  right>
                <v-btn class="float-left"   color="primary" x-large @click="goChat()"><v-icon>mdi-chat</v-icon>채팅</v-btn>
                </v-badge>
                <v-btn v-else class="float-left"   color="primary" x-large @click="goChat()"><v-icon>mdi-chat</v-icon>채팅</v-btn>
                <v-btn class="float-right "  color="success"  x-large @click="goEmail()"><v-icon>mdi-email-edit-outline</v-icon>이메일</v-btn>
              </v-flex>
              <v-flex class="text-center" v-else>
                 <v-btn color="success"  x-large  @click="goEmail()"><v-icon>mdi-email-edit-outline</v-icon>이메일</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <ChatWidget v-on:backMenu="backMenu" v-else-if="isChat && !isEmail"/>
          <EmailWidget v-on:backMenu="backMenu" v-else/>
      </v-card>
    </v-menu>
 
</template>

<script>

  import ChatWidget from '../Chat/ChatWidget.vue'
  import EmailWidget from '../Email/EmailWidget.vue'
  import {mapState} from 'vuex';
  
  export default {
    name: "Widget",
    data: () => ({
      menu: false,
      isChat: false,
      isEmail: false,
      cnt:0
    }),
    watch: {
      menu: function(data) {
        if(!data) {
          this.isChat = false;
          this.isEmail = false;
        }
      }
    },
     created() {
      //만약 로그인 돼었다면 실시간으로 안읽은 채팅 개수를 보여줌
      if(this.isLogin === true){
        setInterval(() => {

            this.$http.get(`/allUnread/${this.userInfo.nickname}`).then((ret) =>{
            
                this.cnt = ret.data[0].unread;
            }).catch(err => {
              console.log(err);
            })
        }, 3000)
      }
    },
    computed: {
      ...mapState(['isLogin','userInfo'])
    },
    methods: {
      goChat(){
        this.isChat = true;
        this.isEmail = false;
      },
      goEmail() {
        this.isChat = false;
        this.isEmail = true;
      },
      backMenu() {
        this.isChat = false;
        this.isEmail = false;
      }
    },
      components: {
        ChatWidget,
        EmailWidget
      }

  }
</script>
<style>

</style>