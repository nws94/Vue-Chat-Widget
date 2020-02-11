<template>
   <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-btn v-show="admin" dark color="teal" router :to="{name: 'performance-edit', params:{id: this.detailPerforID}}">edit</v-btn>
        <v-row
          align="center"
          justify="center"
        >
        
          <v-col
            cols="12"
            sm="8"
            md="7"
          >
         
          <h1 class="text-center">{{performance[0].title}}</h1>
  
          </v-col>
          <v-col cols="12"
            sm="8"
            md="7"
            v-for="(item,index) of performance"
            :key="index">
          <video v-show="item.filetype==='video'" controls :src="item.file"></video>
          <v-img v-show="item.filetype==='image'" :src="item.file"></v-img>
          <div v-html="item.content">
          </div>
         </v-col>
        </v-row>
    </v-container>
   </v-content>
</template>
<script>
import {mapState} from 'vuex'

export default {
  
  data() {
    return {
      performance: [{title:''}],
      addfile: [],
    }
  },
  created() {
    this.$http.get(`/performance/${this.detailPerforID}`).then((res) => {
          this.performance = [res.data[0]];
  
    });

    this.$http.get(`/performance/addfile/${this.detailPerforID}`).then((res) => {
      this.addfile = res.data;

      for(let item of this.addfile){
        
        this.performance.push(item);
    
      }
    })
  },
  computed: {
    ...mapState(['admin','detailPerforID'])
  },
}
</script>