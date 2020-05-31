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
    const { title, price, image} = req.body
    const course = new Course({title, price, image})

    try{
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log("err", e)
    }
})

module.exports = router;