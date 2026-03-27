import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        features: 'Features',
        intelligence: 'Intelligence',
        education: 'Education',
        faq: 'FAQ',
        login: 'Login',
      },
      hero: {
        tagline: 'Live Intelligence',
        title: 'Asthma Shield keeps Kigali breathing easier.',
        subtitle: 'We monitor AQI, humidity, pollen, and patient symptoms to deliver proactive interventions across clinics, homes, and schools.',
        ctaStart: 'Start Protection',
        ctaLearn: 'Learn More',
        sensorTitle: 'Sensor Cluster',
        sensorName: 'Remera Hub',
        sensorSummary: 'AQI {{aqi}} ({{quality}}) · Humidity {{humidity}}%',
        sensorNote: 'Realtime data from the Kigali hub.',
      },
features: {
        title: 'Comprehensive Asthma Care',
        cards: [
          {
            title: 'AI Prediction',
            description: 'Predict attacks before symptoms worsen.',
            icon: 'FaBrain'
          },
          {
            title: 'Doctor Monitoring',
            description: 'Doctors receive live patient alerts.',
            icon: 'FaStethoscope'
          },
          {
            title: 'Community Alerts',
            description: 'District warnings for dust and smoke.',
            icon: 'FaBell'
          },
          {
            title: 'Hospital Support',
            description: 'Emergency care coordination.',
            icon: 'FaHospital'
          },
        ],
      },
      aqi: {
        title: 'Current Air Quality',
        statuses: {
          good: 'Good',
          moderate: 'Moderate',
          unhealthy: 'Unhealthy',
        },
      },
      intelligence: {
        title: 'Real-Time Environmental Intelligence',
        risk: 'AI Risk Forecast',
        model: 'Model confidence',
        recommendation: 'Prediction recommendation',
      },
      trend: {
        title: 'Weekly AQI Trend',
      },
      map: {
        title: 'District Risk Map - Rwanda',
        caption: 'Click districts for live alerts',
      },
benefits: {
        title: 'Who Benefits?',
        cards: [
          { title: 'Patients', description: 'Get personalized alerts, track symptoms, and receive AI-driven advice.', icon: 'FaUserCircle' },
          { title: 'Doctors', description: 'Monitor patients remotely, receive alerts, and provide timely interventions.', icon: 'FaUserMd' },
          { title: 'Administrators', description: 'View district analytics, manage alerts, and coordinate emergency response.', icon: 'FaUsers' },
        ],
      },
