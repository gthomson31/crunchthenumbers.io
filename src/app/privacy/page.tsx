export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            Crunch the Numbers is designed with privacy in mind. We collect minimal information to provide our calculator services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Calculator input data (temporarily stored in your browser's local storage for convenience)</li>
            <li>Basic website analytics (page views, referrer information)</li>
            <li>Technical information (IP address, browser type, device information) for security and performance</li>
          </ul>
          <p className="text-gray-700">
            We do not require account creation or personal information to use our calculators.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use collected information to:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Provide and improve our calculator services</li>
            <li>Analyze website performance and user experience</li>
            <li>Ensure website security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your information to third parties, except:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>With your explicit consent</li>
            <li>To comply with legal requirements</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist in website operations (under strict confidentiality agreements)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
          <p className="text-gray-700 mb-4">
            Your calculator data is stored locally in your browser and is not transmitted to our servers unless you explicitly export or share results. We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies and Local Storage</h2>
          <p className="text-gray-700 mb-4">
            We use local storage to save your calculator preferences (such as currency selection) for a better user experience. We may use cookies for:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Essential website functionality</li>
            <li>Analytics and performance monitoring</li>
            <li>Remembering your preferences</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            Our website may use third-party services for analytics, hosting, and performance monitoring. These services have their own privacy policies and may collect information independently.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Clear your local storage data at any time through your browser settings</li>
            <li>Disable cookies through your browser preferences</li>
            <li>Request information about data we may have collected</li>
            <li>Request deletion of any personal information we may have</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700">
            Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will delete it immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy or our data practices, please contact us through our website or open an issue on our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
}
