import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("Please enter a valid email");
      return;
    }
    // Mock submit
    console.log("Newsletter subscribe:", email);
    setStatus("Subscribed! Thank you.");
    setEmail("");
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{t("newsletter.title")}</h3>
          <p className="text-gray-600 mb-4">{t("newsletter.description")}</p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!email}
            >
              {t("newsletter.button")}
            </button>
          </form>
          {status && (
            <p
              className={`mt-4 text-sm ${status.includes("Thank") ? "text-green-600" : "text-red-600"}`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
