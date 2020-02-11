const mysql = require("mysql"),
      Promise = require("bluebird"),
      util = require("util"),
      config = require('./config.json');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

//DB 설정
const DB_INFO = {
  host     : config.mysql.host,
  port     : config.mysql.port,
  user     : config.mysql.user,
  password : config.mysql.password,
  database : config.mysql.database,
  multipleStatements: true,
  connectionLimit:30,
  waitForConnections:false
}
//싱글톤 
module.exports = class {
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO;
    this.pool = mysql.createPool(dbinfo);
  }
  //DB 연결
  connect() {
    return this.pool.getConnectionAsync().disposer(conn => {
      return conn.release();
    });
  }
  //DB 연결 해제
  end() {
    this.pool.end( function(err) {
      util.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!");
      if (err)
        util.log("ERR pool ending!!");
    });
  }
}