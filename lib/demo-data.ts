import { ExplainLanguage, MedicationExplanation } from "./types";

const DEMO_PT: MedicationExplanation = {
  isDemo: true,
  medicationName: "Amoxicilina 500mg",
  summary:
    "É um antibiótico usado para tratar infecções causadas por bactérias, como infecções de garganta, ouvido ou pulmão. Ele não funciona contra gripes ou resfriados comuns, que são causados por vírus.",
  howToTake: "Tome 1 cápsula a cada 8 horas, com ou sem alimentos, pelo número de dias que o médico indicou — mesmo que você se sinta melhor antes do fim.",
  sideEffects: [
    { name: "Enjoo ou dor de estômago leve", severity: "common" },
    { name: "Diarreia leve", severity: "common" },
    { name: "Reação alérgica (coceira, inchaço, falta de ar)", severity: "serious" },
  ],
  warnings: [
    "Não tome se você já teve alergia a penicilina ou amoxicilina antes.",
    "Avise seu médico se estiver grávida, amamentando ou tomando outros remédios.",
  ],
  keyPointsToConfirm: [
    "Completar todos os dias do tratamento, mesmo melhorando antes",
    "Procurar ajuda imediatamente se sentir falta de ar ou inchaço no rosto",
  ],
  questionsForDoctor: [
    "Posso tomar esse remédio junto com os outros que já uso?",
    "O que eu faço se esquecer de tomar uma dose no horário certo?",
    "Existe algum alimento ou bebida que devo evitar durante o tratamento?",
  ],
  reassurance:
    "É normal ficar em dúvida na hora de ler uma bula — a linguagem é feita pra bula técnica, não pra explicar pra você. Esse remédio é um dos antibióticos mais usados e estudados no mundo, então as informações acima são bem conhecidas.",
  seekCareSoon: false,
  disclaimer:
    "Bula Fácil não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico ou farmacêutico antes de tomar qualquer decisão sobre seu medicamento.",
};

const DEMO_EN: MedicationExplanation = {
  isDemo: true,
  medicationName: "Amoxicillin 500mg",
  summary:
    "It's an antibiotic used to treat infections caused by bacteria, such as throat, ear, or lung infections. It does not work against the flu or a common cold, which are caused by viruses.",
  howToTake: "Take 1 capsule every 8 hours, with or without food, for as many days as your doctor prescribed — even if you start feeling better before it's done.",
  sideEffects: [
    { name: "Mild nausea or stomach discomfort", severity: "common" },
    { name: "Mild diarrhea", severity: "common" },
    { name: "Allergic reaction (itching, swelling, trouble breathing)", severity: "serious" },
  ],
  warnings: [
    "Don't take this if you've ever had an allergic reaction to penicillin or amoxicillin before.",
    "Tell your doctor if you're pregnant, breastfeeding, or taking other medications.",
  ],
  keyPointsToConfirm: [
    "Finish every day of treatment, even if you feel better sooner",
    "Get help right away if you notice trouble breathing or facial swelling",
  ],
  questionsForDoctor: [
    "Can I take this alongside the other medications I already use?",
    "What should I do if I miss a dose?",
    "Are there any foods or drinks I should avoid during treatment?",
  ],
  reassurance:
    "It's completely normal to feel confused reading a medication label — that language is written for pharmacists, not for you. This is one of the most widely used and well-studied antibiotics in the world, so the information above is well established.",
  seekCareSoon: false,
  disclaimer:
    "Bula Fácil is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor or pharmacist before making any decision about your medication.",
};

export function getDemoExplanation(language: ExplainLanguage): MedicationExplanation {
  return language === "en" ? DEMO_EN : DEMO_PT;
}
