const crypto = require('crypto');

const algoritm = 'aes-256-cbc';
const key = 'abcdefghijklmnopqrstuvwxyz123456'; //32바이트
const iv = '1234567890123456'; //16바이트

const cipher = crypto.createCipheriv(algoritm,key, iv);
let result = cipher.update('암호화할 문장을 여기에 적어봐요','utf8','base64');
result += cipher.final('base64');
console.log('암호화:',result);

const decipher = crypto.createDecipheriv(algoritm,key ,iv);
let result2 = decipher.update(result, 'base64', 'utf8');
result2 += decipher.final('utf8');
console.log('복호화:',result2);