import transporter from "../utils/nodemailer.js";

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"BloomTale" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Verify your email - BloomTale",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};

export default sendOtpEmail;
