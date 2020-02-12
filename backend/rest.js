const Mydb = require('./mydb');

module.exports = function(app, pool) {
  
  // 회원가입
  app.post('/register', (req,res) => {
    let register = req.body.data;
    // console.log("register", req.body,"req.body.data",req.body.data);
    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("insert into users values(?,?,null,?);",[register.email, register.password, register.nickname], (err,ret) => {
        if(err) {
          conn.rollback();
          throw err;
        }
        
        // console.log(ret);
        conn.commit();

      })
    })
  })
  // auth 가입
  app.post('/register/auth',(req,res) =>  {
      let register = req.body.data;
      let mydb = new Mydb(pool);
      mydb.excuteTx( conn => {
        conn.query("insert into users values(?,null,null,?);",[register.email,register.nickname], (err, ret) => {
          if(err) {
            conn.rollback();
            throw err;
          }
          
      conn.query("select * from users where email = ?;",[register.email],(err2,ret2) => {
        if(err2) {
          conn.rollback();
          throw err2;
        }
        res.json(ret2);  
        conn.commit();
      })
        
              
        })
      })
  })
  // 로그인
  app.post('/login', (req,res) => {
    let login = req.body.data;
    // console.log("rest",req.body);
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from users where email = ? and password = ?;",[login.email, login.password], (err, ret) =>{
        if(err) throw err;
        
        // console.log(ret);
        res.send(ret);
      })
    })
  })
  // auth 로그인
  app.post('/login/auth',(req,res) => {
    let login = req.body.data;
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from users where email = ?;",[login.email],(err,ret) => {
        if(err) throw err;

        res.json(ret);
      })
    })
  })
  // 유저 찾기
  app.get('/userfind/:findNickname/:myNickname', (req,res) => {
    let findNickname = req.params.findNickname,
        myNickname = req.params.myNickname;
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select nickname from users where nickname like ? and nickname not in (?);",['%'+findNickname+'%', myNickname], (err,ret) =>{
        
        res.send(ret);
      })
    })
    
  })

  // 채팅 저장
  app.post('/chat', (req,res) => {
    let chat = req.body.data;
    // console.log("chat", req.body,"req.body.data",req.body.data);
    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("insert into chat values(null,?,?,?,NOW(),0);",[chat.fromNickname,chat.toNickname,chat.chatContent], (err,ret) => {
        if(err) {
          conn.rollback();
          throw err;
        }
        
        // console.log(ret);
        conn.commit();

      })
    })
  })
  // 상대방과 채팅한 리스트
  app.get('/chat/:fromNickname/:toNickname', (req,res) => {
    let fromNickname = req.params.fromNickname,
      toNickname = req.params.toNickname
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from chat where((fromNickname = ? and toNickname=?) or (fromNickname = ? and toNickname = ?));",[fromNickname,toNickname,toNickname,fromNickname], (err,ret) =>{
        // console.log("ret:"+ret,"ret.json :" + res.json(ret));
        res.json(ret);
      })
    })
    
  })
  // 최근 채팅한 리스트 목록
  app.get('/chat/:myNickname',(req,res) => {
    let myNickname = req.params.myNickname;
    let test = '';
    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.queryAsync("select * from chat where chatID IN (SELECT MAX(chatID) FROM CHAT WHERE toNickname = ? OR fromNickname= ? GROUP BY fromNickname, toNickname) order by chatID desc;"
                  ,[myNickname,myNickname], async (err,ret)  =>{
                    if(err) throw err;
                    
                    for(let i=0; i< ret.length;i++){
                      let item = ret[i];
                      for(let j=0; j< ret.length;j++){
                        let item2 = ret[j];
                        if(item.fromNickname === item2.toNickname && item.toNickname === item2.fromNickname) {
                          if(item.chatID < item2.chatID) {
                            ret.splice(i,1);
                            i--;
                            break;
                          }else {
                            ret.splice(j,1);
                            j--;
                          }
                        }
                      }
                    }
                    
            
                    res.json(ret);
          })
      })
  })
  // 모든 안읽은 메세지 개수
  app.get("/allUnread/:myNickname",(req,res) =>{
    let myNickname = req.params.myNickname;

    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select count(chatID) as unread from chat where toNickname= ? and chatRead = 0;", [myNickname], (err, ret) => {
        if(err) throw err;
      
        res.json(ret);
      })
    })
  })
  // 상대 유저별 안 읽은 메세지 개수
  app.get("/unread/:myNickname/:toNickname", (req,res) => {
    let myNicknmae = req.params.myNickname,
        toNickname = req.params.toNickname; 
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select count(chatID) as unread from chat where (fromNickname = ? and toNickname = ?) and chatRead = 0;",[toNickname,myNicknmae],(err, ret) => {
        if(err) throw err;
        res.json(ret);
      })
    })
  })
  
}