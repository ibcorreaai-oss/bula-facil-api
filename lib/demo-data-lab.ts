import { ExplainLanguage, LabExplanation } from "./types";

const DEMO_PT: LabExplanation = {
  isDemo: true,
  examTitle: "Hemograma Completo",
  summary:
    "A maioria dos valores está dentro da normalidade. A hemoglobina está um pouco abaixo do esperado e os glóbulos brancos estão levemente elevados — vale conversar com seu médico sobre isso.",
  parameters: [
    {
      name: "Hemoglobina",
      valueFound: "10.8 g/dL",
      referenceRange: "12.0 a 15.5 g/dL",
      status: "out_of_range",
      explanation: "A hemoglobina é a proteína que transporta oxigênio no sangue. Um valor abaixo do esperado pode indicar anemia leve.",
    },
    {
      name: "Leucócitos",
      valueFound: "11.8 x10⁹/L",
      referenceRange: "4.5 a 11.0 x10⁹/L",
      status: "attention",
      explanation: "Os glóbulos brancos ajudam a combater infecções. Um valor levemente elevado pode indicar uma infecção leve recente ou inflamação.",
    },
    {
      name: "Plaquetas",
      valueFound: "250 x10⁹/L",
      referenceRange: "150 a 450 x10⁹/L",
      status: "normal",
      explanation: "As plaquetas ajudam seu sangue a coagular quando você se machuca. Esse valor está dentro do normal.",
    },
  ],
  questionsForDoctor: [
    "O que pode estar causando a hemoglobina baixa e preciso de mais exames?",
    "Os glóbulos brancos levemente altos são motivo de preocupação?",
    "Devo repetir esse exame em quanto tempo?",
  ],
  reassurance:
    "É completamente normal se sentir ansioso ao ver números fora da faixa. A maioria dos valores aqui está próxima do normal, e seu médico é a pessoa certa pra entender o quadro completo.",
  seekCareSoon: false,
  disclaimer:
    "Explicare não é um dispositivo médico e não diagnostica, trata, cura ou previne nenhuma condição médica. Sempre confirme com um médico antes de tomar qualquer decisão com base nesses resultados.",
};

const DEMO_EN: LabExplanation = {
  isDemo: true,
  examTitle: "Complete Blood Count",
  summary:
    "Most values are within the normal range. Hemoglobin is a bit below what's expected and white blood cells are mildly elevated — worth discussing with your doctor.",
  parameters: [
    {
      name: "Hemoglobin",
      valueFound: "10.8 g/dL",
      referenceRange: "12.0 to 15.5 g/dL",
      status: "out_of_range",
      explanation: "Hemoglobin is the protein that carries oxygen in your blood. A value below the expected range can indicate mild anemia.",
    },
    {
      name: "White Blood Cell Count",
      valueFound: "11.8 x10⁹/L",
      referenceRange: "4.5 to 11.0 x10⁹/L",
      status: "attention",
      explanation: "White blood cells help fight infection. A slightly elevated value can indicate a recent mild infection or inflammation.",
    },
    {
      name: "Platelet Count",
      valueFound: "250 x10⁹/L",
      referenceRange: "150 to 450 x10⁹/L",
      status: "normal",
      explanation: "Platelets help your blood clot when you get hurt. This value is within the normal range.",
    },
  ],
  questionsForDoctor: [
    "What could be causing the low hemoglobin, and do I need further testing?",
    "Is the mildly elevated white blood cell count something to worry about?",
    "How soon should I repeat this test?",
  ],
  reassurance:
    "It's completely normal to feel a little anxious seeing numbers outside the usual range. Most values here are close to normal, and your doctor is the right person to interpret the full picture.",
  seekCareSoon: false,
  disclaimer:
    "Explicare is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Always confirm with a licensed doctor before making any decision based on these results.",
};

const DEMO_ES: LabExplanation = {
  isDemo: true,
  examTitle: "Hemograma Completo",
  summary:
    "La mayoría de los valores están dentro de lo normal. La hemoglobina está un poco por debajo de lo esperado y los glóbulos blancos están levemente elevados — vale la pena hablarlo con su médico.",
  parameters: [
    {
      name: "Hemoglobina",
      valueFound: "10.8 g/dL",
      referenceRange: "12.0 a 15.5 g/dL",
      status: "out_of_range",
      explanation: "La hemoglobina es la proteína que transporta oxígeno en la sangre. Un valor por debajo de lo esperado puede indicar anemia leve.",
    },
    {
      name: "Glóbulos blancos",
      valueFound: "11.8 x10⁹/L",
      referenceRange: "4.5 a 11.0 x10⁹/L",
      status: "attention",
      explanation: "Los glóbulos blancos ayudan a combatir infecciones. Un valor levemente elevado puede indicar una infección leve reciente o inflamación.",
    },
    {
      name: "Plaquetas",
      valueFound: "250 x10⁹/L",
      referenceRange: "150 a 450 x10⁹/L",
      status: "normal",
      explanation: "Las plaquetas ayudan a que su sangre coagule cuando se lastima. Este valor está dentro de lo normal.",
    },
  ],
  questionsForDoctor: [
    "¿Qué podría estar causando la hemoglobina baja y necesito más pruebas?",
    "¿Los glóbulos blancos levemente altos son motivo de preocupación?",
    "¿Cuándo debo repetir este examen?",
  ],
  reassurance:
    "Es completamente normal sentirse ansioso al ver números fuera del rango habitual. La mayoría de los valores aquí están cerca de lo normal, y su médico es la persona indicada para interpretar el panorama completo.",
  seekCareSoon: false,
  disclaimer:
    "Explicare no es un dispositivo médico y no diagnostica, trata, cura ni previene ninguna afección médica. Confirme siempre con un médico antes de tomar cualquier decisión basada en estos resultados.",
};

