const {Router} = require('express')
const { authMiddleware } = require('../middleware')
const User = require('../modules/user')

const router = Router()

router.get('/', authMiddleware, async (req, res) => {
    res.render("profile", {
        title: 'Profile',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name
        }

        if (req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router