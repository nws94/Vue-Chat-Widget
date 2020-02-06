// sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
// const fs = require("fs");

// pathToAttachment = `../files/test.pdf`;
// attachment = fs.readFileSync(pathToAttachment).toString("base64");

// const msg = {
//   to: 'hinyong2@naver.com',
//   from: 'test@test.com',
//   subject: 'subject',
//   text: 'text',
//   html: 'html',
//   attachments: [
//     {
//       content: attachment,
//       filename: "test.pdf",
//       type: "application/pdf",
//     }
//   ]
// };
// sgMail.send(msg);

let msg = {
  test: "1"
}

msg.test2= [{
  test2: "2",
}
]

console.log(msg.test2[0].test2);
