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
 

// CORS
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

// 유저정보, 채팅DB
rest(app, pool);

// port 번호 설정
const server = app.listen(3000, function() {
  console.log("Start Backend 3000");
})

// 소켓
io(server,pool);
// 메일
mail(app,pool);
// 실적
performance(app,pool);