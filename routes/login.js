const bcrypt = require("bcrypt");
const { getAccessToken, getRefreshToken } = require("../routes/utils");

//express
const express = require("express");
const router = express.Router();

// prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// login
router.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password))
      return res.status(400).send({ error: "Email and Password are required" });

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
      where: {
        email: email,
      },
    });

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.status(200).send({
          id: user.id,
          username: user.username,
          accessToken: getAccessToken(user),
          refreshToken: getRefreshToken(user),
        });
      } else {
        res.status(400).send({ error: "Invalid Password" });
      }
    } else {
      res.status(401).send({ error: "User does not exist" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
