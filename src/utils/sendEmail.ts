import nodemailer from "nodemailer";
import { EmailOptions } from "../interfaces";
import { config } from "../configs";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.FROM_EMAIL_ADDRESS,
    pass: config.PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail server is ready to send mail.");
  }
});

const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    let info = await transporter.sendMail({
      from: `${config.FROM_EMAIL} <${config.FROM_EMAIL_ADDRESS}>`,
      to,
      subject,
      html,
    });

    console.log("email sent successfully...!!!");
    //   console.log(info);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
