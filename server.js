const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { model, connect, connection } = require("mongoose");
const UserSchema = require("./schema");

const { MONGO_URI, PORT } = process.env;

if (!MONGO_URI)
  throw new Error(
    "MongoDB Connection URI not provided in .env or in environment variable."
  );
connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
connection.once("open", () =>
  console.log("\x1b[32m%s\x1b[0m", "Successfully connected to MongoDB")
);

const userModel = model("user", UserSchema);

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(PORT || 3000, () => {
  console.log(
    "\x1b[32m%s\x1b[0m",
    "Your app is listening on port " + listener.address().port
  );
});
