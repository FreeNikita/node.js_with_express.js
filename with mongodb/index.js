const express = require('express')
const path = require('path')
const mongose = require('mongoose')

const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const homeRoutes = require('./routers/home')
const addRoutes = require('./routers/add')
const coursesRoutes = require('./routers/courses')
const cardRoutes = require('./routers/card')

const app = express()

const hbs = expressHandlebars.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)

const PORT = process.env.PORT || 3000

async function start(){
    try {
        const  url = "mongodb+srv://nikita:JaB5sqmHVoyLzfaT@cluster0-boop9.mongodb.net/shop"
        await mongose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log("Err start", e)
    }
}

start()