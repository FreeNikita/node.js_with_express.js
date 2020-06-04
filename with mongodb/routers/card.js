const { Router } = require('express')
const Course = require('../modules/course')
const User = require('../modules/user')
const router = Router()

function mapCourseToPage(carts) {
    let courses = [],
        price = 0

    for (const course of carts) {
        courses.push({
            ...course.courseId._doc,
            id: course.courseId._doc._id,
            count: course.count
        })
        price += course.courseId.price
    }

    return { courses , price }
}

const getUserCart = async (id) => User.findById(id).populate('cart.items.courseId')

router.get("/", async (req, res) => {
    const user = await getUserCart(req.user._id)
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