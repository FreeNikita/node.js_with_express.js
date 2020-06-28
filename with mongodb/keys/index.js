require('dotenv').config();

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    BASE_URL: process.env.BASE_URL
}