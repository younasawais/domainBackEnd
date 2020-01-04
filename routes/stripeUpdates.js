const {UserModel} = require('../mongoWorks');
const stripe = require('stripe')(process.env.stripePrivateKey);
const {logToConsole, checkToken} = require('../mods/randomFunctions');

module.exports = function(app){
    /******************************************************************************************************/
    /*********************** Subscribe & charge NEW client after token received ***************************/
    /******************************************************************************************************/
    app.post("/deleteSubscription", async (req, res)=>{
        const token                     = req.body.token;
        const deleteIndex               = req.body.deleteIndex;
        const {email}                   = checkToken(token);
        const subscriptionId            = req.body.subscriptionId;
        logToConsole("email",email);
        logToConsole("subscriptionId",subscriptionId);
        logToConsole("deleteIndex",deleteIndex);
        stripe.subscriptions.del(
            subscriptionId,
            async function(err, confirmation) {
                logToConsole("confirmation",confirmation);
                const {subscriptions} = await UserModel.findOne({"userInfo.email" : email});
                subscriptions.splice(deleteIndex,1);
                logToConsole("subscriptions",subscriptions);
                const resultUser = await UserModel.findOneAndUpdate(
                    {"userInfo.email" : email},
                    { "subscriptions" : [...subscriptions] }
                );
                logToConsole("resultUser",resultUser);
              res.send(confirmation.status);
            }
          );

    });
}

