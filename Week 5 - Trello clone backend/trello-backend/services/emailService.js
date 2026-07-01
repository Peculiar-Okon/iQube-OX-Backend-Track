const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const sendVerificationOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px">
        <h2>Email Verification</h2>

        <p>Welcome! Use the OTP below to verify your email.</p>

        <h1 style="
          letter-spacing:6px;
          color:#2563eb;
        ">
          ${otp}
        </h1>

        <p>This OTP expires in <strong>10 minutes</strong>.</p>

        <p>If you didn't create this account, you can safely ignore this email.</p>
      </div>
    `,
  });
};

const sendPasswordResetOTP = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Password Reset</h2>

        <p>You requested to reset your password.</p>

        <h1 style="letter-spacing:6px; color:#2563eb;">
          ${otp}
        </h1>

        <p>This OTP expires in <strong>10 minutes</strong>.</p>

        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationOTP,
  sendPasswordResetOTP,
};