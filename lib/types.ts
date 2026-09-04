export type ExplainLanguage = "pt" | "en" | "es" | "fr" | "zh";

export type SideEffectSeverity = "common" | "serious";

export interface SideEffect {
  name: string;
  severity: SideEffectSeverity;
}

export interface MedicationExplanation {
  medicationName: string;
  summary: string;
  howToTake: string;
  sideEffects: SideEffect[];
  warnings: string[];
  keyPointsToConfirm: string[];
  questionsForDoctor: string[];
  reassurance: string;
  seekCareSoon: boolean;
  disclaimer: string;
  isDemo?: boolean;
}

export interface ExplainRequestBody {
  imageBase64: string;
  mimeType: string;
  language: ExplainLanguage;
}

export type LabParameterStatus = "normal" | "attention" | "out_of_range" | "undetermined";

export interface LabParameter {
  name: string;
  valueFound: string;
  referenceRange: string;
  status: LabParameterStatus;
  explanation: string;
}

export interface LabExplanation {
  examTitle: string;
  summary: string;
  parameters: LabParameter[];
  questionsForDoctor: string[];
  reassurance: string;
  seekCareSoon: boolean;
  disclaimer: string;
  isDemo?: boolean;
}
