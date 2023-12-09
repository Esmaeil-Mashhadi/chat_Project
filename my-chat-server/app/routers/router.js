const { Router } = require("express");
const { authRoutes } = require("./auth.router");

const router = Router()

router.use('/auth' , authRoutes)
router.get("/" , (req , res , next)=>{
    res.json("hi")
})

module.exports  = {
    allRoutes :router
}