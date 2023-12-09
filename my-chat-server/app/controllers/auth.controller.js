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
      res.cookie("authorization", token, { httpOnly: true , maxAge: 1000 * 60 * 60*24 });
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

      res.cookie("authorization", token, { httpOnly: true, secure: true, maxAge: 1000 * 60 *1});

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
    const token = req.headers.authorization
    const {email , exp} =  verify(token , process.env.USER_SECRET_KEY)
    const user = await userModel.findOne({email})
    if(!user) throw createHttpError.NotFound("please login first")

     if(exp * 1000 < Date.now()){
        console.log('expired');
        const {refreshToken} = await userModel.findOne({email} , {refreshToken:1})    
        const {email:refreshEmail , exp : refreshExp} = verify(refreshToken , process.env.REFRESH_SECRET_KEY)    
        if(refreshExp * 1000 < Date.now()){
            const newToken = signAccessToken({email :refreshEmail})
            res.cookie("newAuthorization" , newToken , {httpOnly:true , secure:true , maxAge:1000*60*60*24})
        }else{
            throw createHttpError.Gone("login again")
        }
     }
     return res.status(200).json({
      status:200 , 
      data: {message:"Authenticated"}
     })
  } catch (error) {
    next(error)
  }
  }
}

module.exports = {
  AuthController: new AuthController(),
};