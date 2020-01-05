const mongoose = require('mongoose');

console.log("Mongo :: " + process.env.db);
mongoose.connect("mongodb://localhost/domain-project" || "mongodb+srv://domainProject:475734255Bbb@cluster0-3cx3m.mongodb.net/test?retryWrites=true&w=majority",{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false})
.then(()=>{console.log("Connected to DB.............................................................")})
.catch((err)=>("Can't connect to db : " + err));

const userSchema = new mongoose.Schema({ 
    userInfo: {
        name            : String,
        surname         : String,
        address         : String,
        address2        : String,
        city            : String,
        state           : String,
        country         : String,
        zip             : String,
        phoneNumber     : String,
        email           : String,
        password        : String,
        stripeCustomerId: String,
        registrationDate: String,
        comments        : [{
            date            : String,
            time            : String,
            comment         : String
        }],
        qouhMessages    : [{
            message         : String,
            date            : String,
            time            : String,
            readByReceiver  : Boolean,
            senderName      : String,  //Qouh / Clientname
        }],
        tickets  : [{
            status  : String,
            date    : String,
            time    : String,
            comments: [{
                comment : String,
                date    : String,
                time    : String,
            }]
        }]
    },
    subscriptions   : [{
        subscriptionId  : String,
        planId          : String,
        createdDate     : String,
        createdTime     : String,
        recurringPeriod : String,
        payments        : [{
            invoiceNr       : String,
            status          : String, // paid/due
            amount          : Number,
            paymentForPeriod: String,
            payDate         : String,
            payTime         : String,
            comment         : String,
            currency        : String
        }]
    }],
    productSettings : {
        domain  : [{
            name                : String,
            DomainForwardLink   : String,
            DomainFunction      : String,
            pdfName             : String,
            comments            : [{
                comment     : String,
                time        : String,
                date        : String
            }],
            registerDate        : String,
            registerTime        : String
        }],
        email   : [{
            name                : String,
            memory              : Number,
            registerDate        : String,
            registerTime        : String
        }]
    },    
    statistics : {
        logins : [{
            date        : String,
            time        : String,
            location    : String,
            ipAddress   : String,
            browser     : String 
        }],
        actions : [{
            name    : String,
            time    : String,
            date    : String
        }]
    }
});

const UserModel = mongoose.model('User', userSchema);

const domainRegistrar = new mongoose.Schema({ 
    name        : String, 
    surname     : String,
    email       : String,
    phoneNumber : Number,
    address     : String,
    address2    : String,
    city        : String,
    state       : String,
    country     : String,
    zip         : String,
    qouhEmail   : String,
    time        : String,
    date        : String,
    domainName  : String
});

const RegistrarModel = mongoose.model('Registrar', domainRegistrar);

async function CreateRegistrar(userInfo){
    const registrar = new RegistrarModel(userInfo);
    const result = await registrar.save();
    return result;
}

async function CreateUser(userInfo, subscriptions, productSettings, statistics){
    const user = new UserModel({
        userInfo        : userInfo,
        productSettings : productSettings,
        subscriptions   : subscriptions,
        statistics      : statistics
    });
    const result = await user.save();
    return result;
}

exports.CreateRegistrar = CreateRegistrar;
exports.CreateUser      = CreateUser;
exports.UserModel       = UserModel;
exports.RegistrarModel  = RegistrarModel;