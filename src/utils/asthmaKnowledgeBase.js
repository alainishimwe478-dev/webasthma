// src/utils/asthmaKnowledgeBase.js

// ASTHMA_CHAT_REFERENCE (existing - required by AsthmaChatBot.jsx)
export const ASTHMA_CHAT_REFERENCE = `
Asthma knowledge base for Asthma Shield:

1. Basic understanding
- Asthma is a chronic lung condition where the airways become inflamed and narrow, making breathing difficult.
- Common effects include wheezing, coughing, chest tightness, and shortness of breath.

2. Symptoms
- Shortness of breath
- Wheezing
- Chest tightness
- Persistent coughing, especially at night or early morning

3. Causes and triggers
- Dust, pollen, or pet dander
- Smoke or air pollution
- Cold air
- Exercise
- Respiratory infections

4. Treatment
- Quick-relief and long-term control inhalers
- Avoiding triggers
- Regular medical check-ups

5. Risk factors
- Family history of asthma
- Allergies
- Exposure to pollution or smoke
- Childhood respiratory infections

6. Daily life
- With proper treatment and trigger management, most people with asthma can live normal, active lives.

7. Latest research
- Newer treatments can include biologic therapies for severe asthma.

8. Emergency situations
- Use a quick-relief inhaler immediately
- Sit upright and stay calm
- Seek medical help if symptoms do not improve

9. Prevention and control
- Avoid known triggers
- Keep the environment clean
- Take prescribed medication regularly
- Monitor symptoms

10. Children
- Asthma is common in children and can often be managed well with treatment.

11. Cost of asthma medicine in Rwanda
- Basic inhalers: 13,000 to 18,000 RWF
- Combination inhalers: 20,000 to 30,000 RWF
- Monthly medicine cost without insurance: 15,000 to 50,000 RWF

11b. Example Rwanda medicine prices
- Basic inhalers can cost about 13,500 RWF
- Higher-dose inhalers can cost about 14,420 RWF
- Advanced inhalers like Symbicort can cost about 27,300 RWF
- These are commonly referenced prices in Kigali pharmacies such as AFIA Pharma and HarakaMeds

12. Hospital and treatment costs in Rwanda
- Doctor consultation: 2,000 to 10,000 RWF
- Emergency treatment: 20,000 to 50,000 RWF
- Nebulization or oxygen can increase total cost

13. Insurance
- Mutuelle de Sante can reduce costs significantly
- Patients may pay around 10% of covered costs
- Example: 15,000 RWF may become around 1,500 RWF out of pocket

14. Monthly cost summary in Rwanda
- Without insurance: 15,000 to 50,000 RWF
- With insurance: 1,500 to 10,000 RWF

15. Cost-saving tips
- Use Mutuelle de Sante
- Buy generic medicines when appropriate
- Visit public hospitals
- Follow treatment consistently to avoid emergencies

16. Rwanda chatbot conversation style guide
- Be concise, kind, and educational
- If the user asks "What is asthma?", answer that asthma is a long-term disease that affects the lungs and causes the airways to become narrow and inflamed, making breathing difficult.
- If the user asks about symptoms, mention shortness of breath, wheezing, chest tightness, and coughing, especially at night.
- If the user asks about triggers, mention dust, smoke, cold air, infections, exercise, and allergies such as pollen or pets.
- If the user asks about treatment, mention inhalers for quick relief and daily control, avoiding triggers, and regular doctor visits.
- If the user asks about medicine costs in Rwanda, mention: Basic inhalers around 13,500 RWF; Higher-dose inhalers around 14,420 RWF; Advanced inhalers like Symbicort around 27,300 RWF. These can be found in Kigali pharmacies such as AFIA Pharma and HarakaMeds.
- If the user asks about hospital costs in Rwanda, mention: Consultation around 2,000 to 10,000 RWF; Emergency care around 20,000 to 50,000 RWF.
- If the user asks about insurance, explain that Mutuelle de Sante can cover most costs and the patient may pay only about 10 percent.
- If the user asks about monthly costs: Without insurance 15,000 to 50,000 RWF; With insurance 1,500 to 10,000 RWF.
- If the user asks how to prevent asthma attacks, mention avoiding dust and smoke, keeping the home clean, taking medicine regularly, and following doctor advice.
- If the user asks what to do during an asthma attack, tell them to use the inhaler immediately, sit upright, stay calm, and go to the hospital if it gets worse.
- If the user asks whether asthma is common in children, answer yes and explain it can often be controlled with proper treatment.
- If the user asks for school content, offer versions for speech, report, or role play.
- If the user asks about emergencies, clearly advise using quick-relief inhaler first and seeking hospital help if no improvement.
- Do not diagnose the user - always recommend consulting a doctor.

17. Class speech version
- If the user asks for a speech or presentation text, provide a short classroom-ready speech about asthma basics, symptoms, triggers, treatment, Rwanda costs, and prevention.

18. Short report version
- If the user asks for a report or written assignment, provide structured content on asthma definition, symptoms, management, Rwanda-specific costs and hospitals.

19. Role play version
- If the user asks for a doctor-patient role play, provide a simple conversation example covering symptoms, diagnosis, treatment, costs, and prevention advice.
`.trim();

// Suggested questions for quick UI buttons (task version)
export const ASTHMA_SUGGESTED_QUESTIONS = [
  "What is asthma?",
  "How can I prevent an asthma attack?",
  "What medications are used for asthma?",
  "What should I do during an asthma attack?",
  "Can asthma be cured?",
  "How do I monitor my asthma at home?"
];

// Full knowledge base Q&A array for advanced chatbot (NEW - task provided)
export const asthmaKnowledgeBase = [
  {
    question: "What is asthma?",
    answer: "Asthma is a chronic respiratory disease affecting the airways, causing wheezing, shortness of breath, and coughing.",
  },
  {
    question: "What triggers an asthma attack?",
    answer: "Common triggers include dust, pollen, smoke, cold air, exercise, and respiratory infections.",
  },
  {
    question: "How can I prevent an asthma attack?",
    answer: "Avoid triggers, take prescribed medications regularly, and monitor your symptoms daily.",
  },
  {
    question: "What medications are used for asthma?",
    answer: "Asthma medications include quick-relief inhalers, long-term controller inhalers, and sometimes oral medications prescribed by your doctor.",
  },
  {
    question: "What should I do during an asthma attack?",
    answer: "Use your rescue inhaler immediately, sit upright, stay calm, and seek medical help if symptoms persist or worsen.",
  },
  {
    question: "Can asthma be cured?",
    answer: "Asthma cannot be cured, but it can be managed effectively with medication and lifestyle changes.",
  },
  {
    question: "How do I monitor my asthma at home?",
    answer: "Keep a symptom diary, measure peak flow regularly if advised, and track triggers and medication usage.",
  },
  {
    question: "Can children get asthma?",
    answer: "Yes, asthma can affect people of all ages, including children. Early diagnosis and management are important.",
  },
  {
    question: "Is exercise safe for people with asthma?",
    answer: "Yes, but it's important to warm up, use prescribed medication before exercise if needed, and avoid triggers like cold air.",
  },
  {
    question: "When should I see a doctor for asthma?",
    answer: "If you have frequent symptoms, nighttime coughing, or worsening attacks, consult your doctor for proper management.",
  }
];

