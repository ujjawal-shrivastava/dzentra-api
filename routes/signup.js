const { genPassword } = require("../routes/utils");
//express
const express = require("express");
const router = express.Router();

//prisma
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//signup
router.post("/", async (req, res, next) => {
  try {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!(email && password && username))
      return res
        .status(400)
        .send({ error: "Email, Username and Password are required." });
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: await genPassword(password),
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
    res.send(user);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).send({
          error: "User already exists with the given email or username!",
        });
      }
    }
    next(err);
  }
});

module.exports = router;
