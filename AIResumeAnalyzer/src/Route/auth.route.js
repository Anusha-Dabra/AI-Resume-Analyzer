const express = require("express")
const router = express.Router()
const authController = require("../Controllers/auth.controller")
const authMiddleware = require("../Middlewares/auth.middleware")

/**
 * @route POST/api/auth/register
 * @description Register a user
 * @access Public
 * 
 */
router.post("/register", authController.registerUser)

/**
 * @route POST/api/auth/login
 * @description Login a user
 * @access Public
 * 
 */
router.post("/login", authController.loginUser)

/**
 * @route GET/api/auth/logout
 * @description logout a user
 * @access Public
 * 
 */

router.get("/logout", authController.logoutUser)

/**
 * @route GET/api.auth/profile
 * @description get user profile
 * @access private
 * 
 */

router.get("/profile", authMiddleware.authUser, authController.profile)



module.exports = router