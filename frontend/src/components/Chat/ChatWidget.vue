<template>
    <div>
    <v-app-bar
          absolute
          color="blue accent-4"
          dark
          height="50"
    >
     <v-btn 
          icon 
          class="hidden-xs-only" 
          v-if="!isChatList" 
          @click="backChatBox">
            <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn 
          icon 
          class="hidden-xs-only" 
          v-else 
          @click="backMenu">
            <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title v-if="isChatList || isChatBox">채팅</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="expand && !isChatBox">
          <v-text-field
          style="width: 100px;"
           label="사용자 찾기"
           v-model="findNickname"
           color="white"
           class="pt-1"
           single-line
           v-on:keyup.enter="search()"
          ></v-text-field>
      <v-btn  @click="search()"  icon>
        <v-icon>mdi-account-search</v-icon>
      </v-btn>
        </v-toolbar-items>
         <v-toolbar-items v-else-if="!expand && !isChatBox">
          <v-btn icon @click="expandSearch()"  >
            <v-icon>mdi-account-search</v-icon>
          </v-btn>
        </v-toolbar-items>
    </v-app-bar>
    <transition name="view" >
    <ChatRecentList v-if="isChatList && !isChatBox" 
              v-bind:recentChatList="recentChatList"
              v-bind:userInfo="userInfo" 
              v-on:toChatBox="toChatBox">
    </ChatRecentList>
    <ChatUserList 
              v-else-if="!isChatList && !isChatBox" 
              v-bind:findNickname="findNickname" 
              v-bind:userList="userList" 
              v-bind:isFind="isFind" 
              v-on:search="search"
              v-on:toChatBox="toChatBox">
    </ChatUserList>
    <ChatBox v-else-if="!isChatList && isChatBox"
             >
    </ChatBox>
    </transition>


    </div>
 
</template>

<script>
import ChatRecentList from './ChatRecentList.vue'
import ChatUserList from './ChatUserList.vue'
import ChatBox from './ChatBox.vue'
import {mapState} from 'vuex'

  export default {
    name: "ChatWidget",
    data: () => ({
      expand: false,
      isChatList: true,
      isChatBox: false,
      findNickname:'',
    }),
    // 실시간으로 채팅이 오면 유저 정보를 업데이트하기 위해 setInterval메소드 사용
    created() {
      this.$store.dispatch("GET_RECENT_CHATLIST")
    },
    mounted(){
      setInterval(() => {
      
        this.$store.dispatch("GET_RECENT_CHATLIST")
      }, 3000)   
    },
    computed: {
      ...mapState(['recentChatList','userList','isFind','userInfo'])
    },
    methods: {

      expandSearch() {
        this.expand = !this.expand;
        
      },
      search() {
        if(this.isChatList){
           this.isChatList = !this.isChatList;
           this.isChatBox = false;
           this.expand = !this.expand;
        }
        this.$store.dispatch("findUser",{data: {
              findNickname: this.findNickname
              }})
      },
      toChatBox(fromNickname) {
        this.isChatBox= !this.isChatBox;
        this.isChatList = false;
        this.$store.dispatch("SET_TONICKNAME",fromNickname);
      },
      backChatBox() {
          this.expand = false;
          this.isChatList = true;
          this.isChatBox = false;
          this.$store.dispatch("GET_RECENT_CHATLIST");
      },
      backMenu() {
        this.$emit("backMenu");
      }
    },
    components: {
      ChatRecentList,
      ChatUserList,
      ChatBox,
    }
  }
</script>
<style>
  /* This is for documentation purposes and will not be needed in your application */
  .view-enter-active, .view-leave-active {
  transition: opacity 0.1s;
}
.view-leave-active {
  position: absolute;
}
.view-enter, .view-leave-to {
  opacity: 0;
}
</style>