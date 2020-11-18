const mongoose = require("../db/mongoose");
const generatePassword = require("../utils/generatePassword");
const validatePassword = require("../utils/validatePassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const allCountries = require("../utils/allCountries");

const jwtSecret = process.env.JWT_SECRET || "secret";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "This field is required",
      minlength: 1,
    },
    email: {
      type: String,
      required: "This field is required",
      unique: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
      required: "required",
      validate(value) {
        const checkedPass = validatePassword(value);
        if (checkedPass.length > 0) {
          throw new Error(checkedPass);
        } else return true;
      },
    },
    about: {
      type: String,
    },
    age: {
      type: Number,
      min: [13, "You must be at least 13 to use this site"],
      max: [200, "Age too large"],
    },
    country: {
      type: String,
      enum: allCountries,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.plugin(uniqueValidator, { message: "This {PATH} is already taken" });

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  match: {
    public: "true",
  },
  options: {
    sort: { createdAt: -1 },
    limit: 10,
  },
});

UserSchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  match: {
    public: "true",
  },
  count: true,
});

UserSchema.path("email").validate(
  (value) => validator.isEmail(value),
  "You must enter a valid email"
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await generatePassword(this.password);
    this.password = hashedPassword;
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject({ virtuals: true });
  delete user.email;
  delete user.password;
  delete user.tokens;
  return user;
};

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    jwtSecret,
    { expiresIn: 100000 } //100000
  );
  this.tokens.push({ token });
  await this.save();

  return token;
};

/* UserSchema.methods.generateRefreshToken = async function () {
  const refreshToken = jwt.sign(
    { username: this.username, createdAt: new Date() },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: 2500000,
    }
  );

  this.refreshTokens.push({ token: refreshToken });
  await this.save();

  return refreshToken;
}; */

UserSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
