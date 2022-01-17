const conn      = require('./conndb');


function islogin(name){
    if(name == null)   return 0;
    else return 1;
}

module.exports = {islogin};