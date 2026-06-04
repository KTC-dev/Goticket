import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <h2>About Goticket</h2>
      <p>
        Goticket is the official ticketing partner for the FIFA World Cup 2026.
        We provide a secure and reliable platform for purchasing tickets to all
        matches and events throughout the tournament.
      </p>

      <h3>Our Mission</h3>
      <p>
        To provide football fans worldwide with convenient access to FIFA World Cup
        tickets while ensuring the highest standards of security and customer service.
      </p>

      <h3>Contact Us</h3>
      <p>
        Email: <a href="mailto:support@goticket.com">support@goticket.com</a><br />
        Phone: <a href="tel:+18004688438">1-800-GOT-TICKET</a>
      </p>
      <p>
        Prefer live help? Visit our <a href="/support">Support page</a> to chat with an agent on WhatsApp.
      </p>
    </div>
  );
};

export default About;
