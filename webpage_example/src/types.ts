export interface Movement {
  id: string;
  name: string;
  hashtag: string;
  year: string;
  region: string;
  iso: string;
  scale: string;
  type: string;
  regime: string;
  description: string;
  impactScore: number;
  digitalMaturity: number;
  centralization: string;
  tags: string[];
  outcome: string;
  similarity?: number;

  // New Fields
  twitter_query: string;
  tweets_count: string;
  key_participants: string;
  reoccurrence: string;
  length_days: string;
  wikipedia: string;
  twitter_penetration: string;
  star_rating: number;
  offline_presence: string;
  rationale_text?: string;
  rationales?: Record<string, string>;
  
  // Expanded Fields
  smo_leader: string;
  grassroots: string;
  kind: string;
  outcome_raw: string;
  state_accommodation: string;
  state_distraction: string;
  state_repression: string;
  state_ignore: string;
  injuries: string;
  police_injuries: string;
  deaths: string;
  police_deaths: string;
  arrests: string;
  reference: string;
}

export interface Rationale {
  movementId: string;
  dimension: string;
  rationale: string;
  confidenceScore: number;
  coderId: string;
  evidenceSource: string;
}
