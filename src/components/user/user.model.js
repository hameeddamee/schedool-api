const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    fullName: { type: String, trim: true },
    avatar: { type: String, trim: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: { type: String, trim: true },
    enable: { type: Boolean, default: true },
    oauthId: {
      type: String,
      trim: true,
      default: "",
    },
    oauthType: {
      type: String,
      trim: true,
      enum: ["LOCAL", "GOOGLE"],
      default: "LOCAL",
    },
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
        default: [],
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "todo",
        default: [],
      },
    ],
    settings: { type: [Schema.Types.ObjectId], ref: "setting", default: [] },
    resetPassword: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
  { collection: "users" }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    if (this.oauthId !== "") {
      return next();
    }

    const hash = await bcrypt.hashSync(this.password);
    this.password = hash;

    return next();
  } catch (e) {
    return next(e);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
