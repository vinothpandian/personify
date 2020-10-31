export enum DataNodeType {
  Persona,
  AccessibilityType,
  Guideline,
}

export interface DataNode {
  id: number;
  type: DataNodeType;
}

export interface Persona extends DataNode {
  type: DataNodeType.Persona;
  name: string;
  profession: string;
  imageSource: string;
  quote: string;
  disability: string;
  frustration: string;
  biography: string;
}

export interface AccessibilityType extends DataNode {
  type: DataNodeType.AccessibilityType;
  name: string;
  description: string;
  classification: string;
  url: string;
}

export interface Guideline extends DataNode {
  type: DataNodeType.Guideline;
  guidelineType: string;
  level: string;
  name: string;
  recommendation: string;
  tip: string;
  procedure: string;
  guidelineID: string;
  url: string;
  group: string;
}
