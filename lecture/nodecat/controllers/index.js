const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;  //origin 헤더추가.
/* 
  /test 라우터
  1. 토큰 테스트 라우터
  2. 토큰 발급시도 /localhost:8002/v1/token
  3. 토큰 발급 후 바로 유효성 테스트. /localhost:8002/v1/test
  4. 토큰 만료 시 만료 표시
*/
// exports.test = async (req, res, next) => { // 토큰 테스트 라우터
//     try {
//       if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
//         const tokenResult = await axios.post('http://localhost:8002/v1/token', {
//           clientSecret: process.env.CLIENT_SECRET,
//         });
//         if (tokenResult.data?.code === 200) { // 토큰 발급 성공
//           req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
//         } else { // 토큰 발급 실패
//           return res.json(tokenResult.data); // 발급 실패 사유 응답
//         }
//       }
//       // 발급받은 토큰 테스트
//       const result = await axios.get('http://localhost:8002/v1/test', {
//         headers: { authorization: req.session.jwt },
//       });
//       return res.json(result.data);
//     } catch (error) {
//       console.error(error);
//       if (error.response?.status === 419) { // 토큰 만료 시
//         return res.json(error.response.data);
//       }
//       return next(error);
//     }
//   };

const request = async (req, api) => {
  try{
      if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급 시도
        const tokenResult = await axios.post(`${URL}/token`, {
          clientSecret: process.env.CLIENT_SECRET,
        });

        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      }

      // 발급받은 토큰을 요청 API와 함께 전달. API요청
      return await axios.get(`${URL}${api}`, {
        headers: { authorization: req.session.jwt },
      });

  }catch(err){
    console.error(err);
    if (err.response?.status === 419) { // 토큰 만료 시
        delete req.session.jwt;
        return request(req, api); //발급 재요청.
    }
    // return error.response; 또는 throw err;
    throw err;  //419외 다른 에러 발생 시
  }
}

//GET /myposts
exports.getMyPoster = async(req, res, next) => {
  try{
    // http://localhost:8002/v1/posts/my 호출.
    const result = await request(req, '/posts/my');
    res.json(result.data);
  }catch(err){
    console.error(err);
    next(err);
  }
};


//GET /search/:hashtag
exports.searchByHashtag = async(req, res, next) => {
  try{
    // http://localhost:8002/v1//posts/hashtag/노드 호출
    const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
    res.json(result.data);
  }catch(err){
    if(err.code){
      console.error(err);
      next(err);
    }
  }
};