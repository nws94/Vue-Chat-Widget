<template>
  <v-container align-center>
 <v-form class="mt-12 pt-4 pr-4 pl-4"
             ref="form"
            lazy-validation
            >
        <v-text-field
            label="제목"
            outlined
            v-model="performance[0].title"
            dense>
        </v-text-field>
        <v-text-field
            v-model="performance[0].intro"
            label="Simple Intro"
            outlined
            dense>
        </v-text-field>
        <v-card v-for="(perfo,index) of performance" :key="index">
          
          <v-file-input @change="processFile($event, index)" label="upload"></v-file-input>
          <v-img max-height="350" class="mb-5" aspect-ratio="1.7" contain v-show="perfo.filetype === 'image'" :src="perfo.file"></v-img>
          <v-flex  class="text-center mb-5">
            <video class="container" v-show="perfo.filetype === 'video'" controls :src="perfo.file"></video>
          </v-flex>
          
          <vue-editor v-model="perfo.content"></vue-editor>

        <v-flex class="text-center pb-5 mb-8 mt-4">
          <v-btn class="mr-5" v-if="performance.length > 1 && index !== 0" fab dark color="red" @click="remove(index,perfo.addID)">
            <v-icon dark>mdi-minus</v-icon>
          </v-btn>
          <v-btn  fab dark color="teal" @click="add(index)">
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
          
       </v-flex>
       
     </v-card>
      
      <v-flex class="text-center">
        <v-btn width="270" color="primary" x-large @click="edit" >Edit</v-btn>
      </v-flex>
      
    </v-form>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-alert type="success">
          수정 완료
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
import {mixinPerformance} from "../../mixins/mixinPerformance.js"
import {mapState} from 'vuex';

export default {
  // 공통된 메소드를 믹스인으로 불러와 씀
  mixins:[mixinPerformance],
  data() {
    return {
      performance: [{title:''}],
      addfile: [],
      delete: []
    }
  },
  // 수정전 기존의 데이터를 보여주기 위해 created에 가장먼저 보여지도록 구현
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
  methods: {
      remove(index,addID) {
        //수정을 눌렀을때 삭제할 데이터를 지워야하므로 delete 변수에 임시 저장
        this.delete.push({addID: addID});
        this.performance.splice(index,1);
      },
      edit() {
        if(this.delete.length !== 0) {
          for(let item of this.delete) {
            this.$http.delete(`/performance/addfile/${item.addID}`);
          }
        }

        this.performance.findIndex((item, i) => {
          if(i === 0) {
            // 첫번째는 설명, 제목도 같이 있으므로 구분해서 저장
            this.$http.post("/performance/update", item).catch(err => {
              console.log(err);
            })
       
          }else {
            //원래 있던 데이터 수정하는게 아니라 새로 추가했을 때는 insert 해줌
            if(item.addID === undefined || item.addID === '' || item.addID === null) {
              this.$http.post("/performance/addfile",{id: this.detailPerforID, performance: item}).catch(err => {
              console.log(err);
            })
            }else {
              // 원래 있던 데이터를 수정
              this.$http.post("/performance/addfile/update",item).catch(err => {
                console.log(err);
              })
            }
          }
        })
        //믹스인에 있는 메소드
         this.showDialog();
      },
  },
  computed: {
    ...mapState(['detailPerforID'])
  }

}
</script>