
export interface CodingRationale {
  movementId: string;
  dimension: "Impact" | "Maturity" | "Structure" | "Outcome";
  coderId: string;
  rationale: string;
  evidenceSource: string;
  confidenceScore: number;
}

export const CODING_RATIONALES: CodingRationale[] = [
  {
    movementId: "M001",
    dimension: "Impact",
    coderId: "H-04",
    rationale: "High impact score assigned due to direct correlation with EU Green Deal adjustments and documented narrative shifts in mainstream media.",
    evidenceSource: "Guardian Analysis 2021, EU Commission Report",
    confidenceScore: 0.95
  },
  {
    movementId: "M001",
    dimension: "Structure",
    coderId: "H-12",
    rationale: "Observed highly modular leadership patterns. Local chapters operate with 80% autonomy while adhering to a shared digital aesthetic.",
    evidenceSource: "Journal of Digital Activism Vol 4",
    confidenceScore: 0.88
  },
  {
    movementId: "M002",
    dimension: "Maturity",
    coderId: "H-04",
    rationale: "Max maturity score reflects the movement's pioneered use of meme-warfare and cross-platform algorithmic manipulation for visibility.",
    evidenceSource: "Stanford Internet Observatory Report",
    confidenceScore: 0.98
  },
  {
    movementId: "M003",
    dimension: "Outcome",
    coderId: "H-02",
    rationale: "Coded as 'Partial' because while laws passed in New York and California, federal lobby resistance remains high.",
    evidenceSource: "Legislative Tracker 2023",
    confidenceScore: 0.92
  }
];
