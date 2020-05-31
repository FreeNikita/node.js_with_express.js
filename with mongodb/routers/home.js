const { Router } = require('express')
const router = Router()

router.get("/", (req, res) => {
    res.render("home", {
        title: 'home',
        isHome: true,
    })
})

module.exports = router;