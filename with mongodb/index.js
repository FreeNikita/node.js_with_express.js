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
const orderRoutes = require('./routers/orders')
const authRoutes = require('./routers/auth')

const User = require('./modules/user')

const app = express()

const hbs = expressHandlebars.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(async (req, res, next) => {
    try{
        req.user = await User.findById("5ed94486c5ab6d11fdcb358d")
        next()
    } catch (err) {
        console.log('err', err)
    }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start(){
    try {
        const  url = "mongodb+srv://nikita:JaB5sqmHVoyLzfaT@cluster0-boop9.mongodb.net/shop"
        await mongose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        const candidate = await User.findOne()

        if(!candidate) {
            const user = new User({
                email: 'test@test.test',
                name: 'TestUser',
                cart: { items: []}
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log("Err start", e)
    }
}

start()
