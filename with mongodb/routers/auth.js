const {Router} = require('express')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const {validationResult} = require('express-validator')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../modules/user')
const keys = require('../keys')
const reqEmail = require('../email/registretion')
const reqEmailReset = require('../email/reset')
const {registerValidator, loginValidator} = require('../untils/validator')

const router = Router()

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(keys.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport(sendgrid({
    auth: {
        api_key: keys.SENDGRID_API_KEY
    }
}))

router.get("/login", async (req, res) => {
    res.render("auth/login", {
        title: "Auth",
        isLogin: true,
        registerError: req.flash('registerError'),
        logError: req.flash('logError')
    })
})

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
})

router.post("/login", loginValidator, async (req, res) => {
    try {
        const { email } = req.body;

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('logError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#login')
        }

        const candidate = await User.findOne({email})
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save((err) => {
            if (err) throw err
            res.redirect('/')
        })

    } catch (e) {
        console.log('err', e)
    }
})

router.post("/registration", registerValidator, async (req, res) => {
    try {
        const {email, password, password_confirm, name} = req.body
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#registration')
        }

        const hashPassword = await bcryptjs.hash(password, 11)
        const user = await new User({
            card: {items: []},
            password: hashPassword,
            email,
            name,
        })
        await user.save()
        res.redirect('/auth/login#login')
    } catch (e) {
        console.log("registerError", e)
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "Reset",
        error: req.flash('error')
    })
})

router.get('/password/:token', async (req, res) => {
    try {
        const {token} = req.params

        if (!token) {
            return req.redirect('/auth/login')
        }

        const candidate = await User.findOne({
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (candidate) {
            res.render('auth/password', {
                title: "Reset password",
                error: req.flash('error'),
                userId: candidate._id.toString(),
                token
            })
        } else {
            return res.redirect('/auth/login')
        }

    } catch (e) {
        console.log("Reset Password Error: ", e)
    }
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', "We have some problem, please again late")
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString("hex");
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000

                await candidate.save()
                await transporter.sendMail(reqEmailReset(candidate.email, token))
                res.redirect('/auth/login')
            } else {
                req.flash("error", "We couldn't find this email")
                return res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log("Reset Password Error: ", e)
    }
})

router.post('/password', async (req, res) => {
    try {
        const {userId, token, password, r_password_confirm} = req.body;
        const candidate = await User.findOne({
            _id: userId,
            resetToken: token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (candidate) {
            candidate.password = await bcryptjs.hash(password, 10)
            candidate.resetToken = undefined
            candidate.resetTokenExp = undefined
            await candidate.save()
            res.redirect('/auth/login')
        } else {
            req.flash('error', "Token is not live")
            return req.redirect('/auth/login')
        }

    } catch (e) {
        console.log("Reset Password Error: ", e)
    }
})

module.exports = router