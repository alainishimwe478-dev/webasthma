import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUserCircle as FaUserCircleIcon,
  FaUserMd as FaUserMdIcon,
  FaUsers as FaUsersIcon,
  FaArrowRight,
} from "react-icons/fa";

const iconMap = {
  FaUserCircle: FaUserCircleIcon,
  FaUserMd: FaUserMdIcon,
  FaUsers: FaUsersIcon,
};

const BenefitsSection = () => {
  const { t } = useTranslation();
  const benefits = t("benefits.cards", { returnObjects: true });

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent size={48} /> : null;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {t("benefits.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((card) => (
            <div
              key={card.title} // Unique key
              className="bg-slate-50 rounded-2xl p-8 shadow-lg text-center space-y-4"
            >
              <div className="text-blue-600 text-5xl flex justify-center">
                {getIcon(card.icon)}
              </div>
              <h3 className="text-2xl font-bold">{card.title}</h3>
              <p className="text-slate-600">{card.description}</p>
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1 justify-center"
              >
                {t("hero.ctaLearn")} <FaArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
