var express = require('express');
var app = express();

console.log("Env.Var: " + process.env.PORT);
if(typeof process.env.PORT === "undefined"){
  console.log("works")
}else{
  console.log("Doesn't work");
}

app.listen(4003, function() {
  console.log('App running on port 4003');
});