<template>
   <v-list subheader   
      class="overflow-y-auto pt-12" 
      max-height="500">
     

      <v-list-item
                    v-for="(chat,index) of this.chats"
                    :key="index">

        <v-list-item-content v-if="isMyID(chat.fromNickname)">
           <v-list-item-subtitle><v-chip  color="primary" class="float-right" >{{chat.chatContent}}</v-chip></v-list-item-subtitle>
        </v-list-item-content>
      <v-list-item-content v-else>
         <v-list-item-title>{{chat.fromNickname}}</v-list-item-title>
          <v-list-item-subtitle><v-chip    class="float-left" >{{chat.chatContent}}</v-chip></v-list-item-subtitle>
      </v-list-item-content>

      </v-list-item>
      <v-divider></v-divider>
     <v-text-field
            v-model="chatContent"
             class="scroll-to-me pt-6"
            :append-outer-icon="chatContent ? 'mdi-send' : 'mdi-send'"
            autofocus

            clear-icon="mdi-close-circle"
            clearable
            label="Message"
            type="text"
            @click:append-outer="sendMessage"
            v-on:keyup.enter="sendMessage"
            @click:clear="clearMessage"
          ></v-text-field>
    </v-list>
    
</template>
<script>
import {mapState} from 'vuex'

export default {
    data: () => ({
      chatContent: '',      
    }),
   async mounted() {
     
     await this.$store.dispatch("GET_CHAT");
       this.scrollToElement();
    },
    created(){
      
    },
    computed: {
      ...mapState(['userInfo','chats'])
    },
    sockets : {
      chat(data){
        this.$store.dispatch("ADD_CHAT",data[data.length-1]);
        this.scrollToElement();
      
      }
    },
    methods: {
      
      async sendMessage () {
        let toNickname = this.$store.getters.TONICKNAME,
            fromNickname = this.$store.state.userInfo.nickname;
        if(this.chatContent){
          let chat = {
            fromNickname: fromNickname,
            toNickname: toNickname,
            chatContent: this.chatContent
          }
         await  this.$socket.emit('chat', chat);
          this.chatContent = "";
          this.scrollToElement();
        }
      },
      clearMessage () {
        this.chatContent = ''
      },
     
      scrollToElement() {
        const el = this.$el.getElementsByClassName('scroll-to-me')[0];

        if (el) {
          el.scrollIntoView();
        }
      },
      isMyID(id) {
        if(this.userInfo.nickname === id){
          return true
        }else {
          return false
        }
      }
        
    },
  
  }
</script>