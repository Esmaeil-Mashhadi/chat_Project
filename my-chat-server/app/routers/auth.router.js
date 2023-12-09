const { Router } = require("express");
const { AuthController } = require("../controllers/auth.controller");

const router= Router()

router.post("/signUp" , AuthController.signUp)
router.post("/login" , AuthController.login)
router.post("/permission" , AuthController.checkPermission)





module.exports ={
    authRoutes : router
}