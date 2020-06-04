const { Router } = require('express')
const Course = require('../modules/course')
const router = Router()

router.get('/', (req, res) => {
    res.render("add", {
        title: 'Add Course',
        isAdd: true,
    })
})

router.post('/', async (req, res) => {
    const { body: {title, price, image}, user: {_id: userId }} = req
    const course = new Course({title, price, image, userId })

    try{
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log("err", e)
    }
})

module.exports = router;