const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const getSmtpConfig = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, WELCOME_EMAIL_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !WELCOME_EMAIL_FROM) {
        return null;
    }
    // Default to port 465 (SSL) which is more reliable
    const port = Number(SMTP_PORT) || 465;
    return {
        host: SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        defaults: {
            from: WELCOME_EMAIL_FROM,
        },
    };
};

const getWelcomeEmailHTML = (username, siteUrl) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f4f6f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        
        <!-- HEADER -->
        <tr>
            <td style="background: #0a2342; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">⚽ Goticket</h1>
                <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Official FIFA World Cup 2026 Ticketing</p>
                <hr style="border: none; border-top: 3px solid #2a9d8f; margin: 16px 0 0 0;">
            </td>
        </tr>
        
        <!-- HERO SECTION -->
        <tr>
            <td style="background: #ffffff; padding: 24px;">
                <h2 style="margin: 0 0 16px 0; font-size: 24px;">Welcome aboard, ${username}! 🎉</h2>
                <p style="margin: 0 0 16px 0; line-height: 1.6; color: #333333;">
                    You've just joined thousands of football fans gearing up for the biggest sporting event on the planet — the FIFA World Cup 2026. We're thrilled to have you as part of the Goticket family. Your account is now active and you're ready to start browsing and booking tickets.
                </p>
            </td>
        </tr>
        
        <!-- ABOUT THE TOURNAMENT SECTION -->
        <tr>
            <td style="background: #ffffff; padding: 0 24px 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 18px;">🌍 About FIFA World Cup 2026</h3>
                <p style="margin: 0; line-height: 1.6; color: #333333;">
                    The 2026 FIFA World Cup is a historic edition of the tournament, co-hosted by three nations — the United States, Canada, and Mexico. For the first time ever, 48 teams will compete across 16 stadiums in 16 cities, playing 104 matches over 39 thrilling days from June 11 to July 19, 2026. From the iconic Estadio Azteca in Mexico City to the MetLife Stadium in New York/New Jersey where the Final will be held — this is history in the making.
                </p>
            </td>
        </tr>
        
        <!-- WHAT YOU CAN DO SECTION -->
        <tr>
            <td style="background: #ffffff; padding: 0 24px 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px;">🎟️ What You Can Do on Goticket</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #333333;">
                    <li>⚽ Browse all confirmed World Cup matches</li>
                    <li>🏟️ Choose your preferred stadium and venue</li>
                    <li>💺 Select ticket quantity and seat section</li>
                    <li>📱 Complete payment securely via WhatsApp</li>
                </ul>
            </td>
        </tr>
        
        <!-- OPENING MATCHES SECTION -->
        <tr>
            <td style="background: #ffffff; padding: 0 24px 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px;">🔥 Don't Miss These Opening Matches</h3>
                
                <!-- Match Card 1 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f6f9; border-radius: 8px; margin-bottom: 12px;">
                    <tr>
                        <td style="padding: 16px;">
                            <strong style="font-size: 16px; color: #0a2342;">Mexico vs South Africa</strong><br>
                            <span style="color: #333;">📅 June 11, 2026 — 3:00 PM ET</span><br>
                            <span style="color: #333;">🏟️ Estadio Azteca, Mexico City</span>
                        </td>
                    </tr>
                </table>
                
                <!-- Match Card 2 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f6f9; border-radius: 8px; margin-bottom: 12px;">
                    <tr>
                        <td style="padding: 16px;">
                            <strong style="font-size: 16px; color: #0a2342;">USA vs Paraguay</strong><br>
                            <span style="color: #333;">📅 June 12, 2026 — 9:00 PM ET</span><br>
                            <span style="color: #333;">🏟️ SoFi Stadium, Los Angeles</span>
                        </td>
                    </tr>
                </table>
                
                <!-- Match Card 3 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f6f9; border-radius: 8px; margin-bottom: 12px;">
                    <tr>
                        <td style="padding: 16px;">
                            <strong style="font-size: 16px; color: #0a2342;">Brazil vs Morocco</strong><br>
                            <span style="color: #333;">📅 June 13, 2026 — 9:00 PM ET</span><br>
                            <span style="color: #333;">🏟️ MetLife Stadium, New York</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- TRUST SECTION -->
        <tr>
            <td style="background: #ffffff; padding: 0 24px 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px;">🔒 Why Trust Goticket?</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 4px 0; color: #333333;">
                            <span style="color: #4caf50; font-weight: bold;">✅</span> FIFA Authorized Vendor — Tickets sourced from authorized channels only
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #333333;">
                            <span style="color: #4caf50; font-weight: bold;">🔐</span> Secure Payments — Your details are always protected
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #333333;">
                            <span style="color: #4caf50; font-weight: bold;">🎫</span> Verified Tickets — Every ticket is authenticated before delivery
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #333333;">
                            <span style="color: #4caf50; font-weight: bold;">📞</span> 24/7 Support — Available via WhatsApp and email anytime
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- CTA BUTTON -->
        <tr>
            <td style="background: #ffffff; padding: 0 24px 24px; text-align: center;">
                <a href="${siteUrl}" style="display: inline-block; background: #2a9d8f; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">🎟️ Browse Matches & Buy Tickets</a>
            </td>
        </tr>
        
        <!-- SUPPORT SECTION -->
        <tr>
            <td style="background: #f4f6f9; padding: 24px; text-align: center;">
                <p style="margin: 0 0 12px 0; color: #333333;">Need help with your tickets or payment?</p>
                <a href="https://wa.me/message/HYRP6AN7DH7YE1" style="display: inline-block; background: #0a2342; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 8px; font-size: 14px;">💬 Chat on WhatsApp</a>
                <a href="mailto:support@goticket.com" style="display: inline-block; background: #2a9d8f; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 0 8px; font-size: 14px;">📧 Email Support</a>
            </td>
        </tr>
        
        <!-- FOOTER -->
        <tr>
            <td style="background: #0a2342; padding: 24px; text-align: center;">
                <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">© 2026 Goticket. All rights reserved.</p>
                <p style="color: #ffffff; margin: 0; font-size: 12px; opacity: 0.8;">You received this email because you registered on Goticket.</p>
            </td>
        </tr>
        
    </table>
