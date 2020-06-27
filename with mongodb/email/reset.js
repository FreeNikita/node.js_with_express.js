const keys = require('../keys')

module.exports = (email, token) => {
    return ({
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Reset password',
        html: `
            <div>
                <h1>Are you forgot password? </h1>
                <p>If not, please don't ignore this latter</p>
            </div>
            <a href="${keys.BASE_URL}auth/password/${token}">Reset password</a>
        `
    })
}