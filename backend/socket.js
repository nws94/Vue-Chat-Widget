const Mydb = require('./mydb');

module.exports = function(server,pool) {
  
  const io = require('socket.io').listen(server, {
    log: false,
    origins: '*:*',
    pingInterval: 3000,
    pingTimeout: 5000  
  });

  // io.use((socket,next) => {
  //   let userID = socket.handshake.query.userID;
  //   console.log("userID:",userID);
  //   if(socket.handshake.query && socket.handshake.query.userID){
  //      next();
  //   }
  //  next(new Error('socket.handshake.query error'))
  // });

  let clients = [];
  let check = true;
  io.sockets.on('connection', function(socket) {
    //  console.log('Connect from Client:' + socket.id,'Connect from Client Room: '+ socket.room, "socket.handshake.query : " + socket.handshake.query);
    // console.log("origin",socket.id);
    // socket.id = socket.handshake.query.userID;
    // console.log("userNickname: ", socket.handshake.query.userNickname);
    let data =  socket.handshake.query.userNickname;
    check = true;
    // socket.on('storeUserInfo', function(data) {
    // })
     if(clients.length != 0) {
        for(var i=0;i< clients.length;i++){
                
          let c = clients[i];
          if(c.userNickname == data){
            check = false;
            c.clientId = socket.id
          }
        }
      }
      if(check && data != null) {
        let userInfo = new Object();
        userInfo.userNickname = data;
        userInfo.clientId = socket.id;
        clients.push(userInfo);
      }
      
      for(var i=0;i< clients.length;i++){
               
        let c = clients[i];
        // console.log("chat user",c);
      }
  

    // socket.on('join',function(data) {
    //   socket.join(data.roomname);
    //   socket.set('room', data.roomname);
    //   socket.get('room', function(err, room) {
    //     if(err) throw err;
    //     io.sockets.in(room).emit('join',data.userid);
    //   })
    // })

    // socket.on('message',function(message) {
    //   socket.get('room', function(err, room) {
    //     if(err) throw err;
    //     io.sockets.in(room).emit('message', message);
    //   });
    // })


    socket.on('chat', function(data) {
      // console.log('message from Clinet: ' + data.chatContent);
      // console.log("chat socket.id : ", socket.id);
      // console.log("chat toNickname", data.toNickname);
      let mydb = new Mydb(pool);

     
      mydb.excuteTx( conn => {
        conn.queryAsync("insert into chat values(null,?,?,?,NOW(),0);",[data.fromNickname,data.toNickname,data.chatContent],(err,ret) => {
          if(err) {
            conn.rollback(); 
            throw err;
          }
            // console.log("ret: ",ret);
            conn.commit();
          conn.queryAsync("select * from chat where((fromNickname = ? and toNickname=?) or (fromNickname = ? and toNickname = ?))",[data.fromNickname,data.toNickname,data.toNickname,data.fromNickname], (err2, ret2) => {
            if(err2) throw err2;
              // console.log("ret2: ",ret2);
            // io.to(data.toID).emit("chat",ret2);
              let messageSuccess = false;

              for(var i=0;i< clients.length;i++){
               
                let c = clients[i];
                // console.log(c);
                if(c.userNickname == data.toNickname){
                  // console.log(c.clientId);
                  io.to(c.clientId).to(socket.id).emit("chat",ret2);
                  messageSuccess = true;
                  break;
                }
              }

              if(!messageSuccess) {
                io.to(socket.id).emit("chat", ret2);
              }

            });
            
          });
        });
      });
    
  });
}
