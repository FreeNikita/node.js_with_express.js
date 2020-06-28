const User = require('../modules/user')

const authMiddleware = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
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

const errorPage = (req, res, next) => {
    res.status(404).render('404', {
        title: 'Page is not found'
    })
}

module.exports = {
    authMiddleware,
    isAuthMiddleware,
    userMiddleware,
    errorPage
}