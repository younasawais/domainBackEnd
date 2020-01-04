const {CreateRegistrar, UserModel/*, RegistrarModel*/} = require('../mongoWorks');
const {current, logToConsole} = require('../mods/randomFunctions');

module.exports = function(app){
/************* Registering user after payment ****************/
app.post("/sendUserDetails", async (req, res)=>{
    const userInfo          = req.body.userInfo;
    logToConsole("domainRegistrar", domainRegistrar);
    logToConsole("userInfo", userInfo);
    logToConsole("productData", productData);
    logToConsole("today , time", [today, time]);


});

/************* Add domainname to existing user ****************/
app.post("/sendRegistrarDetails", async (req, res)=>{
    let {domainRegistrar, currentUser, productData}   = req.body;
    const {today, time}  = current();
    domainRegistrar.time    = time;
    domainRegistrar.date    = today;

    let {total} = productData.totalPrice;
    total = total[0] + total[1];
    let paid = {
        amount  : total,
        date    : today,
        time    : time,
        comment : "Domain name : " + productData.domainName + "; email: " + productData.emailAddress
    }
    const resultUser = await UserModel.findOneAndUpdate(
        {"userInfo.email" : currentUser},
        {$push : {"subscriptions.paid" : paid}}
    );
    const resultRegistrar = await CreateRegistrar(domainRegistrar);
    res.send({resultUser, resultRegistrar});
});
    
}