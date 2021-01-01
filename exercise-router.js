const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const { model } = require("mongoose");
const UserSchema = require("./schema");
const userModel = model("user", UserSchema);

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/users", (req, res) => {
  res.json([
    { _id: "001", username: "user 1" },
    { _id: "002", username: "user 2" },
  ]);
});

router.get("/log", (req, res) => {
  const { userId, from, to, limit } = req.query;
  res.json({
    _id: userId,
    username: "myusername",
    count: 3,
    log: [
      { description: "ex 3", duration: 30, date: "Fri Jan 01 2021" },
      { description: "ex 2", duration: 35, date: "Fri Jan 01 2021" },
      { description: "ex 1", duration: 30, date: "Fri Jan 01 2021" },
    ],
  });
});

router.post("/new-user", async (req, res) => {
  try {
    const { username } = req.body;
    const user = new userModel({
      username,
    });
    const { _id, username: savedUsername } = await user.save();
    res.json({ _id, username: savedUsername });
  } catch (err) {
    if (err.code === 11000) {
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.status(400).send("Username already taken");
    } else if (err.errors.username.kind === "maxlength") {
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.status(400).send("username too long");
    } else {
      console.log("error in /new-user:", err.message);
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.status(400).send(err.errors.username.message);
    }
  }
});

router.post("/add", (req, res) => {
  const { userId, description, duration, date } = req.body;
  res.json({
    _id: userId,
    username: "myusername",
    date,
    duration,
    description,
  });
});

module.exports = router;
