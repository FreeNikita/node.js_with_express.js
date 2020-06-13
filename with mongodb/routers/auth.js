const { Router } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../modules/user')

const router = Router()

router.get("/login", async (req, res) => {
    res.render("auth/login", {
        title: "Auth",
        isLogin: true
    })
})

router.get("/logout", async (req, res) => {
    // req.session.isAuthenticated = false
    req.session.destroy(() => {
        res.redirect('/')
    });
})

router.post("/login", async (req, res) => {
    try {
         const {email, password } = req.body;
        const candidate = await User.findOne({email})

        !candidate && res.redirect('/auth/login#login')
        const comparePassword = bcryptjs.compare(password, candidate.password)
        const isLogin = password === candidate.password

        !isLogin && res.redirect('/auth/login#login')


        req.session.user = candidate
        req.session.isAuthenticated = true

        req.session.save((err) => {
            if(err) throw err
            res.redirect('/')
        })

    } catch (e) {
        console.log('err', e)
    }
})

router.post("/registration", async (req, res) => {
    try {
        const {  email, password, password_confirm, name} = req.body
        const candidate = User.findOne({email})

        candidate && res.redirect('/auth/login#registration')

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
        console.log("err", e)
    }
})

module.exports = router