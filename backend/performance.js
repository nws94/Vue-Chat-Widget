const Mydb = require('./mydb');

module.exports = function(app, pool) {
  //실적 DB 저장
  app.post("/performance/write",(req, res) => {
    let form = req.body,
        file = '';
    
    let performance = form.performance;

   

    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("insert into performance values(null,?,?,?,?,?,?,NOW(),0);",[form.title,form.intro,performance.content,
                                                                            performance.filename, form.performance.file,performance.filetype],(err,ret) => {
        if(err) {
          conn.rollback();
          throw err;
        }
        conn.commit();
        res.send("Success");
      });
    })
  })
  // 추가 내용 및 파일 DB저장
  app.post("/performance/addfile",(req,res) => {
    let form = req.body;
    
    let performance = form.performance;

   

    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("insert into addfile values(null,?,?,?,?,?);",[form.id,performance.filename,performance.file,performance.filetype,performance.content],(err,ret) => {
        if(err) {
          conn.rollback();
          throw err;
        }
        conn.commit();
        res.send("Success");
      })
    })

  })
  // 가장 큰 id를 보냄
  app.get("/performance/id", (req,res) => {
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select max(id) as id from performance;",(err,ret) =>{
        if(err) throw err;
        res.json(ret);
      })
    })
  })
  // 실적 리스트를 보냄
  app.get("/performance", (req,res) => {
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from performance;",(err,ret) => {
        if(err) throw err;
        res.json(ret);
      })
    })
  })
  // id와 같은 실적을 보냄
  app.get("/performance/:id", (req,res) => {
    let id = req.params.id;
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from performance where id = ?;",[id], (err,ret) => {
        if(err) throw err;
        res.json(ret);
      })
    })
  })
  // id 같은 추가 내용 을 보냄
  app.get("/performance/addfile/:id",(req,res) => {
    let id = req.params.id;
    let mydb = new Mydb(pool);
    mydb.excute( conn => {
      conn.query("select * from addfile where id = ?;",[id], (err,ret) => {
        if(err) throw err;
        res.json(ret);
      })
    })
  })
  // 실적 수정
  app.post("/performance/update",(req,res) => {
    let form = req.body;

    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("update performance set title = ?, intro = ?, content = ?, filename = ?, file = ?, filetype =? where id = ?",
        [form.title,form.intro,form.content,form.filename,form.file,form.filetype,form.id],(err,ret) => {
          if(err){
            conn.rollback();
            throw err;
          }

          conn.commit();
          res.json("Success");
        })
    })
  })
  // 추가 내용 수정
  app.post("/performance/addfile/update",(req,res) => {
    let form = req.body;

    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("update addfile set filename = ?, file = ?, filetype = ?, content = ? where addID = ? and id = ?",
        [form.filename,form.file,form.filetype,form.content,form.addID,form.id], (err, ret) => {
          if(err) {
            conn.rollback();
            throw err;
          }

          conn.commit();
          res.json("Success");
        })
    })
  })
  // 추가 내용 삭제
  app.delete("/performance/addfile/:addID",(req,res) => {
    let addID = req.params.addID;

    let mydb = new Mydb(pool);
    mydb.excuteTx( conn => {
      conn.query("delete from addfile where addID = ?",[addID],(err,ret) => {
        if(err) {
          conn.rollback();
          throw err;
        }

        conn.commit();
        res.json("Success");
      })
    })
  })
}