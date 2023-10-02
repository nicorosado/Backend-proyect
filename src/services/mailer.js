import nodemailer from 'nodemailer'

let configOptions = {
    service: 'gmail',
    auth: {
        user: 'nicorosado.nr@gmail.com',
        pass: 'mwlkdfnuormvbres'
    }
}
const transporter = nodemailer.createTransport(configOptions)
function sendMail(email) {
    transporter.sendMail({
        encoding: 'utf8',
        from: 'noreply.nicorosado.nr@gmail.com',
        to: [email],
        subject: 'Mensaje desde node',
        text: 'Your user was deleted due to inactivity (2 days)',
    });
}

export { sendMail }

