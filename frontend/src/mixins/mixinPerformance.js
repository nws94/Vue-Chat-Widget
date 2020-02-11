import { VueEditor } from "vue2-editor";

export const mixinPerformance = {
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    //파일 이미지,비디오로 구분 메소드
    processFile(file,index) {
      let reader = new FileReader();
      this.performance.findIndex((item, i) => {
     
        if(index === i && file !== undefined && file !== ''){
       
          item.filename = file.name;
          if(file.type.split("/")[0] === "image"){
          
            reader.onload = (e) => {
            item.file = e.target.result;
            };
            item.filetype = "image";
          }else if(file.type.split("/")[0] === "video"){
            reader.onload = (e) => {
            item.file = e.target.result;
            };
            item.filetype= "video";
          } 
          reader.readAsDataURL(file);
        }
      })

    },
    add() {
      this.performance.push({file: '', cotent: '', filetype: '', filename: ''});
    },
    remove(index) {
      this.performance.splice(index,1);
    },
    backPerfo(){
      this.$router.push({name: "performance"});
    },
    showDialog(){
      this.dialog = true;
    }
  },
  components: {
    VueEditor
  },
}