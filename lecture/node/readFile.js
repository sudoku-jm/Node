const fs = require('fs').promises;
fs.readFile('./readme.txt')
    .then((data) => {
        console.log(data);  //0101과 같은 2진 데이터 및 16진법 데이터로 나온다.
        console.log(data.toString()); // 사람이 읽을 수 있는 string 데이터로 변환
    })
    .catch((err) => {
        console.error(err);
    }); 