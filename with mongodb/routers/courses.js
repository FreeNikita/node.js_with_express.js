const { Router } = require('express')
const Course = require("../modules/course")
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find()
    res.render("courses", {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.post('/edit', async (req, res) => {
    const {id, ...fields} = req.body
    await Course.findByIdAndUpdate(id, fields)
    res.redirect('/courses')
})

router.get('/:id/edit', async (req, res) => {
    if(!req.query.allow ) {
        return res.redirect('/')
    }
    const {id} = req.params
    const course = await Course.findById(id)
    res.render('course-edit',{
        title: `Edit ${course.title}`,
        course
    })
})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})

router.post('/remove', async (req, res) => {
    try{
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.log("err", e)
    }

})

module.exports = router;