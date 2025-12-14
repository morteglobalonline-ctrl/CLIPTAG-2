import { PublicLayout } from '../components/layout/PublicLayout';

const PrivacyPage = () => {
  return (
    <PublicLayout>
      <div className="py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-[#A1A1AA] mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-[#A1A1AA]">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                <p>
                  ClipTag AI ("we," "our," or "us") respects your privacy and is committed to protecting 
                  your personal data. This Privacy Policy explains how we collect, use, store, and protect 
                  your information when you use our Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <p className="mb-3">We collect information in the following ways:</p>
                
                <h3 className="text-lg font-medium text-white mt-4 mb-2">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Payment information (processed securely by our payment provider)</li>
                  <li>Content you create using our tools</li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-4 mb-2">Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (features used, time spent on Service)</li>
                  <li>IP address and general location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-3">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain the Service</li>
                  <li>Process your payments and manage your subscription</li>
                  <li>Send important updates about the Service</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve and optimize the Service</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
                <p>
                  Your data is stored on secure servers with encryption in transit and at rest. 
                  We implement industry-standard security measures to protect your information. 
                  However, no method of transmission over the internet is 100% secure, and we 
                  cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Your Content</h2>
                <p>
                  Content you create using ClipTag AI remains yours. We do not use your content 
                  to train our AI models without your explicit consent. Your content is stored 
                  securely and is only accessible to you. Upon account deletion, your content 
                  will be permanently removed within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Data Sharing</h2>
                <p className="mb-3">We do not sell your personal data. We may share information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service providers who help operate our Service (hosting, payment processing)</li>
                  <li>Law enforcement when required by law</li>
                  <li>Other parties with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, remember your 
                  preferences, and analyze usage patterns. You can control cookie settings through 
                  your browser, but disabling cookies may affect Service functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Your Rights</h2>
                <p className="mb-3">Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing of your data</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, contact us at morteglobalonline@gmail.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Data Retention</h2>
                <p>
                  We retain your data for as long as your account is active or as needed to provide 
                  the Service. After account deletion, we may retain certain data for legal compliance 
                  or legitimate business purposes for up to 90 days.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Children's Privacy</h2>
                <p>
                  ClipTag AI is not intended for users under 16 years of age. We do not knowingly 
                  collect information from children. If you believe we have collected data from a 
                  child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">11. International Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place for such transfers in compliance 
                  with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of significant 
                  changes via email or through the Service. Your continued use after changes 
                  constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">13. Contact Us</h2>
                <p>
                  For questions about this Privacy Policy or our data practices, contact us at:{' '}
                  <a href="mailto:morteglobalonline@gmail.com" className="text-[#FF5F1F] hover:underline">
                    morteglobalonline@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPage;