education: {
        title: 'Asthma Education',
        highlights: [
          { title: 'Triggers', description: 'Identify and avoid common asthma triggers like dust, pollen, and smoke.' },
          { title: 'Inhaler Tips', description: 'Proper inhaler technique and maintenance for maximum effectiveness.' },
          { title: 'Emergency Signs', description: 'Recognize severe symptoms that require immediate medical attention.' },
          { title: 'Child Protection', description: 'Special strategies for protecting children from environmental risks.' }
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'How does AI predict asthma risk?',
            answer: 'AI combines symptom reports, weather, humidity, pollution, and historical attacks to predict possible asthma flare-ups.',
          },
          {
            question: 'Can doctors monitor remotely?',
            answer: 'Yes. Doctors receive patient alerts instantly and can send medical advice directly.',
          },
          {
            question: 'Can rural users access the platform?',
            answer: 'Yes. Offline mobile support and SMS integration are included.',
          },
        ],
      },
      emergency: {
        title: 'Emergency Support',
        description: 'If you are experiencing severe symptoms, contact emergency services right away.',
        button: 'Call Emergency',
      },
      newsletter: {
        title: 'Stay Updated',
        description: 'Get the latest asthma alerts and health tips.',
        placeholder: 'Your email',
        button: 'Subscribe',
      },
      footer: {
        aboutTitle: 'Asthma Shield',
        aboutText: 'Empowering Rwanda to breathe easier through AI-driven asthma care.',
        quickLinks: 'Quick Links',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        policy: 'Cookie Policy',
        phone: '+250 788 123 456',
        email: 'support@asthmashield.rw',
        rights: '© 2025 Asthma Shield Rwanda. All rights reserved.',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        features: 'Fonctionnalités',
        intelligence: 'Intelligence',
        education: 'Éducation',
        faq: 'FAQ',
        login: 'Connexion',
      },
      hero: {
        title: 'Asthma Shield aide Kigali à respirer plus facilement.',
        subtitle: 'Nous surveillons l’IQA, l’humidité, le pollen et les symptômes pour fournir des interventions proactives.',
        ctaStart: 'Commencer la protection',
        ctaLearn: 'En savoir plus',
      },
      features: {
        title: 'Soins complets pour l’asthme',
        cards: [
          { title: 'Prédiction IA', description: 'Prévoyez les crises avant qu’elles n’apparaissent.' },
          { title: 'Suivi médical', description: 'Les médecins reçoivent des alertes en temps réel.' },
          { title: 'Alertes communautaires', description: 'Alertes district pour la poussière et la fumée.' },
          { title: 'Soutien hospitalier', description: 'Coordination des soins d’urgence.' },
        ],
      },
      aqi: {
        title: 'Qualité de l’air actuelle',
        statuses: { good: 'Bon', moderate: 'Modéré', unhealthy: 'Mauvais' },
      },
      intelligence: {
        title: 'Intelligence environnementale',
        risk: 'Prédiction du risque',
        model: 'Confiance du modèle',
        recommendation: 'Recommandation',
      },
      benefits: {
        title: 'Qui en profite ?',
        cards: [
          { title: 'Patients', description: 'Recevez des alertes personnalisées, suivez vos symptômes.' },
          { title: 'Médecins', description: 'Suivez vos patients à distance, recevez les alertes.' },
          { title: 'Administrateurs', description: 'Analysez les districts, gérez les alertes.' },
        ],
      },
      education: {
        title: 'Éducation sur l’asthme',
        highlights: ['Déclencheurs', 'Conseils inhalateur', 'Signes d’urgence', 'Protection enfant'],
        description: 'Apprenez les stratégies de prévention et les soins quotidiens.',
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            question: 'Comment l’IA prédit-elle le risque d’asthme ?',
            answer: 'L’IA combine les rapports de symptômes, la météo, l’humidité, la pollution et l’historique pour prédire les crises.',
          },
          {
            question: 'Les médecins peuvent-ils suivre à distance ?',
            answer: 'Oui. Ils reçoivent instantanément des alertes et peuvent envoyer des conseils directs.',
          },
          {
            question: 'Les utilisateurs ruraux peuvent-ils accéder à la plateforme ?',
            answer: 'Oui. Une prise en charge hors ligne et par SMS est incluse.',
          },
        ],
      },
      emergency: {
        title: 'Besoin d’aide ?',
        description: 'En cas de symptômes sévères, contactez les services d’urgence.',
        button: 'Appeler les urgences',
      },
      newsletter: {
        title: 'Restez informé',
        description: 'Recevez les dernières alertes sur l’asthme et des conseils santé.',
        placeholder: 'Votre email',
        button: 'S’abonner',
      },
      footer: {
        aboutTitle: 'Asthma Shield',
        aboutText: 'Nous aidons le Rwanda à mieux respirer avec l’IA.',
        quickLinks: 'Liens rapides',
        contact: 'Contact',
        privacy: 'Politique de confidentialité',
        terms: 'Conditions d’utilisation',
        policy: 'Politique de cookies',
        phone: '+250 788 123 456',
        email: 'support@asthmashield.rw',
        rights: '© 2025 Asthma Shield Rwanda. Tous droits réservés.',
      },
    },
  },
  rw: {
    translation: {
      nav: {
        home: 'Ahabanza',
        features: 'Ibikoresho',
        intelligence: 'Ubwenge',
        education: 'Uburezi',
        faq: 'Ibibazo',
        login: 'Injira',
      },
      hero: {
        title: 'Asthma Shield ifasha Kigali guhumeka neza.',
        subtitle: 'Tugenzura AQI, ubushyuhe, pollen n’ibimenyetso kugira ngo duhe ubufasha umunsi ku munsi.',
        ctaStart: 'Tangira Kurinda',
        ctaLearn: 'Menya Byinshi',
      },
      features: {
        title: 'Kwita ku ndwara ya asima',
        cards: [
          { title: 'Ibitekerezo bya AI', description: 'Menya ibishoboka bitaraba mbere.' },
          { title: 'Gukurikira abaganga', description: 'Abaganga babona amakuru ako kanya.' },
          { title: 'Amakuru ku turere', description: 'Alarmu z’umukungugu n’umwuka.' },
          { title: 'Ubuvuzi bwihutirwa', description: 'Guhuza ibitaro n’abaganga.' },
        ],
      },
      aqi: {
        title: 'Ubwiza bw’umwuka ubu',
        statuses: { good: 'Bwiza', moderate: 'Bugororotse', unhealthy: 'Butameze neza' },
      },
      intelligence: {
        title: 'Ubwenge bwo mu kirere',
        risk: 'Ubuhanuzi bw’ibyago',
        model: 'Icyizere cy’icyitegererezo',
        recommendation: 'Inama',
      },
      benefits: {
        title: 'Bazungukira iki?',
        cards: [
          { title: 'Abarwayi', description: 'Habwa amakuru yihariye, bishobore gukurikira ibimenyetso.' },
          { title: 'Abaganga', description: 'Bakurikirana abarwayi bari kure kandi babaha amakuru.' },
          { title: 'Abayobozi', description: 'Bafate ibyemezo ku makuru y’amajyepfo n’amakuru y’umujyi.' },
        ],
      },
      education: {
        title: 'Uburezi ku ndwara ya asima',
        highlights: ['Ibikurura', 'Inama z’imiti', 'Ibimenyetso byihutirwa', 'Kurinda abana'],
        description: 'Menya uburyo bwo kwirinda no kwita ku buzima bwa buri munsi.',
      },
      faq: {
        title: 'Ibibazo bikunze kubazwa',
        items: [
          { question: 'AI yerekana ite ibyago by’asima?', answer: 'Isesengura ibimenyetso, imihindagurikire y’ikirere, umwuka n’amateka y’ibirwara.' },
          { question: 'Abaganga barabasha gukurikirana kera?', answer: 'Yego, bahabwa ubutumwa ako kanya kandi bakohereza ubufasha.' },
          { question: 'Abatuye cyaro babona serivisi?', answer: 'Yego. Harimo uburyo bwo gukoresha idirishya n’ubutumwa bwa SMS.' },
        ],
      },
      emergency: {
        title: 'Ese hari icyo ukeneye?',
        description: 'Niba ufite ibimenyetso bikomeye, hamagara ubutabazi bwihuse.',
        button: 'Hamagara ubutabazi',
      },
      newsletter: {
        title: 'Komeza umenye',
        description: 'Tubwira amakuru mashya, inama n’inearlette zatangajwe.',
        placeholder: 'Imeli yawe',
        button: 'Iyandikishe',
      },
      footer: {
        aboutTitle: 'Asthma Shield',
        aboutText: 'Dufasha u Rwanda guhumeka neza dukoresheje ikoranabuhanga.',
        quickLinks: 'Amakuru yihuse',
        contact: 'Twandikire',
        privacy: 'Politiki y’ibanga',
        terms: 'Amabwiriza',
        policy: 'Politiki ya cookie',
        phone: '+250 788 123 456',
        email: 'support@asthmashield.rw',
        rights: '© 2025 Asthma Shield Rwanda. Uburenganzira bwose burabitswe.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
