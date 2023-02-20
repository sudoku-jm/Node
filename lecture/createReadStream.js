const fs = require("fs");
const readStream = fs.createReadStream("./readme3.txt", { highWaterMark: 16 }); //안써주면 기본값 64KB로 끊어서 데이터 보낸다.
const data = [];

//전달
readStream.on("data", (chunk) => {
  //chunk로 올때마다 모아주기
  data.push(chunk);
  console.log("data : ", chunk, chunk.length, chunk.toString());
});

//전달 완료
readStream.on("end", () => {
  console.log("end : ", Buffer.concat(data).toString());
});

//에러발생
readStream.on("error", (err) => {
  console.log("error : ", err);
});
