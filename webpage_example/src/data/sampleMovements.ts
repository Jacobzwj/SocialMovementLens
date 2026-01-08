
export interface Movement {
  id: string;
  name: string;
  hashtag: string;
  year: string;
  region: string;
  scale: string;
  type: string;
  description: string;
  impactScore: number;
  tags: string[];
}

export const sampleData: Movement[] = [
  {
    id: '1',
    name: 'Climate Strike Online',
    hashtag: '#FridaysForFuture',
    year: '2019-2022',
    region: 'Global',
    scale: 'Millions',
    type: 'Environmental',
    description: 'Digital mobilization of youth to demand urgent action on climate change through coordinated online strikes.',
    impactScore: 94,
    tags: ['Sustainability', 'Youth', 'Policy Change']
  },
  {
    id: '2',
    name: 'Tech Worker Rebellion',
    hashtag: '#NoTechForApartheid',
    year: '2021-Present',
    region: 'North America',
    scale: 'Thousands',
    type: 'Labor Rights',
    description: 'Internal and external organizing by technology employees against military-industrial contracts.',
    impactScore: 78,
    tags: ['Ethics', 'Privacy', 'Labor']
  },
  {
    id: '3',
    name: 'Right to Repair',
    hashtag: '#RightToRepair',
    year: '2020-Present',
    region: 'EU/US',
    scale: 'Hundreds of Thousands',
    type: 'Consumer Rights',
    description: 'Campaigning for legislation that allows consumers to repair their own electronics and appliances.',
    impactScore: 88,
    tags: ['Circular Economy', 'Sustainability', 'Legal']
  },
  {
    id: '4',
    name: 'Milk Tea Alliance',
    hashtag: '#MilkTeaAlliance',
    year: '2020-2021',
    region: 'Southeast Asia',
    scale: 'Millions',
    type: 'Pro-Democracy',
    description: 'A cross-border solidarity movement connecting netizens across Thailand, Taiwan, Hong Kong, and Myanmar.',
    impactScore: 91,
    tags: ['Solidarity', 'Transnational', 'Democracy']
  }
];
