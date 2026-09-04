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
    "Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico ou farmacêutico antes de tomar qualquer decisão sobre seu medicamento.",
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
    "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor or pharmacist before making any decision about your medication.",
};

const DEMO_ES: MedicationExplanation = {
  isDemo: true,
  medicationName: "Amoxicilina 500mg",
  summary:
    "Es un antibiótico usado para tratar infecciones causadas por bacterias, como infecciones de garganta, oído o pulmón. No funciona contra la gripe ni el resfriado común, que son causados por virus.",
  howToTake: "Tome 1 cápsula cada 8 horas, con o sin alimentos, durante los días que el médico indicó — aunque se sienta mejor antes de terminar.",
  sideEffects: [
    { name: "Náuseas o molestias estomacales leves", severity: "common" },
    { name: "Diarrea leve", severity: "common" },
    { name: "Reacción alérgica (picazón, hinchazón, dificultad para respirar)", severity: "serious" },
  ],
  warnings: [
    "No lo tome si alguna vez tuvo una reacción alérgica a la penicilina o a la amoxicilina.",
    "Avise a su médico si está embarazada, amamantando o tomando otros medicamentos.",
  ],
  keyPointsToConfirm: [
    "Completar todos los días del tratamiento, aunque se sienta mejor antes",
    "Buscar ayuda de inmediato si nota dificultad para respirar o hinchazón facial",
  ],
  questionsForDoctor: [
    "¿Puedo tomar esto junto con los otros medicamentos que ya uso?",
    "¿Qué debo hacer si olvido una dosis?",
    "¿Hay alimentos o bebidas que deba evitar durante el tratamiento?",
  ],
  reassurance:
    "Es completamente normal sentirse confundido al leer una etiqueta de medicamento — ese lenguaje está escrito para farmacéuticos, no para usted. Este es uno de los antibióticos más usados y estudiados del mundo, así que la información anterior está bien establecida.",
  seekCareSoon: false,
  disclaimer:
    "Explicare no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna afección médica. Confirme siempre con un médico o farmacéutico antes de tomar cualquier decisión sobre su medicamento.",
};

const DEMO_FR: MedicationExplanation = {
  isDemo: true,
  medicationName: "Amoxicilline 500mg",
  summary:
    "C'est un antibiotique utilisé pour traiter les infections causées par des bactéries, comme les infections de la gorge, de l'oreille ou des poumons. Il n'agit pas contre la grippe ou le rhume, qui sont causés par des virus.",
  howToTake: "Prenez 1 gélule toutes les 8 heures, avec ou sans nourriture, pendant le nombre de jours indiqué par le médecin — même si vous vous sentez mieux avant la fin.",
  sideEffects: [
    { name: "Nausées ou légers troubles digestifs", severity: "common" },
    { name: "Diarrhée légère", severity: "common" },
    { name: "Réaction allergique (démangeaisons, gonflement, difficulté à respirer)", severity: "serious" },
  ],
  warnings: [
    "Ne le prenez pas si vous avez déjà eu une réaction allergique à la pénicilline ou à l'amoxicilline.",
    "Prévenez votre médecin si vous êtes enceinte, si vous allaitez ou si vous prenez d'autres médicaments.",
  ],
  keyPointsToConfirm: [
    "Terminer tous les jours du traitement, même en cas d'amélioration rapide",
    "Consulter immédiatement en cas de difficulté à respirer ou de gonflement du visage",
  ],
  questionsForDoctor: [
    "Puis-je prendre ceci avec les autres médicaments que j'utilise déjà ?",
    "Que dois-je faire si j'oublie une dose ?",
    "Y a-t-il des aliments ou boissons à éviter pendant le traitement ?",
  ],
  reassurance:
    "Il est tout à fait normal de se sentir perdu en lisant une notice de médicament — ce langage est écrit pour les pharmaciens, pas pour vous. C'est l'un des antibiotiques les plus utilisés et les plus étudiés au monde, donc les informations ci-dessus sont bien établies.",
  seekCareSoon: false,
  disclaimer:
    "Explicare n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune condition médicale. Confirmez toujours avec un médecin ou un pharmacien avant de prendre une décision concernant votre médicament.",
};

const DEMO_ZH: MedicationExplanation = {
  isDemo: true,
  medicationName: "阿莫西林 500毫克",
  summary:
    "这是一种用于治疗细菌感染的抗生素，例如咽喉、耳朵或肺部感染。它对流感或普通感冒无效，因为那些是由病毒引起的。",
  howToTake: "每8小时服用1粒胶囊，可与食物同服或不同服，按医生规定的天数服完——即使提前感觉好转也要坚持吃完。",
  sideEffects: [
    { name: "轻微恶心或胃部不适", severity: "common" },
    { name: "轻微腹泻", severity: "common" },
    { name: "过敏反应（瘙痒、肿胀、呼吸困难）", severity: "serious" },
  ],
  warnings: [
    "如果您曾对青霉素或阿莫西林过敏，请勿服用。",
    "如果您怀孕、哺乳或正在服用其他药物，请告知医生。",
  ],
  keyPointsToConfirm: [
    "务必完成整个疗程，即使提前感觉好转",
    "如出现呼吸困难或面部肿胀，请立即就医",
  ],
  questionsForDoctor: [
    "我可以把这个和我正在用的其他药一起吃吗？",
    "如果我忘记吃药了该怎么办？",
    "治疗期间有什么食物或饮料需要避免吗？",
  ],
  reassurance:
    "读药品标签时感到困惑是完全正常的——那些说明是写给药剂师看的，不是写给您看的。这是全球使用最广泛、研究最充分的抗生素之一，因此以上信息是可靠的。",
  seekCareSoon: false,
  disclaimer:
    "Explicare 不是医疗器械，不能诊断、治疗、治愈或预防任何疾病。在对用药做出任何决定之前，请务必咨询执业医生或药剂师。",
};

export function getDemoExplanation(language: ExplainLanguage): MedicationExplanation {
  switch (language) {
    case "en":
      return DEMO_EN;
    case "es":
      return DEMO_ES;
    case "fr":
      return DEMO_FR;
    case "zh":
      return DEMO_ZH;
    default:
      return DEMO_PT;
  }
}
