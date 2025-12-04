import {
  FounderBasicsTab,
  ProblemSolutionTab,
  MarketDifferentiationTab,
  TractionValidationTab,
  TeamTab,
  VisionAmbitionTab,
  GrowthSupportTab,
  ReviewSubmitTab,
} from '../tabs';

import type { FormInstance } from 'antd';

export const createTabItems = (form: FormInstance, maxAccessibleTab?: number) => [
  {
    key: '1',
    label: 'Founder & Startup Basics',
    children: <FounderBasicsTab form={form} />,
    disabled: false, // First tab is always accessible
  },
  {
    key: '2',
    label: 'Problem & Solution',
    children: <ProblemSolutionTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 2,
  },
  {
    key: '3',
    label: 'Market & Differentiation',
    children: <MarketDifferentiationTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 3,
  },
  {
    key: '4',
    label: 'Traction & Validation',
    children: <TractionValidationTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 4,
  },
  {
    key: '5',
    label: 'Team',
    children: <TeamTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 5,
  },
  {
    key: '6',
    label: 'Vision & Ambition',
    children: <VisionAmbitionTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 6,
  },
  {
    key: '7',
    label: 'Growth & Support Needs',
    children: <GrowthSupportTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 7,
  },
  {
    key: '8',
    label: 'Review & Submit',
    children: <ReviewSubmitTab form={form} />,
    disabled: !maxAccessibleTab || maxAccessibleTab < 8,
  },
];