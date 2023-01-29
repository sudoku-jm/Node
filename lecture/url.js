const url = require('url');
const {URL} = url;
const myUrl = new URL('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000&sercate2=001001001#anchor');
const parsedUrl = url.parse('http://www.gilbut.co.kr/book/bookList.aspx?sercate1=001001000&sercate2=001001001#anchor');

console.log('WHATWG방식');
console.log('new URL():',myUrl);
console.log('url.format():',url.format(myUrl));
console.log('--------------------------------------');
console.log('--------------------------------------');
console.log('기존노드방식');
console.log('url.parse():',parsedUrl);
console.log('url.format():',url.format(parsedUrl));
