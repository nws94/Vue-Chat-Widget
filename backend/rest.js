const Mydb = require('./mydb');

module.exports = function(app, pool) {
  
  app.get('/test', (req, res)  => {
    let login = req.body.data;
    console.log("rest",req.body);
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from todo;", (err, ret) => {
        console.log(ret);
        res.send("test");
      });
    });
  });

  app.post('/test',(req,res) => {
    let body = req.body;
    console.log(req.body.data.userID);
  })
  

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