
export interface MovementBase {
  id: string;
  name: string;
  hashtag: string;
  year: string;
  region: string;
  type: string;
  scale: string;
  impactScore: number;
  digitalMaturity: number; // Human coded 1-10
  centralization: string; // Human coded: "Decentralized", "Hybrid", "Hierarchical"
  outcome: string; // Human coded: "Repressed", "Partial Success", "Ongoing", "Policy Shift"
  tags: string[];
}

export const MOVEMENTS_BASE: MovementBase[] = [
  {
    id: "M001",
    name: "Climate Strike Online",
    hashtag: "#FridaysForFuture",
    year: "2019-2022",
    region: "Global",
    type: "Environmental",
    scale: "Millions",
    impactScore: 94,
    digitalMaturity: 9,
    centralization: "Decentralized",
    outcome: "Policy Shift",
    tags: ["Sustainability", "Youth", "Digital-First"]
  },
  {
    id: "M002",
    name: "Milk Tea Alliance",
    hashtag: "#MilkTeaAlliance",
    year: "2020-2021",
    region: "Southeast Asia",
    type: "Pro-Democracy",
    scale: "Millions",
    impactScore: 91,
    digitalMaturity: 10,
    centralization: "Decentralized",
    outcome: "Ongoing",
    tags: ["Transnational", "Solidarity", "Anti-Authoritarian"]
  },
  {
    id: "M003",
    name: "Right to Repair",
    hashtag: "#RightToRepair",
    year: "2020-Present",
    region: "EU/US",
    type: "Consumer Rights",
    scale: "Thousands",
    impactScore: 88,
    digitalMaturity: 7,
    centralization: "Hybrid",
    outcome: "Partial Success",
    tags: ["Legislative", "Tech Ethics", "Circular Economy"]
  }
];
