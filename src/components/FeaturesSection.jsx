import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaBrain as FaBrainIcon,
  FaStethoscope as FaStethoscopeIcon,
  FaBell as FaBellIcon,
  FaHospital as FaHospitalIcon 
} from 'react-icons/fa';

const iconMap = {
  FaBrain: FaBrainIcon,
  FaStethoscope: FaStethoscopeIcon,
  FaBell: FaBellIcon,
  FaHospital: FaHospitalIcon,
};

const FeaturesSection = () => {
  const { t } = useTranslation();
  const features = t("features.cards", { returnObjects: true });

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <section id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((card, index) => (
            <div
              key={card.title} // Unique key
              className="bg-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
            >
              <div className="text-blue-600 text-4xl mb-3">
                {getIcon(card.icon)}
              </div>
              <h3 className="font-bold text-xl mb-2">{card.title}</h3>
              <p className="text-slate-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

