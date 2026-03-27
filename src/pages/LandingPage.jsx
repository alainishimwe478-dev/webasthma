import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBell,
  FaChartLine,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaCloudSun,
  FaHeartbeat,
  FaRobot,
  FaShieldAlt,
  FaStar,
  FaUserMd,
  FaWind,
} from "react-icons/fa";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import { useAuth } from "../context/AuthContext";

const featureCards = [
  {
    icon: FaCloudSun,
    title: "Rwanda Weather Intelligence",
    description:
      "See humidity, temperature, air quality, UV, and trigger conditions in one calm patient dashboard.",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    icon: FaBell,
    title: "Early Warning Alerts",
    description:
      "Know when the day is becoming risky before symptoms become severe or medication is forgotten.",
    accent: "from-amber-500 to-orange-400",
  },
  {
    icon: FaRobot,
    title: "Ask the Asthma AI",
    description:
      "Patients can ask clear questions about asthma disease, triggers, inhaler use, and prevention anytime.",
    accent: "from-teal-500 to-emerald-400",
  },
  {
    icon: FaChartLine,
    title: "Daily Progress Tracking",
    description:
      "Log symptoms, medication adherence, and breathing patterns to understand what is improving or worsening.",
    accent: "from-indigo-500 to-blue-500",
  },
  {
    icon: FaUserMd,
    title: "Doctor-Friendly Overview",
    description:
      "Doctors and caregivers can follow patient trends with a cleaner overview and faster response to risk.",
    accent: "from-fuchsia-500 to-pink-400",
  },
  {
    icon: FaShieldAlt,
    title: "Designed for Better Decisions",
    description:
      "The experience turns complex asthma data into practical actions people can actually follow.",
    accent: "from-slate-700 to-slate-500",
  },
];

const highlights = [
  { value: "10K+", label: "Patients reached across Rwanda" },
  { value: "67%", label: "Fewer emergency visits reported" },
  { value: "54%", label: "Lower hospitalization pressure" },
  { value: "24/7", label: "Access to asthma guidance" },
];

const journeySteps = [
  {
    title: "Start with your profile",
    description:
      "Create an account, choose your role, and add your trigger history so the platform feels personal from day one.",
  },
  {
    title: "Monitor the day",
    description:
      "Track weather, AQI, humidity, medication reminders, and symptoms in one dashboard without hunting across screens.",
  },
  {
    title: "Act early",
    description:
      "Use the alerts and assistant to reduce exposure, prepare medication, and escalate quickly when symptoms become dangerous.",
  },
];

const trustPoints = [
  "Simple UI for patients and families",
  "Useful for doctors and admins too",
  "AI assistant for asthma education",
  "Environmental risk context built in",
];

const testimonials = [
  {
    name: "Jean Mugisha",
    role: "Patient",
    location: "Kigali, Rwanda",
    content:
      "The dashboard helps me decide when I should stay indoors. It feels much easier than trying to interpret weather apps alone.",
  },
  {
    name: "Dr. Alice Niyonzima",
    role: "Pulmonologist",
    location: "Kigali, Rwanda",
    content:
      "The patient experience is much clearer now. People understand their triggers faster and come to visits with better context.",
  },
  {
    name: "Marie Uwase",
    role: "Caregiver",
    location: "Musanze, Rwanda",
    content:
      "The alerts and asthma explanations help my family react earlier instead of waiting until symptoms get worse.",
  },
];

