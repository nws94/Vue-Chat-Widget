<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        
        <v-list-item router :to="{name: 'performance'}">
          <v-list-item-icon>
            <v-icon>mdi-alpha-p-circle-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >실적</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

         <v-list-item router :to="{name: 'login'}" v-if="isLogin" @click="$store.dispatch('logout')">
          <v-list-item-icon>
            <v-icon>mdi-account-arrow-right</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
             <v-list-item-title >로그아웃</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item router :to="{name: 'login'}" v-if="!isLogin">
          <v-list-item-icon>
            <v-icon>mdi-account-arrow-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
             <v-list-item-title >로그인</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item router :to="{name: 'register'}"  v-if="!isLogin">
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
             <v-list-item-title >회원가입</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>OrcaSoft</v-toolbar-title>  
      <v-spacer></v-spacer>
      
      
    </v-app-bar>

    <v-content id="create">
     <router-view/>
    </v-content>
    <v-footer>
      <v-spacer></v-spacer>
      <Widget/>
      
    </v-footer>
  </v-app>
</template>

<script>

import Widget from './components/Widget/Widget.vue'
import {mapState} from 'vuex';

  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
    }),
    computed: {
      ...mapState(['isLogin'])
    },
    components: {
      Widget
    },
    created() {
      if(this.isLogin === true) {
        this.$store.dispatch("SocketConn");
      }
    }

  }
</script>