const nodemailer = require("nodemailer");

const mailSender = async (emailOptions) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail(emailOptions);
        return info;
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw error; 
    }
};

module.exports = mailSender;
