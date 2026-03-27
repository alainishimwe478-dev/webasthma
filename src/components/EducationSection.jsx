import React from "react";
import { useTranslation } from "react-i18next";

const EducationSection = () => {
  const { t } = useTranslation();
  const highlights = t("education.highlights", { returnObjects: true });

  return (
    <section id="education" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <h2 className="text-4xl font-bold text-center">
          {t("education.title")}
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
