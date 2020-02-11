<template>
<v-container align-center>
 <v-form class="mt-12 pt-4 pr-4 pl-4"
             ref="form"
            lazy-validation
            >
        <v-text-field
            label="제목"
            outlined
            v-model="title"
            dense>
        </v-text-field>
        <v-text-field
            v-model="intro"
            label="Simple Intro"
            outlined
            dense>
        </v-text-field>
        <v-card v-for="(perfo,index) in performance" :key="index">
          
          <v-file-input @change="processFile($event, index)" label="upload"></v-file-input>
          <v-img max-height="350" class="mb-5" aspect-ratio="1.7" contain v-show="perfo.filetype === 'image'" :src="perfo.file"></v-img>
          <v-flex class="text-center mb-5">
            <video v-show="perfo.filetype === 'video'" controls :src="perfo.file"></video>
          </v-flex>
          
          <vue-editor v-model="perfo.content"></vue-editor>

        <v-flex class="text-center pb-5 mb-8 mt-4">
          <v-btn class="mr-5" v-if="performance.length > 1" fab dark color="red" @click="remove(index)">
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
          <v-btn  fab dark color="teal" @click="add(index)">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          
       </v-flex>
       
     </v-card>
      
      <v-flex class="text-center">
        <v-btn width="270" color="primary" x-large @click="upload" >실적 업로드</v-btn>
      </v-flex>
      
    </v-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-alert type="success">
          업로드 완료
        </v-alert>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="backPerfo">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-container>
</template>
<script>
import { mapState} from "vuex";
import {mixinPerformance} from "../../mixins/mixinPerformance.js"

export default {
  // 공통된 메소드를 믹스인으로 불러와 씀
  mixins:[mixinPerformance],
  data() {
    return {
      title:'',
      intro: '',
      performance: [{file: '', content: '',filetype:'',filename:''}]
    }
  },
  computed: {
    ...mapState(["performanceID"])
  },
  methods: {
      upload() {
    
        this.performance.findIndex((item, i) => {
          if(i === 0) {
            //첫번째 index는 간단한 설명, 제목이 있으므로 구분해서 저장
            this.$http.post("/performance/write", {title: this.title, intro: this.intro, performance: item}).catch(err => {
              console.log(err);
            })
       
          }else {
            // performanceID를 같이 저장해야 불러올때 같이 불러 올 수 있음
            this.$http.post("/performance/addfile",{id: this.performanceID, performance: item}).catch( err => {
              console.log(err);
            })
     
          }
        })
        // 믹스인에 있는 메소드
        this.showDialog();
      },
     
  },
 
}
</script>