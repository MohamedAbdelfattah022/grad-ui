import { FileText, Building2, Activity } from 'lucide-angular';

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export interface AnalysisResults {
  energyUsage: number;
  recommendations: string[];
  simulationData: { month: string; usage: number }[];
}

export interface Feature {
  title: string;
  description: string;
  icon: any;
  action: () => void;
  examples: string[];
}

export const mockFeatures: Feature[] = [
  {
    title: 'File Processing',
    description: 'Upload and analyze building documents',
    icon: FileText,
    action: () => {},
    examples: [
      'Upload IDF files for energy simulation',
      'Process building documentation',
      'Extract data from PDFs and drawings',
    ],
  },
  {
    title: '3D Visualization',
    description: 'Interactive building model viewer',
    icon: Building2,
    action: () => {},
    examples: [
      'View 3D building models',
      'Analyze building components',
      'Explore architectural details',
    ],
  },
  {
    title: 'Energy Analysis',
    description: 'Comprehensive energy performance insights',
    icon: Activity,
    action: () => {},
    examples: [
      'Generate energy audit reports',
      'Simulate building performance',
      'Get optimization recommendations',
    ],
  },
];

export const mockChats: {
  [key: string]: ChatMessage[];
} = {
  'Office Building Analysis': [
    {
      sender: 'AI',
      message: 'Analyzing office energy data...',
      timestamp: '10:00 AM',
    },
    {
      sender: 'User',
      message: 'What’s the HVAC efficiency?',
      timestamp: '10:01 AM',
    },
    {
      sender: 'AI',
      message: 'HVAC efficiency is at 85%. Suggest upgrading.',
      timestamp: '10:02 AM',
    },
  ],
  'Residential Complex Audit': [
    {
      sender: 'AI',
      message: 'Residential audit complete.',
      timestamp: '9:30 AM',
    },
    {
      sender: 'User',
      message: 'Any insulation recommendations?',
      timestamp: '9:31 AM',
    },
  ],
  'Shopping Mall Energy Sim': [
    {
      sender: 'AI',
      message: 'Simulation running for mall...',
      timestamp: '11:00 AM',
    },
  ],
  'Hospital HVAC Analysis': [
    { sender: 'AI', message: 'HVAC analysis started.', timestamp: '8:00 AM' },
  ],
  'School Building Review': [
    {
      sender: 'AI',
      message: 'School review in progress.',
      timestamp: '2:00 PM',
    },
  ],
  'Data Center Optimization': [
    {
      sender: 'AI',
      message: 'Optimizing data center cooling.',
      timestamp: '3:00 PM',
    },
  ],
  'Smart Office Energy Audit': [
    {
      sender: 'AI',
      message: 'Analyzing smart office energy consumption...',
      timestamp: '9:00 AM',
    },
    {
      sender: 'User',
      message: 'How much energy is saved with LED lighting?',
      timestamp: '9:02 AM',
    },
    {
      sender: 'AI',
      message:
        'Switching to LED saves 40% energy compared to traditional bulbs.',
      timestamp: '9:03 AM',
    },
  ],
  'Green Residential Complex Review': [
    {
      sender: 'AI',
      message: 'Assessing energy efficiency of the residential complex...',
      timestamp: '10:15 AM',
    },
    {
      sender: 'User',
      message: 'What’s the impact of solar panels here?',
      timestamp: '10:17 AM',
    },
    {
      sender: 'AI',
      message:
        'Solar panels could offset 30% of total electricity usage annually.',
      timestamp: '10:19 AM',
    },
  ],
  'Eco-Friendly Shopping Mall Analysis': [
    {
      sender: 'AI',
      message: 'Evaluating green energy solutions for the shopping mall...',
      timestamp: '11:30 AM',
    },
    {
      sender: 'User',
      message: 'Is there a way to optimize HVAC for efficiency?',
      timestamp: '11:32 AM',
    },
    {
      sender: 'AI',
      message:
        'Yes, integrating smart thermostats can reduce energy waste by 25%.',
      timestamp: '11:34 AM',
    },
  ],
  'Hospital Energy Optimization': [
    {
      sender: 'AI',
      message: 'Running energy audit for hospital HVAC system...',
      timestamp: '8:45 AM',
    },
    {
      sender: 'User',
      message:
        'How can we reduce energy consumption without compromising care?',
      timestamp: '8:47 AM',
    },
    {
      sender: 'AI',
      message:
        'Using occupancy sensors and scheduling HVAC usage can reduce energy costs by 20%.',
      timestamp: '8:50 AM',
    },
  ],
  'Sustainable School Energy Report': [
    {
      sender: 'AI',
      message: 'Analyzing school energy efficiency...',
      timestamp: '2:10 PM',
    },
    {
      sender: 'User',
      message: 'Are green roofs a good investment?',
      timestamp: '2:12 PM',
    },
    {
      sender: 'AI',
      message:
        'Yes, green roofs improve insulation, reduce cooling needs, and last twice as long as traditional roofs.',
      timestamp: '2:14 PM',
    },
  ],
  'Data Center Green Optimization': [
    {
      sender: 'AI',
      message: 'Evaluating energy efficiency strategies for data center...',
      timestamp: '3:20 PM',
    },
    {
      sender: 'User',
      message: 'Would liquid cooling be beneficial here?',
      timestamp: '3:22 PM',
    },
    {
      sender: 'AI',
      message:
        'Absolutely! Liquid cooling reduces energy consumption by up to 40% compared to air cooling.',
      timestamp: '3:24 PM',
    },
  ],
  'Net-Zero Office Building Study': [
    {
      sender: 'AI',
      message:
        'Assessing net-zero energy strategies for the office building...',
      timestamp: '4:00 PM',
    },
    {
      sender: 'User',
      message: 'Can we achieve net-zero with only solar panels?',
      timestamp: '4:02 PM',
    },
    {
      sender: 'AI',
      message:
        'It’s possible, but energy storage and demand management are key to success.',
      timestamp: '4:04 PM',
    },
  ],
};

export const mockAnalysisResults: AnalysisResults = {
  energyUsage: 250000,
  recommendations: [
    'Upgrade HVAC system efficiency',
    'Implement smart lighting controls',
    'Improve building envelope insulation',
  ],
  simulationData: [
    { month: 'Jan', usage: 25000 },
    { month: 'Feb', usage: 22000 },
    { month: 'Mar', usage: 20000 },
  ],
};
