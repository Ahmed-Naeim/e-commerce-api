const nodemailer = require("nodemailer");
const SMTPTransport = require("nodemailer/lib/smtp-transport");

exports.sendEmail = async (options) => {
    //Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    //Define the email options
    const mailOptions = {
        from: `E-commerce App <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    //Send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Nodemailer error:', err);
        throw err;
    }
}