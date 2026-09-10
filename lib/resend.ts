import { escapeHtml } from "@/lib/content-security";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "OSYSTIC <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@osystic.com";

let resend: Resend | null = null;

if (apiKey) {
  resend = new Resend(apiKey);
} else {
  console.warn("⚠️ RESEND_API_KEY missing — emails disabled");
}

export async function sendApplicationEmails(data: {
  applicantName: string;
  applicantEmail: string;
  position: string;
  fullName: string;
  phone: string;
  location: string;
  yearsExp: string;
  skills: string[];
  coverLetter: string;
  cvUrl: string;
  applicationId: string;
}) {
  const safe = {
    applicantName: escapeHtml(data.applicantName),
    position: escapeHtml(data.position),
    fullName: escapeHtml(data.fullName),
    phone: escapeHtml(data.phone),
    location: escapeHtml(data.location),
    yearsExp: escapeHtml(data.yearsExp),
    skills: data.skills.map(escapeHtml),
    coverLetter: escapeHtml(data.coverLetter).replace(/\n/g, "<br />"),
    cvUrl: escapeHtml(data.cvUrl),
    applicationId: escapeHtml(data.applicationId),
  };

  try {
    if (!resend) {
      console.error("❌ Resend not initialized");
      return;
    }

    console.log("📧 Sending emails...");

    /* ───────── Applicant Email ───────── */
    const applicantRes = await resend.emails.send({
      from: FROM,
      to: data.applicantEmail,
      subject: `Application received — ${safe.position}`,
      html: `
        <div style="font-family: Arial;">
          <h2>Thank you ${safe.applicantName} 🙌</h2>

          <p>Your application for <b>${safe.position}</b> has been received.</p>

          <p>We will contact you soon.</p>

          <br/>

          <p><b>Reference ID:</b> ${safe.applicationId}</p>
        </div>
      `,
    });

    if (applicantRes.error) {
      console.error("❌ Applicant email failed:", applicantRes.error);
    } else {
      console.log("✅ Applicant email sent");
    }

    /* ───────── Admin Email ───────── */
    const adminRes = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: data.applicantEmail,
      subject: `🚀 New Application: ${safe.fullName}`,
      html: `
        <div style="font-family: Arial;">
          <h2>New Job Application</h2>

          <p><b>Name:</b> ${safe.fullName}</p>
          <p><b>Email:</b> ${data.applicantEmail}</p>
          <p><b>Phone:</b> ${safe.phone}</p>
          <p><b>Location:</b> ${safe.location}</p>
          <p><b>Position:</b> ${safe.position}</p>
          <p><b>Experience:</b> ${safe.yearsExp} years</p>

          <p><b>Skills:</b> ${
            safe.skills?.length ? safe.skills.join(", ") : "N/A"
          }</p>

          <br/>

          <p><b>Cover Letter:</b></p>
          <p>${safe.coverLetter}</p>

          <br/>

          <a href="${safe.cvUrl}" target="_blank">
            📄 Download CV
          </a>

          <hr/>

          <p>Application ID: ${safe.applicationId}</p>
        </div>
      `,
    });

    if (adminRes.error) {
      console.error("❌ Admin email failed:", adminRes.error);
    } else {
      console.log("✅ Admin email sent");
    }

    console.log("🎉 Email process complete");
  } catch (err) {
    console.error("❌ Email sending crashed:", err);
  }
}
