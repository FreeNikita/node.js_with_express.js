const { Router } = require('express')
const { validationResult } = require('express-validator')
const Course = require('../modules/course')
const router = Router()
const { courseValidator } = require('../untils/validator')

router.get('/', (req, res) => {
    res.render("add", {
        title: 'Add Course',
        isAdd: true,
    })
})

router.post('/', courseValidator, async (req, res) => {
    const { body: {title, price, image}, user: {_id: userId }} = req
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).render("add", {
            title: 'Add Course',
            isAdd: true,
            errors: errors.array()[0].msg,
            data: {
                title,price,image
            }
        })
    }


    const course = new Course({title, price, image, userId })

    try{
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log("err", e)
    }
})

module.exports = router;