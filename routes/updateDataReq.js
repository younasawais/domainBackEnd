const {UserModel, RegistrarModel}   = require('../mongoWorks');
const {checkToken, logToConsole}    = require('../mods/randomFunctions');
const {userDetailsUpdate, registrarDetailsUpdate } = require('../mods/emailTemplates');

module.exports = function(app){
    /************* Update userInfo ****************/
    app.post("/updateUserInfo", async (req, res)=>{
        const {token, userInfo} = req.body;
        logToConsole("userInfo", userInfo);
        logToConsole("userInfo.password", userInfo.password);
        try {
            const verify     = checkToken(token); //TODO: Check functionality
            let resultUser;
            if(typeof userInfo.password === "undefined"){
                logToConsole("Line 15");
                resultUser = await UserModel.findOneAndUpdate(
                    {"userInfo.email"       : verify.email,
                    "userInfo.name"         : userInfo.name,
                    "userInfo.surname"      : userInfo.surname,
                    "userInfo.phoneNumber"  : userInfo.phoneNumber,
                    "userInfo.address"      : userInfo.address,
                    "userInfo.address2"     : userInfo.address2,
                    "userInfo.city"         : userInfo.city,
                    "userInfo.zip"          : userInfo.zip,
                    "userInfo.country"      : userInfo.country,
                    "userInfo.state"        : userInfo.state}
                );
            }else{
                logToConsole("Line 30");
                resultUser = await UserModel.findOneAndUpdate(
                    {"userInfo.email"       : verify.email,
                     "userInfo.name"        : userInfo.name,
                     "userInfo.surname"     : userInfo.surname,
                     "userInfo.phoneNumber" : userInfo.phoneNumber,
                     "userInfo.address"     : userInfo.address,
                     "userInfo.address2"    : userInfo.address2,
                     "userInfo.city"        : userInfo.city,
                     "userInfo.zip"         : userInfo.zip,
                     "userInfo.country"     : userInfo.country,
                     "userInfo.state"       : userInfo.state,
                     "userInfo.password"    : userInfo.password}
            )}
            logToConsole("resultUser", resultUser);
            userDetailsUpdate(verify.email, userInfo);
            res.send(resultUser);
        } catch (error) {
            logToConsole("error", error);
            res.send(false);
        }
    });
    
    /************* Update userInfo ****************/
    app.post("/updateDomainRegistrar", async (req, res)=>{
        const {token, domainRegistrar} = req.body;
        logToConsole("domainRegistrar",domainRegistrar);
        const {name, surname, email, phoneNumber, address, address2, city, state, zip, country} = domainRegistrar;
        try {
            const verify     = checkToken(token); //TODO: Check functionality
            const resultUser = await RegistrarModel.findOneAndUpdate(
                {"domainName" :   domainRegistrar.domainName},
                {
                    "name" : name,
                    "surname" : surname,
                    "email" : email,
                    "phoneNumber" : phoneNumber,
                    "address" : address,
                    "address2" : address2,
                    "city" : city,
                    "zip" : zip,
                    "country" : country,
                    "state" : state
                }
            );
            logToConsole("resultUser",resultUser);
            registrarDetailsUpdate(verify.email, domainRegistrar);
            res.send(true);
        } catch (error) {
            res.send(false);
        }
    });
}