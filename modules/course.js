const uuid = require('uuid').v4
const fs = require("fs")
const path = require('path')

class Course {
    constructor(title, price, image) {
        this.tile = title
        this.price = price
        this.image = image
        this.id = uuid()
    }

    toJson(){
        return {
            title: this.tile,
            price: this.price,
            image: this.image,
            id: this.id,
        }
    }

    async save() {
        const courses = await Course.getAll()
        courses.push(this.toJson())

        return new Promise(((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                (err) => {
                    if(err) reject(err)
                    resolve()
                }
            )
        }))
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, "..", 'data', "courses.json"),
                'utf-8',
                (err, res) => {
                    if (err) reject(err)
                    resolve(JSON.parse(res))
                }
            )
        })

    }
}

module.exports = Course