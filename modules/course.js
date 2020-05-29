const uuid = require('uuid').v4
const fs = require("fs")
const path = require('path')

function saveFile(courses) {
    new Promise(((resolve, reject) => {
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
        saveFile(courses)
    }

     static async update(course) {
        const courses = await Course.getAll()
        const idx = courses.findIndex(c => c.id === course.id)
        courses[idx] = course;
        saveFile(courses)
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

    static async getById(id) {
        const courses = await Course.getAll()
        return courses.find(c => c.id === id)
    }
}

module.exports = Course