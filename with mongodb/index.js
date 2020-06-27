const express = require('express')
const path = require('path')
const mongose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const csurf = require('csurf')
const flash = require('connect-flash')

const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const homeRoutes = require('./routers/home')
const addRoutes = require('./routers/add')
const coursesRoutes = require('./routers/courses')
const cardRoutes = require('./routers/card')
const orderRoutes = require('./routers/orders')
const authRoutes = require('./routers/auth')

const { authMiddleware, isAuthMiddleware, userMiddleware } = require('./middleware')
const keys = require('./keys')

const app = express()

const hbs = expressHandlebars.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require("./untils/hbs-helper")
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csurf({}))
app.use(flash())
app.use(authMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', isAuthMiddleware, addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', isAuthMiddleware, cardRoutes)
app.use('/orders', isAuthMiddleware, orderRoutes)
app.use('/auth', authRoutes)

async function start(){
    try {
        await mongose.connect(keys.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        })

        app.listen(keys.PORT, () => {
            console.log(`Server is running on port ${keys.PORT}`)
        })
    } catch (e) {
        console.log("Err start", e)
    }
}

start()
