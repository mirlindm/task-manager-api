const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to: 'murati@ut.ee',
//     from: 'murati@ut.ee',
//     subject: 'This is my first creation!',
//     text: 'I hope this one actually gets to you'
// })

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'murati@ut.ee',
        subject: 'Thanks for joinin in!',
        text:  `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'murati@ut.ee',
        subject: 'We are sorry to see you go.',
        text: `Farewell, ${name}. We hope to see you return back to our website.`
    })

}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail

}