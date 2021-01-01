const { Router } = require("express");
const bodyParser = require("body-parser");
const router = Router();

const { model } = require("mongoose");
const UserSchema = require("./schema");
const { ISODateWithoutTime } = require("./shared");

const userModel = model("user", UserSchema);

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/users", async (req, res) => {
  try {
    res.json(await userModel.find({}, "_id username"));
  } catch (err) {
    console.log("error in GET /users:", err.message);
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(500).send(err.message);
  }
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
      console.log("error in POST /new-user:", err.message);
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.status(400).send(err.errors.username.message || err.message);
    }
  }
});

router.post("/add", async (req, res) => {
  try {
    let { userId, description, duration, date } = req.body;
    const user = await userModel.findById(userId);
    if (!user) throw new Error("Unknown userId");
    user.log.push({
      description: description.trim(),
      duration: parseInt(duration),
      date: date ? new Date(date) : ISODateWithoutTime(),
    });
    const { _id, username, log } = await user.save();
    const newExercise = log.pop();
    res.json({
      _id,
      username,
      duration: newExercise.duration,
      description: newExercise.description,
      date: newExercise.date.toDateString(),
    });
  } catch (err) {
    console.log("err in POST /add", err);
    res.set("Content-Type", "text/plain; charset=utf-8");
    if (err.message === "Unknown userId") res.status(400).send(err.message);
    else if (err._message === "user validation failed")
      res.status(400).send(err.errors[Object.keys(err.errors)[0]].message);
    else res.status(500).send(err.message);
  }
});

module.exports = router;
