const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const getSmtpConfig = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, WELCOME_EMAIL_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !WELCOME_EMAIL_FROM) {
        return null;
    }
    return {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
        defaults: {
            from: WELCOME_EMAIL_FROM,
        },
    };
};

const generateAIPrompt = (username) => {
    return `Write a short, warm and exciting welcome email for a new user named ${username} who just registered on Goticket, a FIFA World Cup 2026 ticketing platform. Make it enthusiastic, football-themed, and under 100 words. End with: The Goticket Team.`;
};

const getAIGeneratedContent = async (username) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        // Fallback to static content if no API key
        return `Hey ${username}! 🎉 Welcome to Goticket - your gateway to FIFA World Cup 2026! Get ready to cheer for your favorite teams and experience the beautiful game like never before. Browse matches, reserve your seats, and let the excitement begin! The Goticket Team.`;
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 150,
                messages: [{
                    role: 'user',
                    content: generateAIPrompt(username)
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.content?.[0]?.text || `Hey ${username}! 🎉 Welcome to Goticket! The Goticket Team.`;
        }
        return `Hey ${username}! 🎉 Welcome to Goticket - your gateway to FIFA World Cup 2026! The Goticket Team.`;
    } catch (err) {
        console.warn('AI content generation failed:', err.message);
        return `Hey ${username}! 🎉 Welcome to Goticket! The Goticket Team.`;
    }
};

const sendWelcomeEmail = async ({ email, fullName, username }) => {
    const smtpConfig = getSmtpConfig();
    if (!smtpConfig) {
        return { sent: false, reason: 'SMTP configuration is missing' };
    }

    const displayName = fullName || username || 'Goticket fan';
    const aiContent = await getAIGeneratedContent(username || displayName);

    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

    const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f6f9;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
                <tr>
                    <td style="background: #0a2342; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Goticket</h1>
                    </td>
                </tr>
                <tr>
                    <td style="background: white; padding: 30px;">
                        ${aiContent.split('\n').map(line => `<p style="margin: 0 0 16px 0; line-height: 1.5;">${line}</p>`).join('')}
                        <table align="center" style="margin: 20px 0;">
                            <tr>
                                <td align="center" style="background: #2a9d8f; border-radius: 6px;">
                                    <a href="${siteUrl}" style="display: inline-block; padding: 12px 24px; color: white; text-decoration: none; font-weight: bold;">Browse Matches</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="background: #2a9d8f; padding: 15px; text-align: center;">
                        <p style="color: white; margin: 0; font-size: 12px;">&copy; 2026 Goticket</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    const transporter = nodemailer.createTransport(smtpConfig);
    const info = await transporter.sendMail({
        to: email,
        subject: `🎉 Welcome to Goticket, ${username}! Your World Cup journey starts here.`,
        text: aiContent,
        html: htmlTemplate,
    });
    return { sent: true, messageId: info.messageId };
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, username, fullName } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const { data, error } = await req.supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
                full_name: fullName,
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