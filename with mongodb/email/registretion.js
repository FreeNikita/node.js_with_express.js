const keys = require('../keys')

module.exports = function (email) {
    return ({
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account was create',
        html: `
            <div>
                <h1>Hello</h1>
                <p>Account with ${to} was create</p>
            </div>
            <a href="${keys.BASE_URL}">site</a>
        `
    })
}