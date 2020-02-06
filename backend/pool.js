const mysql = require("mysql"),
      Promise = require("bluebird"),
      util = require("util"),
      config = require('./config.json');

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);


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

module.exports = class {
  constructor(dbinfo) {
    dbinfo = dbinfo || DB_INFO;
    this.pool = mysql.createPool(dbinfo);
  }

  connect() {
    return this.pool.getConnectionAsync().disposer(conn => {
      return conn.release();
    });
  }

  end() {
    this.pool.end( function(err) {
      util.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> End of Pool!!");
      if (err)
        util.log("ERR pool ending!!");
    });
  }
}