import React from 'react';
import { FileText } from 'lucide-react';
import { EMAIL_ADDRESS, WHATSAPP_PHONE } from '../data/destinations';
import { SEO } from '../components/SEO';

export const TermsOfServicePage: React.FC = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <SEO
        title="Terms of Service — Booking & Trip Conditions | Travroidd"
        description="Travroidd terms of service, tour booking conditions, payment schedules, and cancellation policies for all India travel packages."
        canonical="https://www.travroidd.in/terms"
      />
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-[#0B5ED7] mb-3">
          <FileText className="h-4 w-4" /> Travel Agreements & Terms
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="space-y-8 rounded-2xl border bg-card p-6 sm:p-10 shadow-card text-sm text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">1. Booking Requests & Confirmation</h2>
          <p>
            Submitting a booking request through Travroidd registers your intent to travel.
            A booking request is marked as <strong>pending</strong> until verified by our travel team via telephone or written confirmation.
            Prices listed are per person estimates based on double occupancy unless otherwise specified.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">2. Offline Payment Policy</h2>
          <p>
            Travroidd does not collect credit or debit card numbers on this website.
            Payment arrangements, advances, and bank transfers are coordinated directly through verified Travroidd company accounts following itinerary confirmation.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">3. User Accounts & Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their credentials and for all activities under their account.
            Attempting to gain unauthorized access to administrative functions, other customer records, or the underlying database is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">4. Cancellations & Modifications</h2>
          <p>
            Cancellation terms vary depending on the destination, peak travel season, hotel booking policies, and transport providers.
            Specific cancellation schedules will be provided upon itinerary finalization.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">5. Inquiries & Support</h2>
          <p>
            For any questions regarding your booking, terms, or package details, please reach out directly:
          </p>
          <div className="mt-2 text-xs text-slate-600 space-y-1">
            <p>Email: <a href={`mailto:${EMAIL_ADDRESS}`} className="text-primary hover:underline">{EMAIL_ADDRESS}</a></p>
            <p>Phone: <a href={`tel:${WHATSAPP_PHONE}`} className="text-primary hover:underline">{WHATSAPP_PHONE}</a></p>
          </div>
        </div>
      </div>
    </section>
  );
};
