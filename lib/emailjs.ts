// lib/emailjs.ts
import emailjs from "@emailjs/browser";

export const sendEmailJS = async (data: {
  to: string;
  subject: string;
  message: string;
  companyName?: string;
  companyWebsite?: string;
}) => {
  return emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    {
      to_email: data.to,
      subject: data.subject,
      message: data.message,
      company_name: data.companyName,
      company_website: data.companyWebsite,
    },
    "YOUR_PUBLIC_KEY",
  );
};
