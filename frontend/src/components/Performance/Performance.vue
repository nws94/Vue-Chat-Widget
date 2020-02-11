<template>
   <v-container align-center>
     <h2>사용 사례 <v-btn v-show="admin" dark color="teal" router :to="{name: 'performance-write'}">글 작성</v-btn></h2>
    <v-data-iterator
      :items="performance"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer>
    

      <template v-slot:default="props">
        <v-row  v-for="(item,index) of props.items"
            :key="index"
            align="center" 
            justify="center"
            @click="goDetail(index)"
            align-center
           >
          <v-col > 
          
          <v-hover
            v-slot:default="{ hover }"
            open-delay="200" 
            style="cursor:pointer">
            <v-card :elevation="hover ? 16 : 2"  >
              <v-row>
                <v-col cols="5">
              <v-img
                aspect-ratio="2"
                contain
                :src="item.file"
                >
              </v-img>
            
                </v-col>
              <v-col cols="7">
                <h3 class="display-1 font-weight-light --text mb-2">{{item.title}}</h3>
                <div class="mb-2 pr-5" style="font-size:14pt">
                {{item.intro}}
                </div>
                
              </v-col>
              </v-row>
              <div class="d-flex align-end justify-end pr-5">
                  {{item.uploadTime.split('T')[0]}}
              </div>
            </v-card>
          </v-hover>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer>
         <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </template>
    </v-data-iterator>
   
  </v-container>
</template>
<script>
import {mapState} from 'vuex'

export default {
   data: () => ({
      page: 1,
      pageCount: 1,
      itemsPerPage: 5,
      performance: [],
    }),
    created() {
      //DB에 저장된 실적 리시트를 불러옴
      this.$http.get("/performance").then((res) => {
        this.performance = res.data;
        //pagination를 위하여 리스트의 길이로 계산
        let pagecount = this.performance.length/5;

        if(Number.isInteger(pagecount) ){
          this.pageCount = pagecount;
        }else {
          this.pageCount = parseInt(pagecount) +1;
        }
      })
    },

    computed: {
      ...mapState(['admin'])
    },

    methods: {
      goDetail(index) {
        let id = '';

        if(this.page > 1 ) {
          id =  (this.page-1)*5 + (index+1);
          this.$store.dispatch("SET_DETAILPERFORID",id);
          this.$router.push({name: "performance-detail"})
          
        }else {
          id = (index+1);
          this.$store.dispatch("SET_DETAILPERFORID",id);
          this.$router.push({name: "performance-detail"})
        }
      }
    }
}
</script>