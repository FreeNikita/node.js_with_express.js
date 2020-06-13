const User = require('../modules/user')

const authMiddleware = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated
    next()
}

const isAuthMiddleware = (req, res, next) => {
    if(!req.session.isAuthenticated) return res.redirect('/');
    next()
}

const userMiddleware = async (req, res, next) => {
    if(!req.session.user) return next()

    req.user = await User.findById(req.session.user._id)
    next()
}

module.exports = {
    authMiddleware,
    isAuthMiddleware,
    userMiddleware
}