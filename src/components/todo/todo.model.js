const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const TodoSchema = new Schema(
  {
    linkId: { type: String, trim: true },
    guests: [
      {
        type: String,
        default: [],
      },
    ],
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    settings: { type: Schema.Types.ObjectId, ref: "Setting" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
  { collection: "todos" }
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
