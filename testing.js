var express = require('express');
var app = express();
const mongoose = require('mongoose');
if(typeof process.env.PORT === "undefined"){
  require('dotenv').config({path : './.env.development'});
}else{
  require('dotenv').config({path : './.env.production'});
}
console.log("Mongo :: " + process.env.db);
mongoose.connect(process.env.db,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false})
.then(()=>{console.log("Connected to DB.............................................................")})
.catch((err)=>("Can't connect to db : " + err));


/************************************************************************************************/
/***************************************** Testing code  ****************************************/
/************************************************************************************************/

const userSchema = new mongoose.Schema({ 
  userInfo: {
      name            : String,
      surname         : String
  }});

const UserModel = mongoose.model('User', userSchema);

async function CreateUser(name, surname){
  const user = new UserModel({
      userInfo        : {
        name : name,
        surname : surname
      }
  });
  const result = await user.save();
  return result;
}

console.log(CreateUser("Mohammad", "Younas"));

app.listen(process.env.db || 4003, function() {
  console.log('App running on port 4003');
});