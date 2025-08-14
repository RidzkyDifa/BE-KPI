import nodemailer from "nodemailer";

export class EmailSendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Failed to send reset email";
  }
}

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// sosse (8/13) todo: tambahkan detail waktu expirenya di emailnya
export async function sendForgotPasswordEmail(email: string, token: string) {
  if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL is not defined");
  }
  
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"KPI System Team A" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Lupa Sandi - KPI System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #0052cc; padding: 20px; text-align: center; color: white;">
          <img src="https://via.placeholder.com/100x100?text=LOGO" alt="KPI Logo" style="border-radius: 50%; background: white; padding: 5px;" />
          <h1 style="margin: 10px 0;">KPI System</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Halo,</p>
          <p>Kami menerima permintaan untuk mereset kata sandi akun KPI System Anda.</p>
          <p>Silakan klik tombol di bawah ini untuk melanjutkan:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0052cc; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Atur Ulang Sandi</a>
          </p>
          <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan email ini.</p>
          <p>Terima kasih,<br />Tim A</p>
        </div>
        <div style="background-color: #f4f4f4; text-align: center; padding: 10px; font-size: 12px; color: #666;">
          © 2025 KPI System - Semua Hak Dilindungi
        </div>
      </div>
    `
  };
  

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new EmailSendError("Failed to send reset email. Please try again later.");
  }
}


export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL is not defined");
  }

  // Link verifikasi user, token akan dicek di backend nanti
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  // Durasi expired token (misal 24 jam = 86400 detik)
  const tokenExpiryHours = 24;

  const mailOptions = {
    from: `"KPI System Team A" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi Email - KPI System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #0052cc; padding: 20px; text-align: center; color: white;">
          <img src="https://via.placeholder.com/100x100?text=LOGO" alt="KPI Logo" style="border-radius: 50%; background: white; padding: 5px;" />
          <h1 style="margin: 10px 0;">KPI System</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <p>Halo,</p>
          <p>Terima kasih telah mendaftar di KPI System.</p>
          <p>Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda. Link ini akan kedaluwarsa dalam <strong>${tokenExpiryHours} jam</strong>.</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #0052cc; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verifikasi Email</a>
          </p>
          <p>Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini.</p>
          <p>Terima kasih,<br />Tim A</p>
        </div>
        <div style="background-color: #f4f4f4; text-align: center; padding: 10px; font-size: 12px; color: #666;">
          © 2025 KPI System - Semua Hak Dilindungi
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new EmailSendError("Failed to send verification email. Please try again later.");
  }
}