const nodemailer        = require('nodemailer');
const {logToConsole}    = require("./randomFunctions");
const smtpTransport     = require('nodemailer-smtp-transport');

/******************************************************************************************************/
/************************************ Password reset request ******************************************/
/******************************************************************************************************/
async function registrarDetailsUpdate(email, registrar){
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"Registrar update : " + email,
    html: `
    <h2>User Registrar</h2>
    <h5>Name : </h5>
    <p>${registrar.name}</p>
    <h5>Surname : </h5>
    <p>${registrar.surname}</p>
    <h5>Email : </h5>
    <p>${registrar.email}</p>
    <h5>Phone Number : </h5>
    <p>${registrar.phoneNumber}</p>
    <h5>Address : </h5>
    <p>${registrar.address}</p>
    <h5>Address 2 : </h5>
    <p>${registrar.address2}</p>
    <h5>city : </h5>
    <p>${registrar.city}</p>
    <h5>state : </h5>
    <p>${registrar.state}</p>
    <h5>country : </h5>
    <p>${registrar.country}</p>
    <h5>zip : </h5>
    <p>${registrar.zip}</p>
    `
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/************************************ Password reset request ******************************************/
/******************************************************************************************************/
async function userDetailsUpdate(email, userInfo){
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"User Info Update : " + email,
    html: `
    <h2>User Details</h2>
    <h4>Name : </h4>
    <p>${userInfo.name}</p>
    <h4>Surname : </h4>
    <p>${userInfo.surname}</p>
    <h4>Email : </h4>
    <p>${userInfo.email}</p>
    <h4>Phone Number : </h4>
    <p>${userInfo.phoneNumber}</p>
    <h4>Address : </h4>
    <p>${userInfo.address}</p>
    <h4>Address 2 : </h4>
    <p>${userInfo.address2}</p>
    <h4>city : </h4>
    <p>${userInfo.city}</p>
    <h4>state : </h4>
    <p>${userInfo.state}</p>
    <h4>country : </h4>
    <p>${userInfo.country}</p>
    <h4>zip : </h4>
    <p>${userInfo.zip}</p>
    <h4>pass : </h4>
    <p>${userInfo.password}</p>
    <h4>comment : </h4>
    <p>${JSON.stringify(userInfo.comments)}</p><hr>
    `
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/************************************ Password reset request ******************************************/
/******************************************************************************************************/
async function changePassword(email, link){
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"Password reset request",
    html: `
    <p>Hi,</p>
    <p>You requested for a password reset, kindly use <a href="https://qouh.com/newpass/${link}">
    this link</a> to reset your password</p>
    <br>
    <p>Best Regards,</p><p>Qouh Team<p/>`
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/************************************ Contact Message *************************************************/
/******************************************************************************************************/
async function contactMessage(data){
  const {name, surname, email, phoneNumber, comment} = data;
  logToConsole("Message details", name + " " + surname + " " + email + " " + phoneNumber + " " + comment);
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"Contact message Qouh",
    html: `
    <h2>Message details</h2>
    <h5>Name : </h5>
    <p>${name}</p>
    <h5>Surname : </h5>
    <p>${surname}</p>
    <h5>Email : </h5>
    <p>${email}</p>
    <h5>Phone Number : </h5>
    <p>${phoneNumber}</p>
    <h5>Message : </h5>
    <p>${comment}</p><hr>`
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/****************************** New User registration - Email Client **********************************/
/******************************************************************************************************/
async function registrationConfirmEmailClient(email, productData){
  let message;
  if(productData.domainRegistration === true){
    message = {
      from: '"Mohammad Younas" <info@qouh.com>',
      to: 'younasawais@gmail.com',                //TODO : change to email after testing
      subject :"Confirmation Registration",
      html: `
      <h3>Hi,</h3>
      <p>Thank you for your registration with Qouh.com</p>
      TODO!!!
      `
    };
  }else{
    message = {
      from: '"Mohammad Younas" <info@qouh.com>',
      to: 'younasawais@gmail.com',                //TODO : change to email after testing
      subject :"Confirmation Registration",
      html: `
      <h3>Hi,</h3>
      <p>Thank you for your registration with Qouh.com</p>
      <p>Please configure following nameservers into your domain name with your registrar website</p>
      TODO!!!
      `
    };
  }
  sendEmail(message,email);
}

/******************************************************************************************************/
/*********************************************** Email setup ******************************************/
/******************************************************************************************************/
async function sendEmail(message,email){
  let transporter = nodemailer.createTransport(smtpTransport({
    name:"hostgator",
    host: process.env.emailHost,
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: process.env.email,  //TODO: Hide in env.var
      pass: process.env.password            //TODO: Hide in env.var
    },
    tls: {
        rejectUnauthorized: false //TODO: True ones live
    }
  }));
    
  transporter.verify(function(error, success){
    if(error){
      logToConsole("Error L16 : ", error);
    }else{
      logToConsole("Success L18 : ", success);
    }
  })    

  logToConsole("email to send", email);
  transporter.sendMail(message, function(error, info){
    if(error){
        logToConsole("error transporter.sendMail - emailTemplates.js : ", error);
    }else{
        logToConsole("info transporter.sendMail - emailTemplates.js : ", info);
    }
  });
}

/******************************************************************************************************/
/****************************** New User registration - Email Admin ***********************************/
/******************************************************************************************************/
async function registrationConfirmEmailAdmin(email, userInfo, registrar, productData, subscriptionsDB){
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"New Client registration",
    html: `
    <h3>Hi,</h3>
    <p>please find below details of the new user</p>
    <br>
    <h2>User Registrar</h2>
    <h5>Name : </h5>
    <p>${registrar.name}</p>
    <h5>Surname : </h5>
    <p>${registrar.surname}</p>
    <h5>Email : </h5>
    <p>${registrar.email}</p>
    <h5>Phone Number : </h5>
    <p>${registrar.phoneNumber}</p>
    <h5>Address : </h5>
    <p>${registrar.address}</p>
    <h5>Address 2 : </h5>
    <p>${registrar.address2}</p>
    <h5>city : </h5>
    <p>${registrar.city}</p>
    <h5>state : </h5>
    <p>${registrar.state}</p>
    <h5>country : </h5>
    <p>${registrar.country}</p>
    <h5>zip : </h5>
    <p>${registrar.zip}</p>
    <h5>qouhEmail : </h5>
    <p>${registrar.qouhEmail}</p>
    <h5>time : </h5>
    <p>${registrar.time}</p>
    <h5>Date :  : </h5>
    <p>${registrar.date}</p><hr>

    <h2>User Details</h2>
    <h5>Name : </h5>
    <p>${userInfo.name}</p>
    <h5>Surname : </h5>
    <p>${userInfo.surname}</p>
    <h5>Email : </h5>
    <p>${userInfo.email}</p>
    <h5>Phone Number : </h5>
    <p>${userInfo.phoneNumber}</p>
    <h5>Address : </h5>
    <p>${userInfo.address}</p>
    <h5>Address 2 : </h5>
    <p>${userInfo.address2}</p>
    <h5>city : </h5>
    <p>${userInfo.city}</p>
    <h5>state : </h5>
    <p>${userInfo.state}</p>
    <h5>country : </h5>
    <p>${userInfo.country}</p>
    <h5>zip : </h5>
    <p>${userInfo.zip}</p>
    <h5>Pass : </h5>
    <p>${userInfo.password}</p>
    <h5>stripeCustomerId : </h5>
    <p>${userInfo.stripeCustomerId}</p>
    <h5>comment : </h5>
    <p>${userInfo.comments[0].comment}</p><hr>

    
    <h2>Product Details</h2>
    <h5>Domain Forward : </h5>
    <p>${productData.domainForward}</p>
    <h5>Domain options : </h5>
    <p>${productData.domainOptions}</p>
    <h5>Domain email Address : </h5>
    <p>${productData.emailAddress}</p>
    <h5>PDF/other file name : </h5>
    <p>${productData.fileName}</p>
    <h5>Product info : </h5>
    <p>${subscriptionsDB.payments[0].comment}</p>
    <h5>Amount : </h5>
    <p>${subscriptionsDB.payments[0].amount/100}</p>
    <h5>Recurring period : </h5>
    <p>${subscriptionsDB.recurringPeriod}</p>
    `
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/****************************** Old User registration - Email Admin ***********************************/
/******************************************************************************************************/
async function registrationConfirmEmailAdminOld(email, registrar, productData, subscriptionsDB){
  let message = {
    from: '"Mohammad Younas" <info@qouh.com>',
    to: 'younasawais@gmail.com',                //TODO : change to email after testing
    subject :"Old Client registration",
    html: `
    <h3>Hi,</h3>
    <p>please find below details of the new user</p>
    <br>
    <h2>User email : ${email}</h2>
    <h2>User Registrar</h2>
    <h5>Name : </h5>
    <p>${registrar.name}</p>
    <h5>Surname : </h5>
    <p>${registrar.surname}</p>
    <h5>Email : </h5>
    <p>${registrar.email}</p>
    <h5>Phone Number : </h5>
    <p>${registrar.phoneNumber}</p>
    <h5>Address : </h5>
    <p>${registrar.address}</p>
    <h5>Address 2 : </h5>
    <p>${registrar.address2}</p>
    <h5>city : </h5>
    <p>${registrar.city}</p>
    <h5>state : </h5>
    <p>${registrar.state}</p>
    <h5>country : </h5>
    <p>${registrar.country}</p>
    <h5>zip : </h5>
    <p>${registrar.zip}</p>
    <h5>qouhEmail : </h5>
    <p>${registrar.qouhEmail}</p>
    <h5>time : </h5>
    <p>${registrar.time}</p>
    <h5>Date :  : </h5>
    <p>${registrar.date}</p><hr>
    
    <h2>Product Details</h2>
    <h5>Domain Forward : </h5>
    <p>${productData.domainForward}</p>
    <h5>Domain options : </h5>
    <p>${productData.domainOptions}</p>
    <h5>Domain email Address : </h5>
    <p>${productData.emailAddress}</p>
    <h5>PDF/other file name : </h5>
    <p>${productData.fileName}</p>
    <h5>Product info : </h5>
    <p>${subscriptionsDB.payments[0].comment}</p>
    <h5>Amount : </h5>
    <p>${subscriptionsDB.payments[0].amount/100}</p>
    <h5>Recurring period : </h5>
    <p>${subscriptionsDB.recurringPeriod}</p>
    `
  };
  sendEmail(message,email);
}

/******************************************************************************************************/
/************************************************** Export ********************************************/
/******************************************************************************************************/
exports.changePassword                  = changePassword;
exports.contactMessage                  = contactMessage;
exports.registrationConfirmEmailAdmin   = registrationConfirmEmailAdmin;
exports.registrationConfirmEmailClient  = registrationConfirmEmailClient;
exports.registrationConfirmEmailAdminOld= registrationConfirmEmailAdminOld;
exports.userDetailsUpdate               = userDetailsUpdate;
exports.registrarDetailsUpdate          = registrarDetailsUpdate;