const faqItems = [
  {
    question: "Who is Asthma Shield for?",
    answer:
      "Asthma Shield is designed for asthma patients, caregivers, doctors, and health teams who need clearer daily guidance and monitoring.",
  },
  {
    question: "What kind of information can the AI assistant answer?",
    answer:
      "It can explain asthma disease, symptoms, triggers, inhaler technique, medication basics, prevention tips, and when urgent care may be needed.",
  },
  {
    question: "Does the dashboard include environmental risk information?",
    answer:
      "Yes. It brings together temperature, humidity, air quality, and related alert signals so patients can make safer day-to-day choices.",
  },
  {
    question: "Is Asthma Shield a replacement for a doctor?",
    answer:
      "No. It is a support and education platform. Serious or worsening symptoms should always be assessed by a qualified medical professional.",
  },
];

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] text-slate-900">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-[#0b1d2a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 text-white shadow-lg">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.22em] text-teal-300">
                Asthma Shield
              </div>
              <div className="text-sm text-slate-200">
                Smart asthma care for Rwanda
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-slate-200 transition hover:text-white">
              Features
            </button>
            <button onClick={() => scrollToSection("journey")} className="text-sm font-medium text-slate-200 transition hover:text-white">
              How It Works
            </button>
            <button onClick={() => scrollToSection("stories")} className="text-sm font-medium text-slate-200 transition hover:text-white">
              Stories
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-slate-200 transition hover:text-white">
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="rounded-full bg-[#f5c95f] px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#ffd97e]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <section
        id="home"
        className="relative overflow-hidden bg-[#0b1d2a] pb-24 pt-32"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(64,194,184,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(245,201,95,0.18),_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-white/10 px-4 py-2 text-sm text-teal-100"
            >
              <FaHeartbeat className="text-[#f5c95f]" />
              Better asthma decisions start with better daily context
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-6 text-5xl font-black leading-tight text-white md:text-7xl"
            >
              Calm, clear asthma care built for real daily life.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl"
            >
              Asthma Shield combines weather intelligence, patient tracking,
              smart alerts, and an AI asthma assistant into one experience that
              feels simple enough for patients and useful enough for care teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button
                onClick={() => setShowSignup(true)}
                className="rounded-full bg-[#f5c95f] px-7 py-4 text-base font-bold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-[#ffd97e]"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Explore Features
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 grid gap-4 sm:grid-cols-2"
            >
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-slate-100"
                >
                  <FaCheckCircle className="text-teal-300" />
                  <span className="text-sm font-medium">{point}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 top-8 h-24 w-24 rounded-full bg-[#f5c95f]/30 blur-2xl" />
            <div className="absolute -right-4 bottom-6 h-32 w-32 rounded-full bg-teal-400/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.6rem] bg-[#f6fbff] p-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Patient Dashboard
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      Huye Weather Overview
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                    Low Risk
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-900 p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-300">
                      Air Quality
                    </p>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-4xl font-black">Poor</span>
                      <FaWind className="text-xl text-[#f5c95f]" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      Humidity
                    </p>
                    <p className="mt-3 text-4xl font-black text-slate-900">75%</p>
                    <p className="mt-2 text-sm text-slate-500">Higher than ideal</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      RealFeel Shade
                    </p>
                    <p className="mt-3 text-4xl font-black text-slate-900">19 C</p>
                    <p className="mt-2 text-sm text-slate-500">Comfortable outdoors</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      AI Assistant
                    </p>
                    <p className="mt-3 text-lg font-bold text-slate-900">
                      Ask about inhalers, triggers, symptoms, and prevention.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-[#e9f8f5] p-4">
                  <p className="text-sm font-semibold text-[#0d6357]">
                    Suggestion for today
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Air quality is poor and humidity is elevated. Keep your
                    rescue inhaler nearby, reduce outdoor exposure, and monitor
                    symptoms closely.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 px-5 py-5 text-center">
              <div className="text-3xl font-black text-slate-900">{item.value}</div>
              <div className="mt-2 text-sm text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-[#f4f7f4] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">
              Platform Highlights
            </p>
            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              A cleaner interface for better asthma decisions.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The experience is designed to reduce confusion, surface the right
              information faster, and help patients act before a difficult day
              turns into a crisis.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                className="group rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${card.accent} p-4 text-white shadow-lg`}>
                  <card.icon className="text-2xl" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-4 leading-7 text-slate-600">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-sky-600">
              How It Works
            </p>
            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              A calmer journey from monitoring to action.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The product flow is built to be understandable for patients,
              families, and clinicians, with less clutter and stronger guidance
              at each step.
            </p>
          </div>

          <div className="grid gap-5">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[1.8rem] border border-slate-200 bg-[#f8fbfd] p-6 shadow-sm"
              >
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className="bg-[#102230] py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f5c95f]">
              Real Experiences
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              People trust products that feel supportive, not overwhelming.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="rounded-[1.8rem] border border-white/10 bg-white/8 p-7 backdrop-blur-sm"
              >
                <div className="flex gap-1 text-[#f5c95f]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FaStar key={starIndex} />
                  ))}
                </div>
                <p className="mt-5 text-lg leading-8 text-slate-200">
                  "{testimonial.content}"
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 font-bold text-slate-900">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-300">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#f4f7f4] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-teal-600">
              FAQ
            </p>
            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              The important questions, answered clearly.
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={item.question}
                className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <span className="pr-4 text-lg font-semibold text-slate-900">
                    {item.question}
                  </span>
                  {openFaq === index ? (
                    <FaChevronUp className="flex-shrink-0 text-slate-500" />
                  ) : (
                    <FaChevronDown className="flex-shrink-0 text-slate-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 leading-7 text-slate-600">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f7f4] pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-r from-[#0b1d2a] via-[#12304a] to-[#0f6a67] px-8 py-14 text-white shadow-2xl sm:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f5c95f]">
                  Ready To Start
                </p>
                <h2 className="mt-4 text-4xl font-black md:text-5xl">
                  Give patients a dashboard that feels easier to trust and use.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
                  Start with a patient-friendly workflow, real environmental
                  context, educational AI support, and a cleaner monitoring
                  experience from day one.
                </p>
              </div>

              <div className="rounded-[1.8rem] bg-white/10 p-6 backdrop-blur-sm">
                <button
                  onClick={() => setShowSignup(true)}
                  className="w-full rounded-full bg-[#f5c95f] px-7 py-4 text-base font-bold text-slate-900 transition hover:bg-[#ffd97e]"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="mt-4 w-full rounded-full border border-white/20 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Login
                </button>
                <p className="mt-4 text-center text-sm text-slate-300">
                  No commitment • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-sky-500 text-white">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div className="text-xl font-bold">Asthma Shield</div>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
                Smarter asthma monitoring, clearer guidance, and a calmer UI for
                daily respiratory care.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Product
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <button onClick={() => scrollToSection("features")} className="block transition hover:text-white">
                  Features
                </button>
                <button onClick={() => scrollToSection("journey")} className="block transition hover:text-white">
                  How It Works
                </button>
                <button onClick={() => scrollToSection("faq")} className="block transition hover:text-white">
                  FAQ
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Audience
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div>Patients</div>
                <div>Doctors</div>
                <div>Care teams</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                Access
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <button onClick={() => setShowLogin(true)} className="block transition hover:text-white">
                  Login
                </button>
                <button onClick={() => setShowSignup(true)} className="block transition hover:text-white">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-sm text-slate-500">
            © 2026 Asthma Shield. All rights reserved.
          </div>
        </div>
      </footer>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default LandingPage;
