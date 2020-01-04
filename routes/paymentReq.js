const { CreateUser, CreateRegistrar, UserModel} = require('../mongoWorks');
const stripe = require('stripe')('sk_test_SwxTecMRJFh2dAZGy72mgmq200acGq2vqK');
const {logToConsole, productCalc, current, checkToken} = require('../mods/randomFunctions');
const {registrationConfirmEmailAdmin, registrationConfirmEmailClient, registrationConfirmEmailAdminOld} = require('../mods/emailTemplates');

module.exports = function(app){
    /******************************************************************************************************/
    /*********************** Subscribe & charge NEW client after token received ***************************/
    /******************************************************************************************************/
    app.post("/createSubscriptionNewUser", async (req, res)=>{
        const token                     = req.body.token;
        const userInfo                  = req.body.userInfo;
        const productData               = req.body.productData;
        const domainRegistrar           = req.body.domainRegistrar;
        const {totalPrice}              = req.body.productData;
        const {today, time}             = current();
        domainRegistrar.time            = time;
        domainRegistrar.date            = today;
        logToConsole("userInfo", userInfo);
        logToConsole("totalPrice", totalPrice);
        let payPrice                    = productCalc(totalPrice).payPrice;
        let productName                 = productCalc(totalPrice).productName;
        logToConsole("payprice & productname", [payPrice, productName]);
        logToConsole("Token", token);

        /************* Create Customer ****************/
        const customer = await stripe.customers.create({
            email   : userInfo.email,
            phone   : userInfo.phoneNumber,
            address :{
                line1       : userInfo.address,
                city        : userInfo.city,
                country     : userInfo.country,
                postal_code : userInfo.zip,
            },
            source  : token
        });
        logToConsole("Customer", customer);

        /************* Create plan ****************/
        const plan = await stripe.plans.create({
            amount: payPrice,
            currency: 'usd',
            interval: 'year',
            product: {
                name: productName,
                type : "service"}
        });
        logToConsole("plan", plan);


        /************* Connect plan to client ****************/
        stripe.subscriptions.create({
            items: [
                {plan :  plan.id}
            ],
            customer : customer.id
        } 
        , async function(err, subscription) {
            /************* Create account in DB ****************/
            logToConsole("subscription",subscription);
            let subscriptionsDB = {
                subscriptionId  : subscription.id,
                planId          : plan.id,
                createdDate     : today,
                createdTime     : time,
                recurringPeriod : plan.interval,
                payments        : [{
                    invoiceNr           : subscription.latest_invoice,
                    status              : "TODO: Check stripe response", // paid/due
                    amount              : productCalc(totalPrice).payPrice,
                    paymentForPeriod    : today + " + " + plan.interval,
                    payDate             : today,
                    payTime             : time,
                    comment             : "Domain name : " + productData.domainName + "; email: " + productData.emailAddress,
                    currency            : plan.currency,
                }]
            };
            let productSettings = {
                domain  : [{
                    name                : productData.domainName,
                    DomainForwardLink   : productData.domainForward,
                    DomainFunction      : productData.domainOptions,
                    pdfName             : productData.fileName,
                    registerDate        : today,
                    registerTime        : time
                }],
                email   : [{
                    name                : productData.emailAddress,
                    memory              : 6000,
                    registerDate        : today,
                    registerTime        : time
                }] 
            };
            let statistics = {
                actions : [{
                    name                : "Registration: " + productCalc(totalPrice).productName,
                    time                : time,
                    date                : today
                }]
            };
            logToConsole("userInfo.email",userInfo.email);
            domainRegistrar.qouhEmail   = userInfo.email;
            logToConsole("domainRegistrar",domainRegistrar);
            userInfo.stripeCustomerId   = subscription.customer;
            userInfo.comments           = [{
                date        : today,
                time        : time,
                comment     : userInfo.comment
            }];
            const resultCreateUser          = await CreateUser(userInfo, subscriptionsDB, productSettings, statistics);
            const resultDomainRegistrar     = await CreateRegistrar(domainRegistrar);
            logToConsole("resulCreateUser", resultCreateUser);
            logToConsole("resultDomainRegistrar", resultDomainRegistrar);
            logToConsole("subscription: ", subscription);
            /************* Send Email to Admin ****************/
            registrationConfirmEmailAdmin(userInfo.email,userInfo,domainRegistrar, productData, subscriptionsDB);
            
            /************* Send Email to Client ****************/
            registrationConfirmEmailClient(userInfo.email, productData);//TODO: Add client email
            res.send(subscription.status);
            }
        );
    });


    /******************************************************************************************************/
    /************************** Subscribe & charge OLD client after token received ************************/
    /******************************************************************************************************/
    app.post("/createSubscriptionOldUser", async (req, res)=>{
        const token                     = req.body.token;  
        const userToken                 = req.body.userToken;
        const productData               = req.body.productData;
        const domainRegistrar           = req.body.domainRegistrar;
        const {today, time}             = current();
        domainRegistrar.time            = time;
        domainRegistrar.date            = today;
        const {email}                   = checkToken(userToken);
        let payPrice                    = productCalc(productData.totalPrice).payPrice;
        let productName                 = productCalc(productData.totalPrice).productName;
        const resultUser = await UserModel.findOne(
            {"userInfo.email"   : email},
        );
        logToConsole("resultUser", resultUser);
        const {stripeCustomerId}        = resultUser.userInfo;
        
        /************* Create plan ****************/
        const plan = await stripe.plans.create({
            amount: payPrice,
            currency: 'usd',
            interval: 'year',
            product: {
                name: productName,
                type : "service"}
        });
        logToConsole("plan", plan);

        /************* Connect plan to client ****************/
        stripe.subscriptions.create({
            items: [
                {plan :  plan.id}
            ],
            customer : stripeCustomerId
        } 
        , async function(err, subscription) {
            logToConsole("subscription", subscription);
            /*********** Create subscriptionsDB *********/
            let subscriptionsDB = {
                subscriptionId  : subscription.id,
                planId          : plan.id,
                createdDate     : today,
                createdTime     : time,
                recurringPeriod : plan.interval,
                payments        : [{
                    invoiceNr           : subscription.latest_invoice,
                    status              : "TODO: Check stripe response", // paid/due
                    amount              : payPrice,
                    paymentForPeriod    : today + " + " + plan.interval,
                    payDate             : today,
                    payTime             : time,
                    comment             : "Domain name : " + productData.domainName + "; email: " + productData.emailAddress,
                    currency            : plan.currency,
                }]
            };
            /*********** push SUBSCRIPTION, domain, email to existing user *********/
            let domainAdd  = {
                name                : productData.domainName,
                DomainForwardLink   : productData.domainForward,
                DomainFunction      : productData.domainOptions,
                pdfName             : productData.fileName,
                registerDate        : today,
                registerTime        : time
            };
            logToConsole("domainAdd", domainAdd);
            let emailAdd   = {
                name                : productData.emailAddress,
                memory              : 6000,
                registerDate        : today,
                registerTime        : time
            };
            logToConsole("emailAdd", emailAdd);

            const subsciptionResultDB    = await UserModel.findOneAndUpdate(
                {"userInfo.email" : email},
                {
                    $push : {"subscriptions"            : subscriptionsDB}
                }
            );
            logToConsole("subsciptionResultDB", subsciptionResultDB);
            const emailResultDB     = await UserModel.findOneAndUpdate(
                {"userInfo.email" : email},
                {
                    $push : {"productSettings.email"    : emailAdd}
                }
            );
            logToConsole("emailResultDB", emailResultDB);
            const domainResultDB    = await UserModel.findOneAndUpdate(
                {"userInfo.email" : email},
                {
                    $push : {"productSettings.domain"   : domainAdd}
                }
            );
            logToConsole("domainResultDB", domainResultDB);
            
            /*********** Add domain & email to existing user *********/
            domainRegistrar.qouhEmail = email;

            /*********** Add domain REGISTRAR *********/
            const resultRegistrar   = await CreateRegistrar(domainRegistrar);
            logToConsole("resultRegistrar", resultRegistrar);

            /************* Send Email to Admin ****************/
            registrationConfirmEmailAdminOld(email,domainRegistrar, productData, subscriptionsDB);

            /************* Send Email to Client ****************/
            registrationConfirmEmailClient(email,productData);//TODO: Add client email
            res.send(subscription.status);
        });
    });
}

