const Mydb = require('./mydb');

module.exports = function(server,pool) {
  
  const io = require('socket.io').listen(server, {
    log: false,
    origins: '*:*',
    pingInterval: 3000,
    pingTimeout: 5000  
  });

  
  let clients = [];
  let check = true;
  //소켓 연걸
  io.sockets.on('connection', function(socket) {
    
    //쿼리 스트링으로 넘어온 유저 닉네임을 변수에 저장
    let data =  socket.handshake.query.userNickname;
    check = true;
     // clients에 저장된 닉네임과 넘어온 유저닉네임과 비교하여 이미있으면 socket.id만 바꿔주기 위한 알고리즘
     if(clients.length != 0) {
        for(var i=0;i< clients.length;i++){
                
          let c = clients[i];
          //이미 clients에 있는 닉네임이라면 socket.id만 바꿔줌
          if(c.userNickname == data){
            check = false;
            c.clientId = socket.id
          }
        }
      }
      // clients에 닉네임이 없으면 push
      if(check && data != null) {
        let userInfo = new Object();
        userInfo.userNickname = data;
        userInfo.clientId = socket.id;
        clients.push(userInfo);
      }
      

    // chat이라는 메소드를 받는 메소드
    socket.on('chat', function(data) {
      let mydb = new Mydb(pool);

     
      mydb.excuteTx( conn => {
        //메세지가 오면 DB에 저장
        conn.queryAsync("insert into chat values(null,?,?,?,NOW(),0);",[data.fromNickname,data.toNickname,data.chatContent],(err,ret) => {
          if(err) {
            conn.rollback(); 
            throw err;
          }
            
            conn.commit();
          // 상대방과 대화 했던 내용을 다시 보내기
          conn.queryAsync("select * from chat where((fromNickname = ? and toNickname=?) or (fromNickname = ? and toNickname = ?))",
                        [data.fromNickname,data.toNickname,data.toNickname,data.fromNickname], (err2, ret2) => {
              if(err2) throw err2;
           
              let messageSuccess = false;

              for(var i=0;i< clients.length;i++){
               
                let c = clients[i];
                // 접속중일 때
                if(c.userNickname == data.toNickname){
                  // 상대방 닉네임을과 socket.id를 찾아 보냄.
                  // 자신도 보낸 메세지를 봐야 하므로 같이보냄
                  io.to(c.clientId).to(socket.id).emit("chat",ret2);
                  messageSuccess = true;
                  break;
                }
              }
              // 접속중이 아닐때
              if(!messageSuccess) {
                io.to(socket.id).emit("chat", ret2);
              }

            });
            
          });
        });
      });
    
  });
}
