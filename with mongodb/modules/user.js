const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            courseId: {
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
            count: {
                type: Number,
                required: true,
                default: 1,
            }
        }]
    }
})

userSchema.methods.addToCart = function(course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(item => {
        return item.courseId.toString() === course.id.toString()
    })
    
    if(idx >= 0 ){
        items[idx].count++
    } else {
        items.push({
            courseId: course._id,
            count: 1,
        })
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.removeFromCart = function(id) {
    let items = [...this.cart.items]
    const idx = items.findIndex(item => item.courseId._id.toString() === id.toString())

    if(items[idx].count === 1){
        items = items.filter(item => item.courseId._id.toString() !== id.toString())
    } else {
        items[idx].count--
    }

    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = { items : []}
    return this.save()
}

module.exports = model('User', userSchema)