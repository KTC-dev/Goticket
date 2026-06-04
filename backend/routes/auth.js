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

const sendWelcomeEmail = async ({ email, fullName }) => {
    const smtpConfig = getSmtpConfig();
    if (!smtpConfig) {
        return { sent: false, reason: 'SMTP configuration is missing' };
    }

    const transporter = nodemailer.createTransport(smtpConfig);
    const displayName = fullName || 'Goticket fan';
    const info = await transporter.sendMail({
        to: email,
        subject: 'Welcome to Goticket',
        text: `Hi ${displayName},\n\nThanks for joining Goticket! You now have access to FIFA World Cup match listings, ticket reservations, and premium hospitality offers.\n\nLog in anytime to explore events and reserve your seats.\n\nBest,\nThe Goticket Team`,
        html: `<p>Hi ${displayName},</p>
      <p>Thanks for joining <strong>Goticket</strong>! You now have access to FIFA World Cup match listings, ticket reservations, and premium hospitality offers.</p>
      <p><strong>Next steps:</strong></p>
      <ul>
        <li>Log in to browse upcoming events</li>
        <li>Reserve tickets for your favorite matches</li>
        <li>Use the support page if you need help</li>
      </ul>
      <p>Best,<br/>The Goticket Team</p>`,
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
            welcomeResult = await sendWelcomeEmail({ email, fullName });
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