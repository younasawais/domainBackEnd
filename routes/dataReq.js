const {RegistrarModel}          = require('../mongoWorks');
const whois                     = require('whois');
const {checkToken, logToConsole}= require('../mods/randomFunctions');
const {UserModel}               = require('../mongoWorks');
const jwt                       = require('jsonwebtoken');
const {jwtKey}                  = require('../config/configData');

module.exports = function(app){
    /*****************************************************/
    /************* Get all domain details ****************/
    /*****************************************************/
    app.post("/showDomainNames", async (req, res)=>{
        const token     = req.body.token;
        const {email}   = checkToken(token);
        console.log(email)
        const domains   = await RegistrarModel
            .find({"qouhEmail" : email})
            .select('-_id -__v -time -date');
        console.log(domains);
        res.send(domains);
    });
    
    /*****************************************************/
    /************* Check domain available ****************/
    /*****************************************************/
    app.post("/checkdomain", (req, res)=>{
        const domainName    = req.body.domainName;
        console.log("domainName: " + domainName);
        whois.lookup(domainName, async function(err, data){
            const response = await data;
            let domainNameAvailable;
            if(response.includes("No match for domain") || response.includes("Not found: " + domainName)){
                domainNameAvailable = "available"
            }else{
                domainNameAvailable = "unavailable"
            }
            res.send({domainNameAvailable});
        });
    });

    /*****************************************************/
    /***************** Send back userInfo ****************/
    /*****************************************************/
    app.post("/getUserData", async (req, res)=>{
        const verify  = checkToken(req.body.token) //Check token
        const dbres   = await UserModel.findOne({"userInfo.email" : verify.email}); // get data from db
        logToConsole("userInfo", dbres);
        const {name, surname, email, phoneNumber, address, address2, city, 
               state,country, zip, registrationDate} = dbres.userInfo;
        let sendObj = {
            "name"          : name,
            "surname"       : surname,
            "email"         : email,
            "phoneNumber"   : phoneNumber,
            "address"       : address,
            "address2"      : address2,
            "city"          : city,
            "state"         : state,
            "country"       : country,
            "zip"           : zip,
            "registerDate"  : registrationDate
        }
        logToConsole("sendObj", sendObj);
        res.send(sendObj);
    });

    /******************************************************/
    /************* Send back Subscriptions ****************/
    /******************************************************/
    app.post("/getUserSubscriptions", async (req, res)=>{
        const {email}  = checkToken(req.body.token) //Check token
        const {subscriptions} = await UserModel.findOne({"userInfo.email" : email});
        logToConsole("subscriptions", subscriptions);
        res.send(subscriptions);
        // stripe.subscriptions.retrieve(
        //     'sub_GEJw60gaASlAOJ',
        //     function(err, subscription) {
        //         subscriptionList.push(subscription);
        //       // asynchronously called
        //     });
        });

    /*****************************************************/
    /**************** Check login details ****************/
    /*****************************************************/
    app.post("/login",async (req, res)=>{
        const email     = req.body.email;
        const password  = req.body.password;
        console.log("email : " + email + ", Password : " + password); 

        const dbres = await UserModel.findOne({"userInfo.email" : email});
        
        console.log(dbres);
        logToConsole("dbres",dbres);

        let token;
        if (dbres.userInfo.password === password) {
            token = jwt.sign({ "email" : email}, jwtKey);
        } else {
            token = false;
        }
        logToConsole("token",token);

        res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .send("check header");
    });

    /*****************************************************/
    /************* Authorize protected links *************/
    /*****************************************************/
    app.post("/verifytoken",async (req, res)=>{
        const verify = checkToken(req.body.token);        
        logToConsole("verify", verify);
        res.send(verify);
    });    

    /*****************************************************/
    /********* Check if email already registered *********/
    /*****************************************************/
    app.post("/emailexist",async (req, res)=>{
        const {email} = req.body;        
        logToConsole("email", email);
        const dbres = await UserModel.findOne({"userInfo.email" : email});
        logToConsole("dbres", dbres);
        if(dbres){
            res.send(true);
        }else{
            res.send(false);
        }
    });    
}