const { Schema, model  } = require('mongoose')

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: Number,
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = model('Course', courseSchema)