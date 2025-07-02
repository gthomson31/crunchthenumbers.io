export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using Crunch the Numbers ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">
            Crunch the Numbers provides free online financial calculators including:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Mortgage calculators</li>
            <li>Investment calculators</li>
            <li>Loan calculators</li>
            <li>Debt payoff calculators</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Our calculators are provided for informational and educational purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use License</h2>
          <p className="text-gray-700 mb-4">
            You are granted a limited, non-exclusive, non-transferable license to use our Service for personal, non-commercial purposes. You may not:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Modify or copy the Service materials</li>
            <li>Use the materials for commercial purposes</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove copyright or proprietary notations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
          <p className="text-gray-700 mb-4">
            <strong>IMPORTANT:</strong> The calculations and results provided by our Service are for informational purposes only and should not be considered as financial advice.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>We do not guarantee the accuracy of calculations</li>
            <li>Results may vary based on actual terms and conditions</li>
            <li>You should consult with financial professionals for personalized advice</li>
            <li>We are not responsible for financial decisions made based on our calculations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitations of Liability</h2>
          <p className="text-gray-700">
            In no event shall Crunch the Numbers or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service, even if we have been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Accuracy of Materials</h2>
          <p className="text-gray-700">
            While we strive for accuracy, the materials on our website may include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current. We may make changes to the materials at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Links to Third-Party Sites</h2>
          <p className="text-gray-700">
            Our Service may contain links to third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
          <p className="text-gray-700 mb-4">You may not use our Service:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which the Service is operated, without regard to conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please contact us through our website or open an issue on our GitHub repository.
          </p>
        </section>

        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Reminder</h3>
          <p className="text-blue-800">
            Our calculators provide estimates based on the information you provide. Always consult with qualified financial professionals before making important financial decisions. Interest rates, terms, and conditions may vary significantly from our calculations.
          </p>
        </div>
      </div>
    </div>
  );
}
