const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const TodoSchema = new Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    state: { type: String, enum: ["TODO", "DONE"], default: "TODO" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
    dueDate: { type: Date },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
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
