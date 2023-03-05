const express = require("express");
const User = require("../models/user");

const router = express.Router();

//기본 라우터 연결 확인용
router.get("/", async (req, res, next) => {
  //GET /
  try {
    const users = await User.findAll();
    res.render("sequelize", { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
