import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { EMAIL_ADDRESS, LOCATION_ADDRESS, WHATSAPP_PHONE } from '../data/destinations';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-[#0B5ED7] mb-3">
          <ShieldCheck className="h-4 w-4" /> Customer Data Protection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="space-y-8 rounded-2xl border bg-card p-6 sm:p-10 shadow-card text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview</h2>
          <p>
            At Travroidd, we are committed to protecting your privacy and safeguarding your personal information.
            This Privacy Policy explains what data we collect when you visit our website, submit a travel enquiry,
            create an account, or book a tour package, and how we keep your information confidential.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <Lock className="h-5 w-5 text-[#0B5ED7] mb-2" />
            <h3 className="font-semibold text-slate-900 text-xs">Zero Card Storage</h3>
            <p className="text-xs text-slate-500 mt-1">
              We do not collect or store credit card or payment card details online.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <EyeOff className="h-5 w-5 text-[#0B5ED7] mb-2" />
            <h3 className="font-semibold text-slate-900 text-xs">Isolated Customer Data</h3>
            <p className="text-xs text-slate-500 mt-1">
              Customer bookings and contact details are strictly isolated by server-verified accounts.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <Server className="h-5 w-5 text-[#0B5ED7] mb-2" />
            <h3 className="font-semibold text-slate-900 text-xs">Encrypted Sessions</h3>
            <p className="text-xs text-slate-500 mt-1">
              All authentication tokens use cryptographically signed, secure HttpOnly sessions.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
            <li><strong>Account Information:</strong> Your name, email address, and hashed authentication credentials.</li>
            <li><strong>Booking & Enquiry Details:</strong> Selected travel destination, requested dates, number of travellers, contact telephone number, and optional travel preferences.</li>
            <li><strong>Technical Metadata:</strong> Security audit logs including timestamps, authenticated action identifiers, and IP addresses used strictly for security monitoring and brute-force prevention.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">3. How We Use Your Information</h2>
          <p>
            Your information is used solely to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 mt-2">
            <li>Coordinate and confirm your customized travel itinerary and reservations.</li>
            <li>Contact you via phone or WhatsApp regarding your submitted travel enquiries.</li>
            <li>Authenticate your account and maintain the security of your private booking history.</li>
            <li>Detect and prevent unauthorized access or abusive security requests.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">4. Data Sharing & Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties or marketing brokers.
            Information is shared only with verified local travel service partners (such as hotel accommodation or local transport operators) strictly as required to fulfill your booked tour.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">5. Data Retention & Your Rights</h2>
          <p>
            You have the right to review, update, or request the deletion of your personal data and booking history at any time.
            To exercise your privacy rights, please contact our privacy coordinator.
          </p>
        </div>

        <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100 text-xs text-slate-700">
          <p className="font-semibold text-[#0B5ED7]">Contact Us Regarding Privacy</p>
          <p className="mt-1">Email: <a href={`mailto:${EMAIL_ADDRESS}`} className="underline">{EMAIL_ADDRESS}</a></p>
          <p>Phone: {WHATSAPP_PHONE}</p>
          <p>Office: {LOCATION_ADDRESS}</p>
        </div>
      </div>
    </section>
  );
};
