import React, { useState } from 'react';
import { Plus, Minus, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/destinations';
import { SEO } from '../components/SEO';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQPage: React.FC = () => {
  const [openIds, setOpenIds] = useState<number[]>([]); // Collapsed by default matching screenshot

  const toggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'What is the budget for your trips?',
      answer:
        'All our domestic trips across India are designed to be budget-friendly, ranging from ₹7,999 to ₹14,999 per person for 3 to 5 day packages. Almost all of our handpicked packages are comfortably under ₹20,000!',
    },
    {
      id: 2,
      question: 'Are the trips customizable?',
      answer:
        'Yes! We offer 100% customizable itineraries. Whether you wish to extend your stay, upgrade to premium hotels, add specific activities, or change travel dates, our team will tailor the plan to your preferences.',
    },
    {
      id: 3,
      question: 'How can I book a trip?',
      answer:
        'You can easily book by clicking "Plan Your Trip" or "Book Now" on any destination page. You can also directly call or message us on WhatsApp (+91 7339111948) with your dates and group size. We will confirm your availability and share booking details.',
    },
    {
      id: 4,
      question: 'Is travel insurance included?',
      answer:
        'Basic travel assistance and emergency coordination are included with all packages. Comprehensive medical and luggage travel insurance can be added as an optional add-on during booking.',
    },
    {
      id: 5,
      question: 'Do you provide complete travel support?',
      answer:
        'Absolutely! We provide 24/7 on-trip assistance via phone and WhatsApp. From your arrival to departure, our local destination managers and support team are always one call away.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="flex flex-col bg-[#F6F9FE] min-h-screen pb-20">
      <SEO
        title="Frequently Asked Questions (FAQ) — Trip Booking Guide | Travroidd"
        description="Get answers about booking India holiday tour packages with Travroidd, cancellation policies, inclusions, payment methods and customized trips."
        canonical="https://www.travroidd.in/faq"
        jsonLd={faqJsonLd}
      />
      {/* BANNER SECTION */}
      <section className="relative flex min-h-[170px] sm:min-h-[220px] items-center justify-center overflow-hidden bg-slate-900 py-16 text-center text-white">
        <img
          src="/assets/destinations/Munnar/Misty Mountain Tea Plantation Panorama.png"
          alt="Dark blue foliage and mountains"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2E63]/80 via-[#0B5ED7]/50 to-[#0A2557]/85" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-sky-100 drop-shadow">
            Find answers to the most common questions about our trips.
          </p>
        </div>
      </section>

      {/* FAQ ACCORDION CONTAINER */}
      <section className="mx-auto -mt-8 w-full max-w-4xl px-3 sm:px-6 z-20">
        <div className="rounded-3xl bg-white p-4 sm:p-10 shadow-xl border border-slate-100 space-y-3 sm:space-y-4">
          {faqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-100 bg-white transition shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="flex min-h-[48px] w-full items-center justify-between p-3.5 sm:p-5 text-left transition hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-xs sm:text-base font-bold text-slate-800 pr-2">
                    {faq.id}. {faq.question}
                  </span>
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0B5ED7] ml-2 sm:ml-4">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-3.5 py-3 sm:px-5 sm:py-4 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 p-5 sm:p-6 text-center border border-blue-100 shadow-sm">
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Still have questions? We're happy to help!
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Chat with our trip planners directly on WhatsApp for instant answers.
          </p>
          <a
            href={getWhatsAppUrl('Hi Travroidd! I have a question regarding trip booking.')}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-[#20ba5a] active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};
