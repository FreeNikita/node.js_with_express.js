const { Router } = require('express')
const Course = require("../modules/course")
const router = Router()
const {isAuthMiddleware} = require('../middleware')

const isOwner = (course, req) => {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try{
        const courses = await Course.find().populate("userId", 'email name')
        res.render("courses", {
            title: 'Courses',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        })
    } catch (e) {
        console.log("Course Error: ", e)
    }
})

router.post('/edit', async (req, res) => {
    try {
        const {id, ...fields} = req.body
        delete req.body.id
        const course = await Course.findById(id)
        if(isOwner(course, req)){
            Object.assign(course, fields)
            await course.save();
            res.redirect('/courses')
        } else {
            return res.redirect('/')
        }
    } catch (e) {
        console.log('Edit Course Error: ', e)
    }
})

router.get('/:id/edit', isAuthMiddleware, async (req, res) => {
    if(!req.query.allow ) {
        return res.redirect('/')
    }

    try{
        const {id} = req.params
        const course = await Course.findById(id)

        if(isOwner(course, req)) {
            res.render('course-edit',{
                title: `Edit ${course.title}`,
                course
            })
        } else {
            return res.redirect('/')
        }

    } catch (e) {
        console.log("Course Error: ", e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        })
    } catch (e) {
        console.log("Course Error: ", e)
    }

})

router.post('/remove', isAuthMiddleware, async (req, res) => {
    try{
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log("err", e)
    }

})

module.exports = router;