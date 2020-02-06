const util    = require('util'),
      Promise = require("bluebird"),
      Pool = require('../pool');
const Mydb = require('../mydb');      
const pool = new Pool();
const sql = "select * from todo;"
let mydb = new Mydb(pool);
// Promise.using( pool.connect(), conn => {
//   conn.queryAsync(sql)
//       .then(util.log)
//       .catch( err => {
//         util.log("err>>", err);
//       });
// })


mydb.excuteTx( conn => {
  conn.queryAsync("select * from performance;",(err,ret) => {
    if(err) throw err;
    console.log("ret: ",ret);
    let file =  new Buffer.from(ret.file).toString("base64");
    console.log(file);
    // conn.queryAsync("select * from chat where((fromID = ? and toID=?) or (fromID = ? and toID = ?))",['testID','testID2','testID2','testID'], (err2, ret2) => {
    //   if(err2) throw err2;
    //   console.log("ret2: ",ret2);
      // socket.emit("chat",ret2);
    // });
  });
});