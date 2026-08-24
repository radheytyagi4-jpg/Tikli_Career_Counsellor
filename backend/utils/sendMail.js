import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();


const sendMail = async (options) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email credentials are not set in env");
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("error sending mail : ", error);
        throw error;
    }
};

export default sendMail;