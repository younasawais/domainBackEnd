const {UserModel}                                   = require('../mongoWorks');
const {logToConsole, currentSeparate}               = require('../mods/randomFunctions');
const {changePassword,contactMessage}               = require('../mods/emailTemplates');
const jwt                                           = require('jsonwebtoken');
//const {jwtKey}                                      = require('../config/configData');

module.exports = function(app){
    /******************************************************/
    /************* Send reset token to email **************/
    /******************************************************/
    app.post("/forgotPass", async (req, res)=>{
        const {email} = req.body;
        const resultEmail = await UserModel.findOne(
            {"userInfo.email"   : email},
        );
        if (resultEmail) {
            logToConsole("email found", resultEmail);
            let tempObj = {                             //TODO: Delete
                "email" : email,
                "hour" : currentSeparate().hour,
                "day"   : currentSeparate().day,
                "month" : currentSeparate().month,
                "year"  : currentSeparate().year
            };
            logToConsole("tempObj", tempObj);            
            token = jwt.sign({ 
                "email" : email,
                "hour" : currentSeparate().hour,
                "day"   : currentSeparate().day,
                "month" : currentSeparate().month,
                "year"  : currentSeparate().year
            }, process.env.jwtKey);
            logToConsole("token", token);             //TODO: Delete
            //token = token.replace(/[.]/g,"%");
            
            changePassword(email, token);
        } else {
            logToConsole("email not found", resultEmail);
        }
    });
    
    /******************************************************/
    /************* Update new password  *******************/
    /******************************************************/
    app.post("/resetPassword", async (req, res)=>{
        const {token, password} = req.body;
        logToConsole("token", token);
        const verify = jwt.verify(token,process.env.jwtKey);
        logToConsole("verify", verify);
        const {hour, day, month, year} = currentSeparate();
        if(hour === verify.hour && day === verify.day && month === verify.month && year === verify.year){ // 1 hour
            const resultPassUpdate = await UserModel.findOneAndUpdate(
                {"userInfo.email"   : verify.email}, 
                {"userInfo.password": password});
            logToConsole("resultPassUpdate",resultPassUpdate);
            res.send("updated");
        }else{                          //expired or other issue
            res.send("problem");
        }
    });
    
    /******************************************************/
    /****************** Contact message *******************/
    /******************************************************/
    app.post("/sendContactMessage", async (req, res)=>{
        contactMessage(req.body);
        res.send("success");
    });
}