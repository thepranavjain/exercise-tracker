const { Schema } = require("mongoose");
const { ISODateWithoutTime } = require("./shared");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  log: [
    {
      description: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: ISODateWithoutTime,
      },
    },
  ],
});

module.exports = UserSchema;
