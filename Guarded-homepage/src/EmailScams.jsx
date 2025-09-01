import React from "react";

export default function EmailScams({ onBack }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">Email Scams</h1>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-[#5c52ff] rounded-full text-[#5c52ff] hover:bg-[#e6e3ff] font-semibold"
        >
          Back
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 py-12 bg-gradient-to-r from-[#f5f3ff] to-white text-center">
        <h2 className="text-4xl font-bold text-[#5c52ff] mb-4">
          Protect Yourself from Email Scams
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Email scams, often called phishing, trick people into sharing sensitive information, clicking malicious links, or downloading harmful attachments. Learn how to spot and avoid these threats.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-12 max-w-5xl mx-auto space-y-16">
        {/* Section 1 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            1. Phishing Emails
          </h3>
          <p className="text-gray-700 mb-6">
            Fraudsters send emails pretending to be banks, companies, or government agencies to steal your login info or money.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Check sender addresses carefully for misspellings or strange domains.</li>
            <li>Do not click links or download attachments from unknown sources.</li>
            <li>Verify requests for sensitive info through official channels.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            An email pretending to be from your bank asks you to log in via a link to “verify your account.”
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            2. Fake Invoice Scams
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers send invoices for products or services you didn’t order to trick you into paying.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Double-check invoices with the actual company.</li>
            <li>Do not make payments to unknown vendors.</li>
            <li>Report suspicious invoices to your finance or IT department.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            You receive a PDF invoice for software you never purchased, asking for immediate payment.
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            3. Malware Attachments
          </h3>
          <p className="text-gray-700 mb-6">
            Emails may include attachments containing viruses, ransomware, or spyware.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Never open attachments from unknown or unexpected emails.</li>
            <li>Scan attachments with antivirus software before opening.</li>
            <li>Keep your software and operating system up to date.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            A seemingly legitimate email includes a “receipt” PDF that installs ransomware when opened.
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h3 className="text-2xl font-semibold text-[#5c52ff] mb-4">
            4. Impersonation Emails
          </h3>
          <p className="text-gray-700 mb-6">
            Scammers impersonate colleagues, friends, or executives to trick you into sending money or sensitive info.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
            <li>Verify unexpected requests directly with the person.</li>
            <li>Be cautious of urgency or secrecy in emails.</li>
            <li>Report impersonation attempts to IT or management.</li>
          </ul>
          <div className="bg-[#f5f3ff] p-6 rounded-xl shadow">
            <strong className="text-[#5c52ff]">Example:</strong>{" "}
            An email from “your CEO” asks you to wire money immediately for a confidential project.
          </div>
        </section>
      </div>

      {/* Call to action */}
      <div className="px-6 py-12 bg-white border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Stay Safe from Email Scams
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Awareness is the best defense. Learn to spot suspicious emails, avoid risky links, and educate friends and colleagues.
        </p>
        <button className="px-6 py-3 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
          Take a Quick Quiz
        </button>
      </div>
    </div>
  );
}
