const nodemailer = require('nodemailer');
const User = require('../../models/user.model');
const Team = require('../../models/team.model');

const sendSignupEmail = (receiver, user, password) => {
   const transporter = createTransporter();
   const subject = 'Welcome to League Manager!';
   let welcomeMsg = '';

   if(user instanceof User) {
      welcomeMsg = `Welcome ${user.firstName},\n\n` + 
         `Welcome to League Manager! We're happy to have you on board.\n` + 
         `Your account details:\nE-mail: ${user.email}\nPassword: ${password}`;
   }
   
   let mailOptions = createMailOptions(receiver, subject, welcomeMsg);

   transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log('Email sent: ' + info.response);
      }
   });
};

const sendExistingUserEmail = (user, team) => {
   const transporter = createTransporter();
   const subject = 'Welcome to League Manager!';
  
   if(user instanceof User && team instanceof Team) {
      var welcomeMsg = `Welcome ${user.firstName},\n\n` + 
         `Welcome to League Manager! We're happy to have the ${team.name} on board.\n\n` +
         `Your account details:\nEmail: ${user.email}\nPassword: Your existing League Manager password.`;
   }

   let mailOptions = createMailOptions(user.email, subject, welcomeMsg);
   
   transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
         console.log(error);
      } else {
         console.log('Email sent: ' + info.response);
      }
   });
};

const createTransporter = () => {

   let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.adminEmail,
         pass: process.env.adminEmailPassword
      }
   });

   return transporter;
}

const createMailOptions = (receiver, subject, msg) => {

   let mailOptions = {
      from: process.env.adminEmail,
      to: receiver,
      subject: subject,
      text: msg
   }
   return mailOptions;
}

module.exports = { sendSignupEmail, sendExistingUserEmail } ;