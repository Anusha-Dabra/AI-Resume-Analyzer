const JWT = require("jsonwebtoken")
const tokenBlackListModel = require("../Model/blacklist.model")

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: " Token not found in cookies"
            })
        }

        const isTokenBlackListed = await tokenBlackListModel.findOne({
            token
        })

        if (isTokenBlackListed) {
            return res.status(401).json({
                message: "Invalid token"
            })
        }


        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET)

            req.user = decoded //all the details of the user will be stored in decoded,which will be stored in req.user for using in the next middleware
            next()

        } catch (error) {
            return res.status(401).json({
                message: "invalid token"
            })
        }




    } catch (err) {
        console.log(err)
    }
}

module.exports = { authUser }