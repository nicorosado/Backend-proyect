import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

let configOptions = {
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
    }
}
const transporter = nodemailer.createTransport(configOptions)
function sendMail(email) {
    transporter.sendMail({
        encoding: 'utf8',
        from: 'noreply.nicorosado.nr@gmail.com',
        to: [email],
        subject: 'Your user was deleted',
        text: 'Your user was deleted due to inactivity (2 days)',
    });
}


function sendEmail(userEmail, productName) {
    transporter.sendMail({
        encoding: 'utf8',
        from: 'noreply.nicorosado.nr@gmail.com',
        to: [userEmail],
        subject: `Your product ${productName} was deleted`,
        text: `Your product ${productName} was deleted from store.`,
    });
}

export { sendMail, sendEmail }

