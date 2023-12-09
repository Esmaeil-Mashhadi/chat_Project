const createHttpError = require("http-errors");
const { userModel } = require("../../models/usermodel");
const { signAccessToken, signRefreshToken } = require("../utils/signAccessToken");
const { checkUserExistence } = require("../utils/DBFunctions/checkUserExistence");
const { verify } = require("jsonwebtoken");
const { hashPassword, verfiyPassword } = require("../utils/hash&compare");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email && !password) {
        throw createHttpError.BadRequest("invalid data");
      }
      await checkUserExistence(email);
      const token = await signAccessToken({ email });
      const refreshToken = signRefreshToken({ email });
      const hashedPassword = await hashPassword(password);
      const user = await userModel.create({
        email,
        password: hashedPassword,
        token,
        refreshToken,
      });

      if (!user) throw createHttpError.InternalServerError("failed to sign up!");
      res.cookie("authorization", token, { signed: true, httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
      return res.status(201).json({
        statusCode: 201,
        data: {
          message: "you signed up successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) throw createHttpError.NotFound("user not found, sign up please");
      const checkPassword = verfiyPassword(password, user.password);
      if (!checkPassword) throw createHttpError.BadRequest("user or password is not correct");
      const token = await signAccessToken({ email: user.email });

      res.cookie("authorization", token, { signed: true, httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 });

      return res.status(200).json({
        status: 200,
        data: {
          message: "welcome back",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  checkPermission = async (req, res, next) => {
  try {
     console.log(req.signedCookies); // داخل ریکوست نمی تونم ساین کوکی رو داشته باشم هر کار می کنم
  } catch (error) {
    next(error)
  }
  }
}

module.exports = {
  AuthController: new AuthController(),
};