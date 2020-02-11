const sgMail = require('@sendgrid/mail'),
      config = require('./config.json');
      multer = require('multer'),
      storage = multer.memoryStorage(),
      upload = multer({ storage});

module.exports = function(app,pool){
  //multer를 사용하면 formData에 있는 file를 받을 수 있음.
  app.post('/email',upload.any() ,(req,res) => {
    const emailInfo = req.body
      
    let msg = '',
        files = '';


    if(emailInfo === undefined || emailInfo === ''){
      res.send('error')
    }else {
      // sendgrid api 사용하여 이메일을 보낼 수 있음
      sgMail.setApiKey(config.sendgrid.SENDGRID_API_KEY);
      msg = {
        //to는 admin 이메일로 보내짐
        to: config.sendgrid.adminEmail,
        from: emailInfo.email,
        subject: emailInfo.subject,
        text: 'text',
        html: emailInfo.content,
      };
      // 파일이 있으면 attachments 추가
      if(req.files[0] !== undefined){
        files = req.files[0];
        msg.attachments = [
          {
            content: Buffer.from(files.buffer).toString("base64"),
            filename: files.originalname,
            type: files.mimetype,
          }
        ]
      }
    
      sgMail.send(msg);
      res.send("Success send email")
    }
  })
}