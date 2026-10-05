import React from 'react';
import { VoltOmanEngine } from './VoltOmanEngine';

export { VoltOmanEngine };

interface OmanEvPlatformProps {
  language: 'English' | 'Arabic';
  onAnalysisRequest?: (fn: () => Promise<void>) => void;
  userPlan?: string;
  onUpgrade?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

/**
 * OmanEvPlatform is now powered by the enterprise-grade "VoltOman Engine"
 * adhering strictly to Oman desert routing, mountain topography elevation math,
 * and midday charger thermal derating rules.
 */
export const OmanEvPlatform: React.FC<OmanEvPlatformProps> = (props) => {
  return <VoltOmanEngine {...props} />;
};

export default OmanEvPlatform;
