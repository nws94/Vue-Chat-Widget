<template>
   <v-list subheader>
      <v-subheader>User List</v-subheader>

      <v-list-item
        v-for="(user,index) of userList"
        :key="index"
      >
       

        <v-list-item-content>
          <v-list-item-title v-html="user.nickname"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon v-if="isFind">
          <v-btn text color="primary"  @click="toChatBox(user.nickname)">대화하기</v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
</template>
<script>
export default {
  name: "ChatUserList",
  props: ['userID','userList','isFind'],
  data() {
    return {
      
    }
  },
  methods: {
    toChatBox(fromID) {
      this.$emit("toChatBox",fromID);
    }
  }
}
</script>