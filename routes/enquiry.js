const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/enquiry', async (req, res) => {
  const { firstName, lastName, email, phone, checkin, checkout, guests, message } = req.body;

  // Basic validation
  if (!firstName || !email || !checkin || !checkout) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    // Configure your email transport in .env
    const transporter = nodemailer.createTransport({
      //service: 'gmail',
      host: 'smtp.gmail.com', port: 465, secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use Gmail App Password
      },
    });

     await transporter.verify();
41    console.log('✅ SMTP connection verified');

    const nights = checkin && checkout
      ? Math.ceil((new Date(checkout) - new Date(checkin)) / 86400000)
      : '?';

    const mailOptions = {
      from: `"Villa NIVRRITII" <${process.env.EMAIL_USER}>`,
      to: 'congenplus1@gmail.com',
      replyTo: email,
      subject: `🌴 New Booking Enquiry — ${firstName} ${lastName} · ${checkin} to ${checkout}`,
      html: `
        <div style="font-family:'Georgia',serif; max-width:560px; margin:0 auto; background:#f2e8d5; border-radius:12px; overflow:hidden;">
          <!-- Header -->
          <div style="background:#0d2b1a; padding:28px 32px; text-align:center;">
            <div style="font-family:'Georgia',serif; font-size:28px; font-weight:700; color:white; letter-spacing:0.12em;">NIVRRITII</div>
            <div style="font-size:11px; color:#d4a843; letter-spacing:0.28em; margin-top:4px;">SOUTH GOA · LUXURY VILLA</div>
          </div>
          <!-- Alert bar -->
          <div style="background:#d4a843; padding:10px 32px; text-align:center;">
            <span style="font-size:13px; font-weight:600; color:#0d2b1a;">📬 New Booking Enquiry Received</span>
          </div>
          <!-- Body -->
          <div style="padding:32px;">
            <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#1a2415;">
              <tr style="background:#fff8f0;">
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; width:38%; color:#2d7a4a;">👤 Name</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; color:#2d7a4a;">📧 Email</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;"><a href="mailto:${email}" style="color:#2d7a4a;">${email}</a></td>
              </tr>
              <tr style="background:#fff8f0;">
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; color:#2d7a4a;">📞 Phone</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;">${phone || '<em style="color:#999;">Not provided</em>'}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; color:#2d7a4a;">📅 Check-in</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;">${checkin}</td>
              </tr>
              <tr style="background:#fff8f0;">
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; color:#2d7a4a;">📅 Check-out</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;">${checkout} <span style="color:#888; font-size:12px;">(${nights} nights)</span></td>
              </tr>
              <tr>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4; font-weight:600; color:#2d7a4a;">👥 Guests</td>
                <td style="padding:12px 16px; border-bottom:1px solid #e0d6c4;">${guests}</td>
              </tr>
              <tr style="background:#fff8f0;">
                <td style="padding:12px 16px; font-weight:600; color:#2d7a4a; vertical-align:top;">💬 Message</td>
                <td style="padding:12px 16px; font-style:italic; color:#444;">${message || '<span style="color:#999;">No special requests</span>'}</td>
              </tr>
            </table>

            <!-- Quick reply buttons -->
            <div style="margin-top:28px; text-align:center;">
              <a href="mailto:${email}?subject=Re: Your NIVRRITII Enquiry (${checkin} – ${checkout})&body=Hi ${firstName},%0A%0AThank you for your enquiry..." 
                 style="display:inline-block; background:#2d7a4a; color:white; padding:12px 28px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-size:13px; font-weight:600; margin-right:10px;">
                ✉️ Reply to Guest
              </a>
              <a href="https://wa.me/${(phone||'').replace(/\D/g,'')}?text=Hi+${encodeURIComponent(firstName)}!+Thank+you+for+your+enquiry+about+Villa+NIVRRITII." 
                 style="display:inline-block; background:#25D366; color:white; padding:12px 28px; border-radius:6px; text-decoration:none; font-family:sans-serif; font-size:13px; font-weight:600;">
                💬 WhatsApp Guest
              </a>
            </div>
          </div>
          <!-- Footer -->
          <div style="background:#0d2b1a; padding:16px 32px; text-align:center; font-family:sans-serif; font-size:11px; color:rgba(255,255,255,0.4);">
            Villa NIVRRITII · Canacona, South Goa · +91 74060 12727
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Enquiry sent! We will get back to you within 12 hours.' });

  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, error: 'Could not send enquiry. Please WhatsApp us directly at +91 74060 12727.' });
  }
});

module.exports = router;