const User = require('../modules/user')

const getUserCart = async (id) => User.findById(id).populate('cart.items.courseId')

const mapCourseToPage = (carts) => {
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

module.exports = {
    getUserCart,
    mapCourseToPage
}