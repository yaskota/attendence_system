import nodemailer from 'nodemailer'

const transport =nodemailer.createTransport({

    host: "smtp-relay.brevo.com",
    port: 587, 
    auth: {
        user: process.env.SMTP_LOGIN,
        pass: process.env.SMTP_PASS
    },
})

export default transport;