const { Router } = require('express')
const Card = require('./../modules/card')
const Course = require('./../modules/course')
const router = Router()

router.post("/add", async (req, res) => {
    const course = await Course.getById(req.body.id)
    await Card.add()
    res.redirect("/card")
})

router.get("/", async (req, res) => {
    const card = Card.fetch()
    res.render('card', {
        title: Card,
        isCard: true,
        card
    })
})

module.exports = router