const { Router } = require('express')
const Courses = require("./../modules/course")
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Courses.getAll()
    res.render("courses", {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

module.exports = router;