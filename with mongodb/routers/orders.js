const {Router} = require('express')
const Order = require("./../modules/orders")
const {getUserCart, mapCourseToPage} = require("../helper");

const router = Router()

router.get('/', async (req, res) => {
    try{
        const order = await Order.find({'user.userId': req.user._id})
            .populate("user.userId")

        res.render('orders', {
            isOrders: true,
            title: "Orders",
            orders: order.map(item => ({
                ...item._doc,
                price: item.courses.reduce((i, item) => {
                    return i +=  item.count * item.course.price
                }, 0)
            }))
        })
    } catch (e) {
        console.log("e", e)
    }
})

router.post('/', async (req, res) => {
    try{
        const {user} = req
        const {_id, name} = user
        const {cart: {items}} = await getUserCart(_id)
        const courses = items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc}
        }))

        const order = new Order({
            user: {
                name,
                userId: _id
            },
            courses
        })

        await order.save()
        await user.clearCart()

        res.redirect('./orders')
    } catch (e) {
        console.log("e", e)
    }

})

module.exports = router