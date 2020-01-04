const jwt           = require('jsonwebtoken');
const {jwtKey}      = require('../config/configData');


/************* Random functions ****************/
function current(){
    let date = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    let datum = {
        today : dd + '/' + mm + '/' + yyyy,
        time : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}
    return datum;
}

function currentSeparate(){
    let date    = new Date();
    let day     = parseInt(String(date.getDate()).padStart(2, '0'));
    let month   = parseInt(String(date.getMonth() + 1).padStart(2, '0'));

    let datum   = {
        day     : day,
        month   : month,
        year    : date.getFullYear(),
        hour    : date.getHours(),
        min     : date.getMinutes(),
        sec     : date.getSeconds(),
        filetype: date.getFullYear() + "Y" + month + "M" + day + "D" + date.getHours() + "H" + date.getMinutes() + "m" +date.getSeconds() + "s"
    }
    return datum;
}

function checkToken(reqToken){
    const token = reqToken;
    const verify = jwt.verify(token,jwtKey);
    logToConsole("verify",verify);
    return verify;
}

function logToConsole(comment, value){
    console.log("*************************************** " + comment + " *********************************");
    console.log("*************************************** " + 
                currentSeparate().hour + "h : " + currentSeparate().min + "m : " + currentSeparate().sec
                +  "s *********************************");
    console.log(value);
    console.log("********************************* END : " + comment + " *********************************");
}

function productCalc(totalPrice){
    let payPrice = 0;
    let productName = "";
    for (let i = 0; i < totalPrice.total.length; i++) {
        payPrice = payPrice + totalPrice.total[i];
        productName = totalPrice.name[i] + ", " + productName;
    }
    payPrice = payPrice * 100;
    let product = {
        payPrice    : payPrice,
        productName : productName
    };
    return product;
}

exports.logToConsole    = logToConsole;
exports.current         = current;
exports.checkToken      = checkToken;
exports.productCalc     = productCalc;
exports.currentSeparate = currentSeparate;