const DEMO_FR: LabExplanation = {
  isDemo: true,
  examTitle: "Numération Formule Sanguine",
  summary:
    "La plupart des valeurs sont dans la norme. L'hémoglobine est un peu en dessous de ce qui est attendu et les globules blancs sont légèrement élevés — cela vaut la peine d'en parler à votre médecin.",
  parameters: [
    {
      name: "Hémoglobine",
      valueFound: "10.8 g/dL",
      referenceRange: "12.0 à 15.5 g/dL",
      status: "out_of_range",
      explanation: "L'hémoglobine est la protéine qui transporte l'oxygène dans le sang. Une valeur en dessous de la norme peut indiquer une anémie légère.",
    },
    {
      name: "Globules blancs",
      valueFound: "11.8 x10⁹/L",
      referenceRange: "4.5 à 11.0 x10⁹/L",
      status: "attention",
      explanation: "Les globules blancs aident à combattre les infections. Une valeur légèrement élevée peut indiquer une infection légère récente ou une inflammation.",
    },
    {
      name: "Plaquettes",
      valueFound: "250 x10⁹/L",
      referenceRange: "150 à 450 x10⁹/L",
      status: "normal",
      explanation: "Les plaquettes aident votre sang à coaguler en cas de blessure. Cette valeur est dans la norme.",
    },
  ],
  questionsForDoctor: [
    "Qu'est-ce qui pourrait causer cette hémoglobine basse, et ai-je besoin d'examens complémentaires ?",
    "Les globules blancs légèrement élevés sont-ils préoccupants ?",
    "Dans combien de temps dois-je refaire cet examen ?",
  ],
  reassurance:
    "Il est tout à fait normal de se sentir un peu anxieux en voyant des chiffres hors de la norme habituelle. La plupart des valeurs ici sont proches de la normale, et votre médecin est la bonne personne pour interpréter l'ensemble du tableau.",
  seekCareSoon: false,
  disclaimer:
    "Explicare n'est pas un dispositif médical et ne diagnostique, ne traite, ne guérit ni ne prévient aucune condition médicale. Confirmez toujours avec un médecin avant de prendre une décision basée sur ces résultats.",
};

const DEMO_ZH: LabExplanation = {
  isDemo: true,
  examTitle: "全血细胞计数",
  summary: "大多数数值都在正常范围内。血红蛋白略低于预期，白细胞略有升高——建议与医生讨论一下。",
  parameters: [
    {
      name: "血红蛋白",
      valueFound: "10.8 g/dL",
      referenceRange: "12.0 至 15.5 g/dL",
      status: "out_of_range",
      explanation: "血红蛋白是血液中负责运输氧气的蛋白质。低于预期范围可能提示轻度贫血。",
    },
    {
      name: "白细胞计数",
      valueFound: "11.8 x10⁹/L",
      referenceRange: "4.5 至 11.0 x10⁹/L",
      status: "attention",
      explanation: "白细胞帮助身体对抗感染。略微升高可能提示近期有轻微感染或炎症。",
    },
    {
      name: "血小板计数",
      valueFound: "250 x10⁹/L",
      referenceRange: "150 至 450 x10⁹/L",
      status: "normal",
      explanation: "血小板帮助伤口处的血液凝固。这个数值在正常范围内。",
    },
  ],
  questionsForDoctor: [
    "是什么原因导致血红蛋白偏低？我需要做进一步检查吗？",
    "白细胞略高需要担心吗？",
    "多久之后需要复查？",
  ],
  reassurance: "看到超出正常范围的数字感到有些焦虑是完全正常的。这里的大多数数值都接近正常，医生是解读整体情况的最佳人选。",
  seekCareSoon: false,
  disclaimer: "Explicare 不是医疗器械，不能诊断、治疗、治愈或预防任何疾病。在根据这些结果做出任何决定之前，请务必咨询执业医生。",
};

export function getDemoLabExplanation(language: ExplainLanguage): LabExplanation {
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
