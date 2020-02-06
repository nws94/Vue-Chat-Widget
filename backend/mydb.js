const Promise = require('bluebird');

module.exports = class {
  constructor(pool) {
    this.pool = pool;
  }

  excute(fn) {
    Promise.using( this.pool.connect(), conn => {
      fn(conn)
    });
  }

  excuteTx(fn) {
    Promise.using( this.pool.connect(), conn => {
      conn.beginTransaction( txerr => {
          fn(conn);
      });
    });
  }
}