</body>
</html>`;
};

const sendWelcomeEmail = async ({ email, fullName, username }) => {
    const smtpConfig = getSmtpConfig();
    if (!smtpConfig) {
        return { sent: false, reason: 'SMTP configuration is missing' };
    }

    const siteUrl = process.env.SITE_URL || process.env.REACT_APP_SITE_URL || 'http://localhost:3000';
    const displayName = username || fullName || 'Goticket fan';

    const htmlTemplate = getWelcomeEmailHTML(displayName, siteUrl);

    const transporter = nodemailer.createTransport(smtpConfig);
    const info = await transporter.sendMail({
        to: email,
        subject: `🎉 Welcome to Goticket, ${username}! Your FIFA World Cup 2026 journey starts now!`,
        html: htmlTemplate,
    });
    return { sent: true, messageId: info.messageId };
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, username, fullName, gender } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const { data, error } = await req.supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
                fullName,
                gender,
            },
        });

        if (error) {
            return res.status(error.status || 400).json({ message: error.message || 'Failed to create user' });
        }

        const userId = data?.user?.id;
        if (!userId) {
            return res.status(500).json({ message: 'Failed to create user account' });
        }

        const { error: profileError } = await req.supabase
            .from('profiles')
            .upsert([
                {
                    id: userId,
                    username,
                    full_name: fullName,
                    gender,
                    is_admin: false,
                },
            ], { onConflict: ['id'] });

        if (profileError) {
            return res.status(500).json({ message: profileError.message || 'Failed to create profile' });
        }

        let welcomeResult = { sent: false, reason: 'SMTP not configured' };
        try {
            welcomeResult = await sendWelcomeEmail({ email, fullName, username });
        } catch (emailError) {
            console.warn('Welcome email failed:', emailError);
            welcomeResult = { sent: false, reason: emailError.message };
        }

        const message = welcomeResult.sent
            ? 'Registration successful. A welcome email has been sent.'
            : 'Registration successful. Account created but welcome email was not sent.';

        return res.status(201).json({ message, emailSent: welcomeResult.sent, emailInfo: welcomeResult });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Registration failed' });
    }
});

module.exports = router;