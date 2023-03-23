// const value = require('./var');
const {odd , even} = require('./var');

// console.log(value);
// console.log(odd , even);

function checkOddEven(num){
    if(num % 2){
        return odd;
    }else{
        return even;
    }
}

module.exports = checkOddEven;
