const { Router } = require('express')
const Card = require('../modules/card')
const Course = require('../modules/course')
const router = Router()

router.get("/", async (req, res) => {
    const card = await Card.fetch()
    // console.log(card)
    res.render('card', {
        title: "Card",
        isCard: true,
        courses: card.courses,
        price: card.price
    })
})

router.post("/add", async (req, res) => {
    const course = await Course.getById(req.body.id)
    await Card.add(course)
    res.redirect("/card")
})

router.delete("/remove/:id", async (req, res) => {
    const card = await Card.remove(req.params.id)
    // res.redirect("/card")
    res.status(200).json(card);

})

module.exports = router