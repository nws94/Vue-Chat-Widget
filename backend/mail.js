const sgMail = require('@sendgrid/mail'),
      config = require('./config.json');
      multer = require('multer'),
      storage = multer.memoryStorage(),
      upload = multer({ storage});

module.exports = function(app,pool){
  app.post('/email',upload.any() ,(req,res) => {
    const emailInfo = req.body
      
    let msg = '',
        files = '';


    if(emailInfo === undefined || emailInfo === ''){
      res.send('error')
    }else {
      sgMail.setApiKey(config.sendgrid.SENDGRID_API_KEY);
      msg = {
        to: config.sendgrid.adminEmail,
        from: emailInfo.email,
        subject: emailInfo.subject,
        text: 'text',
        html: emailInfo.content,
      };

      if(req.files[0] !== undefined){
        files = req.files[0];
        // console.log(files);
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