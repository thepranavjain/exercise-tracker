const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  log: [
    {
      description: {
        type: String,
        required: true,
        maxlength: 20,
      },
      duration: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
      },
    },
  ],
});

module.exports = UserSchema;
