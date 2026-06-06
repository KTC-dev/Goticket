import React from 'react';
import WhatsAppChatButton from '../components/WhatsAppChatButton';

const WHATSAPP_PAYMENT_LINK = 'https://wa.me/message/HYRP6AN7DH7YE1';
const SUPPORT_EMAIL = 'support@goticket.com';
const SECONDARY_SUPPORT_EMAIL = 'mailaptdeployteam@gmail.com';

const Support = () => {
    return (
        <div className="about-page support-page">
            <h2>Support & Customer Care</h2>
            <p>
                Need help with payments, tickets, or account questions? Our customer care team is available to assist you.
            </p>
            <div className="support-grid">
                <div className="support-card">
                    <h3>Live WhatsApp Chat</h3>
                    <p>Quickest way to reach us. Click below to start a WhatsApp chat with our support agents.</p>
                    <WhatsAppChatButton />
                    {/* Replaced raw URL with styled button for payment confirmation */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <a 
                            href={WHATSAPP_PAYMENT_LINK} 
                            target="_blank" 
                            rel="noreferrer noopener"
                            className="whatsapp-payment-btn"
                        >
                            Message for Payment Confirmation
                        </a>
                    </div>
                </div>
                <div className="support-card">
                    <h3>Email Support</h3>
                    <p>Send us a message and we’ll reply as soon as possible.</p>
                    <p>
                        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> 
                        {' or '}
                        <a href={`mailto:${SECONDARY_SUPPORT_EMAIL}`}>{SECONDARY_SUPPORT_EMAIL}</a>
                    </p>
                </div>
                <div className="support-card">
                    <h3>Phone Support</h3>
                    <p>Call us between 9am and 9pm local time.</p>
                    <p>
                        <a href="tel:+18004688438">+1 (800) GOT-TICKET</a>
                    </p>
                </div>
            </div>
            <p className="support-note">
                For payment or ticket issues, please include your order reference and the email address used to register.
            </p>
        </div>
    );
};

export default Support;