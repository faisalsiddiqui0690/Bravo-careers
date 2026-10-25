import { Link } from 'react-router-dom';
import Footer from './Footer';

const TermsOfService = () => {
  return (
    <>
      <section className="section" style={{ padding: '0', overflowX: 'hidden' }}>
        <div className="container" style={{ paddingTop: '30px' }}>
          <div className="section-header">
            <h1>Terms of Service</h1>
            <p>Last updated: May 2026</p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>1. Acceptance of Terms</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                By accessing or using IPShopy's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>2. Description of Services</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                IPShopy provides web development, mobile app development, e-commerce solutions, CRM implementation, and other IT services. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>3. User Responsibilities</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                As a user of our services, you agree to:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>Provide accurate and complete information</li>
                <li style={{ marginBottom: '12px' }}>Maintain the security of your account credentials</li>
                <li style={{ marginBottom: '12px' }}>Notify us immediately of any unauthorized use</li>
                <li style={{ marginBottom: '12px' }}>Comply with all applicable laws and regulations</li>
                <li style={{ marginBottom: '12px' }}>Not use our services for any illegal or unauthorized purpose</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>4. Intellectual Property</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                All content, trademarks, and intellectual property on our website and services are owned by IPShopy or its licensors. You may not reproduce, modify, distribute, or create derivative works without our explicit written consent.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>5. Payment Terms</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                For paid services, you agree to:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>Pay all fees in accordance with our pricing and payment terms</li>
                <li style={{ marginBottom: '12px' }}>Provide accurate payment information</li>
                <li style={{ marginBottom: '12px' }}>Maintain valid payment methods</li>
                <li style={{ marginBottom: '12px' }}>Acknowledge that fees are non-refundable unless otherwise stated</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>6. Limitation of Liability</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                To the fullest extent permitted by law, IPShopy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the services.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>7. Termination</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We reserve the right to terminate or suspend your access to our services at any time, with or without cause, with or without notice. Upon termination, your right to use the services will immediately cease.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>8. Governing Law</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Chhatrapati Sambhajinagar, Maharashtra.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>9. Changes to Terms</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or by posting a notice on our website. Your continued use of our services after such modifications constitutes your acceptance of the new terms.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>10. Contact Information</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                <strong>Email:</strong> services@gmail.com<br />
                <strong>Phone:</strong> +91 99222 84137<br />
                <strong>Address:</strong> T18, STPI, Naregaon - Malharpur - Warud Rd, opp. Garware Stadium, MIDC Industrial Area, Chilkalthana, Chhatrapati Sambhajinagar, Maharashtra 431008, India
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TermsOfService;
