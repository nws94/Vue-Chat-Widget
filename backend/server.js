const bodyParser = require('body-parser'),
      express = require('express')
      app = express(),
      io = require('./socket'),
      rest = require('./rest'),
      Pool = require('./pool'),
      pool = new Pool(),
      cors = require('cors'),
      mail = require('./mail'),
      performance = require('./performance');
 

// let mydb = new Mydb(pool);
// const Mydb = require('./mydb');
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

  next();
});

const corsOpt = function(req, callbank) {
  callbank(null, {origin: true});
};
// 모든 도메인의 통신을 허용합니다.
 
app.options('*', cors(corsOpt));
// 모든 options 메서드로의 사전 전달 접근을 허용합니다.

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

rest(app, pool);

const server = app.listen(3003, function() {
  console.log("Express's start on port 3003");
})


io(server,pool);
mail(app,pool);
performance(app,pool);