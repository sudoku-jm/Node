const express = require("express");
const { Comment, User } = require("../models");

const router = express.Router();

router
  .route("/") //  /comments 라우터
  //POST /comments
  .post(async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: req.body.id },
      });
      console.log("user???====================", user);
      if (user) {
        const comment = await Comment.create({
          commenter: req.body.id,
          comment: req.body.comment,
        });
        console.log(comment);
        return res.status(201).json(comment);
      } else {
        return res.send(`${req.body.id}번 사용자가 없습니다`);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router
  .route("/:id") // /comments/:id 라우터
  //PATCH (부분수정) /comments/:id
  .patch(async (req, res, next) => {
    try {
      const result = await Comment.update(
        {
          comment: req.body.comment,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  //DELETE (삭제) /comments/:id
  .delete(async (req, res, next) => {
    try {
      const result = await Comment.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.json(result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
