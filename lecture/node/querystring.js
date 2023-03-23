const url = require('url');
const querystring = require('querystring');

const parsedUrl = url.parse('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript'); 

const query = querystring.parse(parsedUrl.query); //쿼리를 객체로 만듦.
console.log('querystring.parse() : ', query);
console.log('querystring.stringify() : ', querystring.stringify(query));