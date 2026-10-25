import { Link } from 'react-router-dom';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <section className="section" style={{ padding: '0', overflowX: 'hidden' }}>
        <div className="container" style={{ paddingTop: '30px' }}>
          <div className="section-header">
            <h1>Privacy Policy</h1>
            <p>Last updated: May 2026</p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>1. Introduction</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                IPShopy is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>2. Information We Collect</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We may collect information about you in a variety of ways, including:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}><strong>Personal Information:</strong> Name, email address, phone number, and other contact details you provide.</li>
                <li style={{ marginBottom: '12px' }}><strong>Usage Data:</strong> Information about how you use our website and services.</li>
                <li style={{ marginBottom: '12px' }}><strong>Device Information:</strong> IP address, browser type, and device identifiers.</li>
                <li style={{ marginBottom: '12px' }}><strong>Cookies:</strong> Small data files stored on your device to enhance your experience.</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>3. How We Use Your Information</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We use the information we collect to:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>Provide, maintain, and improve our services</li>
                <li style={{ marginBottom: '12px' }}>Process transactions and send related information</li>
                <li style={{ marginBottom: '12px' }}>Send technical notices and support messages</li>
                <li style={{ marginBottom: '12px' }}>Respond to comments and questions</li>
                <li style={{ marginBottom: '12px' }}>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>4. Information Sharing</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>With service providers who perform services on our behalf</li>
                <li style={{ marginBottom: '12px' }}>To comply with legal obligations</li>
                <li style={{ marginBottom: '12px' }}>To protect our rights and prevent fraud</li>
                <li style={{ marginBottom: '12px' }}>With your consent for specific purposes</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>5. Data Security</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>6. Your Rights</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                You have the right to:
              </p>
              <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>Access and update your personal information</li>
                <li style={{ marginBottom: '12px' }}>Request deletion of your data</li>
                <li style={{ marginBottom: '12px' }}>Opt-out of marketing communications</li>
                <li style={{ marginBottom: '12px' }}>Object to processing of your data</li>
              </ul>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'var(--text)' }}>7. Contact Us</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '16px' }}>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
