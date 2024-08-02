import nodemailer from "nodemailer"


const sendEmail = async ({ from = process.env.EMAIL, to, subject, text, cc, bcc, html, attachments } = {}) => {

    const transporter = nodemailer.createTransport({
        // service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_GMAIL,
        },
    });


    const info = await transporter.sendMail({
        from: `"EUNOIA👻"${from}`,
        to,
        subject,
        text,
        cc,
        bcc,
        html,
        attachments
    });

    console.log("Message sent: %s", info);

}

export default sendEmail