<template>
  <v-list subheader class="pt-12">
      <v-subheader>최근 대화</v-subheader>

      <v-list-item
        v-for="(list,index) of recentChatList"
        :key="index"
        @click="toChatBox(list)"
      >
       

        <v-list-item-content v-if="list.fromNickname ===  userInfo.nickname" >
          <v-list-item-title v-html="list.toNickname+' &mdash; '+ list.chatContent"></v-list-item-title>
                   
        </v-list-item-content>
         <v-list-item-content v-else>
          <v-list-item-title v-html="list.fromNickname+' &mdash; '+ list.chatContent"></v-list-item-title>         
        </v-list-item-content>

        <v-list-item-icon class="pr-2">
          <v-icon color="indigo accent-4">mdi-comment-outline</v-icon>
        </v-list-item-icon>
       
      </v-list-item>

      
    </v-list>
</template>
<script>

export default {
  name: "ChatList",
  props: ['recentChatList','userInfo'],
  data() {
    return {
    }
  },
  methods: {
    toChatBox(list) {
      if(list.fromNickname ===  this.userInfo.nickname){
        this.$emit('toChatBox',list.toNickname);
      }else {
        this.$emit('toChatBox',list.fromNickname);
      }
        
      }
  }
}
</script>