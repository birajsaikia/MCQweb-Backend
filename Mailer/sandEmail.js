// const transporter = require('../Config/nodemailer');

// const sendEmail = async (to, subject, text) => {
//   try {
//     await transporter.sendMail({
//       from: "chwapnamkashyap@gmail.com",
//       to,
//       subject,
//       text,
//     });

//     console.log(`✅ Email sent to ${to}`);
//     return { success: true, message: 'Email sent successfully' };
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//     return { success: false, message: 'Failed to send email' };
//   }
// };

//module.exports = sendEmail;

// Function to send an email
const sendEmail = async(to, subject, text) => {
  const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'kkaustavdeka2003@gmail.com',
          pass: 'ejtgploizmehugza',
        },
    });

    const info = await transporter.sendMail({
        from:'kkaustavdeka2003@gmail.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // html body
    });

    res.json(info);
};
