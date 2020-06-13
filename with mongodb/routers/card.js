const { Router } = require('express')
const Course = require('../modules/course')
const router = Router()

const { getUserCart, mapCourseToPage } = require('../helper/index')

router.get("/", async (req, res) => {
    const user = await getUserCart(req.session.user._id)
    const { courses, price } = mapCourseToPage(user.cart.items)

    res.render('card', {
        title: "Card",
        isCard: true,
        courses,
        price
    })
})

router.post("/add", async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)

    res.redirect("/card")
})

router.delete("/remove/:id", async (req, res) => {
    const user = await getUserCart(req.user._id)
    await user.removeFromCart(req.params.id)
    const { courses, price } = mapCourseToPage(user.cart.items)

    res.status(200).json({courses, price});
})

module.exports = router