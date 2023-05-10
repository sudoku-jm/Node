const jwt = require('jsonwebtoken');
const { Domain, User, Post, Hashtag } = require('../models');

// 토큰 발급
// POST /v2/token
exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    // 도메인 등록 검사. 요금제, 할당량 등 검사.
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30 분
      issuer: 'nodebird',
    });


    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};

// 토근 유효성 테스트
// POST /v2/test
exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};


//POST v1/posts/my
exports.getMyPosts = (req, res) => {
  //토큰 유효성 검사가 끝나고 들어오므로 바로 작성
  /*
    res.locals.decoded 생김새.
    {"id":1,"nick":"jm","iat":1682138747,"exp":1682138807,"iss":"nodebird"}
  */
  Post.findAll({
    where : {
      userId : res.locals.decoded.id
    }
  }).then((posts) => {
    console.log(posts);
    res.json({
      code : 200,
      payload : posts,      //payload 라는 곳에 posts 데이터를 담아서 전달.
    });
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  });
};


//POST v1/posts/hashtag/:title
exports.getPostsByHashtag = async(req, res) => {
  try{
    const hashtag = await Hashtag.findOne({
      where : {
        title : req.params.title
      }
    });

    if(!hashtag){
      return res.status(404).json({
        code : 404,
        message : '검색 결과가 없습니다',
      });
    }

    const posts = await hashtag.getPosts();

    return res.json({
      code : 200,
      payload : posts,
    })

  
  }catch(err){
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
};