import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useTranslation();
  const faqItems = t("faq.items", { returnObjects: true });

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <h2 className="text-4xl font-bold text-center text-gray-800">
          {t("faq.title")}
        </h2>
        {faqItems.map((item, index) => (
          <div key={index} className="mb-4 bg-slate-50 rounded-xl shadow">
            <button
              className="w-full flex justify-between items-center p-5 font-medium hover:bg-slate-100 transition"
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span>{item.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div id={`faq-${index}`} className="px-5 pb-5 text-slate-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;

