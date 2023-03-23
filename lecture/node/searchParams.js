const {URL} = require('url');

const MyURL = new URL('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');

console.log('searchParams : ', MyURL.searchParams);
console.log('searchParams.getAll() : ', MyURL.searchParams.getAll('category'));
console.log('searchParams.get() : ', MyURL.searchParams.get('limit'));
console.log('searchParams.has() : ', MyURL.searchParams.has('page'));
console.log('searchParams.keys() : ', MyURL.searchParams.keys());
console.log('searchParams.values() : ', MyURL.searchParams.values());

console.log('------------------------------------');

MyURL.searchParams.append('filter','es3');
MyURL.searchParams.append('filter','es5');
console.log(MyURL.searchParams.getAll('filter'));

MyURL.searchParams.set('filter','es6');
console.log(MyURL.searchParams.getAll('filter'));

MyURL.searchParams.delete('filter');
console.log(MyURL.searchParams.getAll('filter'));

MyURL.searchParams.append('filter','es6');

console.log('searchParams.toString() : ', MyURL.searchParams.toString());
MyURL.search = MyURL.searchParams.toString();
console.log('------------------------------------');
console.log('myURL',MyURL);