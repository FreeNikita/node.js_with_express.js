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
    card: {
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

module.exports = model('User', userSchema)