const { body } =require('express-validator')
const bcryptjs = require('bcryptjs')
const User = require('../modules/user')

const registerValidator = [
    body("email").isEmail().withMessage("Enter correct email").custom(async (value) => {
        try {
            const candidate = await User.findOne({email: value})
            if(candidate) {
                return Promise.reject("This email is already used")
            }
            return true
        } catch (e) {
            console.log('Get User Error: ', e)
        }
    }).normalizeEmail(),
    body('password', "Password must be min 6 and max 24")
        .isLength({min: 6, max: 24})
        .isAlphanumeric()
        .trim(),
    body("password_confirm").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Password must be same")
        }
        return true
    }),
    body('name')
        .isLength({min: 3})
        .withMessage("Name must be min 3 symbol")
        .trim()
]

const loginValidator = [
    body("email").isEmail().withMessage("Enter correct email")
        .custom(async (value, {req}) => {
        try {
            const candidate = await User.findOne({email: value})
            if(!candidate) {
                return Promise.reject("Email or password are not valid")
            }
            const isLogin = await bcryptjs.compare(req.body.password, candidate.password)

            if(!isLogin) {
                return Promise.reject("Email or password are not valid")
            }

            return true
        } catch (e) {
            console.log('Login User Error: ', e)
        }
    }),
]

const courseValidator = [
    body('title').isLength({min: 5, max: 24}).withMessage("Title must be from 6 to 24"),
    body('price').isNumeric().withMessage("Price is not correct"),
    body('image', "Enter valid url image").isURL()
]

module.exports = {
    registerValidator,
    loginValidator,
    courseValidator
}