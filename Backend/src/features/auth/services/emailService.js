import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

 console.log("EMAIL_USER:", process.env.EMAIL_USER);
 console.log(
  "EMAIL_PASSWORD:",
  process.env.EMAIL_PASSWORD ? "LOADED" : "NOT LOADED"
);


// REGISTER OTP EMAIL
export const sendRegisterOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"J-HUB" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "J-HUB Email Verification OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="color: #e50914; text-align: center;">
          J-HUB
        </h2>

        <h3>Email Verification</h3>

        <p>
          Thank you for registering with J-HUB.
        </p>

        <p>
          Your verification OTP is:
        </p>

        <h1 style="
          text-align: center;
          letter-spacing: 8px;
          color: #e50914;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for 1 minute.
        </p>

        <p>
          If you did not create this account, please ignore this email.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// LOGIN OTP EMAIL
export const sendLoginOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"J-HUB" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "J-HUB Login Verification OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="color: #e50914; text-align: center;">
          J-HUB
        </h2>

        <h3>Login Verification</h3>

        <p>
          Your login verification OTP is:
        </p>

        <h1 style="
          text-align: center;
          letter-spacing: 8px;
          color: #e50914;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for 5 minutes.
        </p>

        <p>
          If you did not try to login, please ignore this email.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// FORGOT PASSWORD OTP EMAIL
export const sendForgotPasswordOTPEmail = async (
  email,
  otp
) => {
  const mailOptions = {
    from: `"J-HUB" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "J-HUB Password Reset OTP",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">

        <h2 style="color: #e50914; text-align: center;">
          J-HUB
        </h2>

        <h3>Password Reset</h3>

        <p>
          Your password reset OTP is:
        </p>

        <h1 style="
          text-align: center;
          letter-spacing: 8px;
          color: #e50914;
        ">
          ${otp}
        </h1>

        <p>
          This OTP is valid for 1 minute.
        </p>

        <p>
          If you did not request a password reset, please ignore this email.
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



