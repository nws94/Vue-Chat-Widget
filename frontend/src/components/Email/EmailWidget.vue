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
          @click="backMenu">
            <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>이메일 문의</v-toolbar-title>

      
    </v-app-bar>
  
    <v-form class="mt-12 pt-4 pr-4 pl-4"
             ref="form"
            v-model="valid"
            lazy-validation
            >
        <v-text-field
            v-model="subject"
            label="제목"
            name="subject"
            :rules="subjectRules"
            outlined
            dense>
        </v-text-field>
        <v-text-field
        v-model="email"
        :rules="emailRules"
        
        label="E-mail"
        name="email"
        outlined
        required
        dense>
      </v-text-field>
      
      <v-textarea
        v-model="content"
        label="문의하실 내용을 적어주세요."
        name="content"
        counter
        :rules="contentRules"
        required
        maxlength="120"
        full-width
        outlined>
      </v-textarea>
      <div class="mb-6">
        <v-chip style="width: 190px;">{{files.name}}</v-chip>
        <v-btn class="float-right" @click="openFile()"><v-icon>mdi-folder-upload-outline</v-icon></v-btn>
        <input v-show="false" id="inputFile" type="file" @change="processFile($event)"/>
      </div>
      <v-btn width="270" color="primary" x-large @click="submit">메일 보내기</v-btn>
      <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">문의 완료</v-card-title>
        <v-card-text>담당자가 확인후 빠른 시일내에 귀하의 메일로 답변드리겠습니다.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="backMenu">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-form>
    

    </div>
 
</template>

<script>
  export default {
    name: "EmailWidget",
    data: () => ({
      dialog:false,
      valid: true,
      files: '',
      subject: '',
      email: '',
      content: '',
      //제목에 대한 유효성 검사
      subjectRules: [
        v => !!v || '제목을 입력해주세요.'
      ],
      //이메일에 대한 유효성 검사
      emailRules: [
        v => !!v || '이메일을 입력해주세요.',
        v => /.+@.+\..+/.test(v) || '이메일이 올바르지 않습니다.',
      ],
      //내용에 대한 유효성 검사
      contentRules: [
         v => !!v || '문의할 내용을 입력해주세요'
      ],
    }),
    created() {
      //만약 로그인이 된 유저라면 email바로 불러와서 이메일 문의 할 수 있게 구현
      if(this.$store.state.isLogin === true) {
        this.email = this.$store.state.userInfo.email;
      }
    },
    methods: {
      backMenu(success){
        this.$emit('backMenu',success);
      },
      submit() {
        //validate 가 true라면 제목, 이메일, 내용이 모두 작성 했으므로 문의 메일을 보낼 수 있음
        if (this.$refs.form.validate()) {
          this.snackbar = true
          let formData = new FormData();
          //파일이 있으면 파일도 같이 보낼 수 있게 append
          if(this.files !== ''){
            formData.append('files',this.files);
          }
          formData.append('email', this.email);
          formData.append('subject',this.subject);
          formData.append('content',this.content);

          // backend 서버에 formData를 보냄
          this.$http.post('/email',
           formData,
            { headers: {
                            'Content-Type': 'multipart/form-data'
                        }}).then((res) =>{
              if(res.data === "Success send email") {
                //성공적으로 보내졌으면 폼 데이터를 리셋시키고 디아로그를 보여줌.
                this.$refs.form.reset()
                this.dialog = true;
              }
            })
         }
        
      },
      openFile(){
        document.getElementById('inputFile').click();
      },
       processFile(event) {
        console.log(event.target.files[0]);
         if(event.target.files[0] !== undefined){
          this.files = event.target.files[0]; 
         }else {
           this.files = '';
         }
   
      }

    },
  
  }
</script>
<style>
  
</style>