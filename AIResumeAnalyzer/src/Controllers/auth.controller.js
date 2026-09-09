const express = require("express")
const { userModel } = require("../Model/user.model")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const tokenBlackListModel = require("../Model/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user, usrname,email and password in request
 * @access public
 */

async function registerUser(req, res) {
    const { userName, email, password } = req.body

    if (!userName || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"

        })
    }

    const ifuserexist = await userModel.findOne({
        $or: [
            { userName: userName },
            { email: email }
        ]
    })

    try {
        if (ifuserexist) {

            /* ifuserexists already */
            console.log("Username already exists")
            return res.status(409).json({
                message: "User already exists",

            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            userName: userName,
            email: email,
            password: hash
        })

        const token = await JWT.sign({
            id: user._id      //one attribute must be unique, to uniquely identify the user 
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                userName: user.userName,
                email: user.email,
            }
        })

    } catch (error) {
        console.log("error while registering user:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

/**  
 * @name loginUserController
 * @description login a user, usrname,email and password in request
 * @access public
*/
async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        $or: [
            // { userName },
            { email }
        ]
    })

    if (!user) {
        console.log("User not found");
        return res.status(409).json({
            message: "User not found"
        })
    }

    try {
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Password is incorrect"
            })
        }

        const token = JWT.sign({
            id: user._id
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
            }
        })

    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

/**  
 * @name logoutUserController
 * @description logout a user
 * @access public
*/
async function logoutUser(req, res) {
    const token = req.cookies?.token

    try {
        if (token) {
            try {
                await tokenBlackListModel.create({ token })
            } catch (blacklistErr) {
                console.error("Token blacklist record error (proceeding with logout):", blacklistErr)
            }
        }

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        })

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        console.error("Error during logout:", error)
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            path: "/"
        })
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }
}


/**  
 * @name profileController
 * @description get user profile
 * @access private
*/

async function profile(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
            }
        })
    }
    catch (error) {
        console.error("Error: ", error);
    }
}

module.exports = { registerUser, loginUser, logoutUser, profile }