import { Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  age: z.coerce
    .number()
    .min(12, "Age must be at least 12")
    .max(100, "Age must be at most 100"),
  gender: z.enum(["Male", "Female", "Other"]),
  purpose: z.string().min(1, "Purpose is required"),
  problems: z.string().optional(),
});

export const contactController = async (req: Request, res: Response) => {
  const data = req.body;
  console.log("Received contact form submission:", data);
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || "VoltFit Leads <onboarding@resend.dev>";
  const toEmail =
    process.env.CONTACT_TO_EMAIL || "varun.chauhan.workspace@gmail.com";

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return res.status(500).json({
      success: false,
      message: "Server email integration is not configured.",
    });
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `NEW LEAD: ${data.purpose} - ${data.name}`,
      html: `
          <h2>New Personal Training Lead</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Age:</strong> ${data.age}</p>
          <p><strong>Gender:</strong> ${data.gender}</p>
          <p><strong>Primary Goal:</strong> ${data.purpose}</p>
          <p><strong>Specific Problems/Injuries:</strong> <br/> ${data.problems || "None reported."}</p>
          <hr/>
          <p>Please reach out to them within 24 hours.</p>
        `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to submit contact form.",
      });
    }

    console.log("Email sent successfully:", emailData);

    return res.status(200).json({
      success: true,
      message:
        "Contact form submitted successfully. We will get back to you soon!",
    });
  } catch (error) {
    console.error("Unexpected error while sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit contact form.",
    });
  }
};
