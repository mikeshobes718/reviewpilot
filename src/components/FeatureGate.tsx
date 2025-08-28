import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { hasFeature, isBeta, isComingSoon } from '../lib/entitlements';
import { PlanId } from '../config/plans';

interface FeatureGateProps {
  planId: PlanId;
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpsell?: boolean;
}

export function FeatureGate({ 
  planId, 
  feature, 
  children, 
  fallback, 
  showUpsell = true 
}: FeatureGateProps) {
  const hasAccess = hasFeature(planId, feature);
  const isBetaFeature = isBeta(planId, feature);
  const isComingSoonFeature = isComingSoon(planId, feature);

  if (hasAccess) {
    return (
      <div className="relative">
        {children}
        {isBetaFeature && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
            Beta
          </span>
        )}
      </div>
    );
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showUpsell) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {isComingSoonFeature ? 'Coming Soon' : 'Pro Feature'}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {isComingSoonFeature 
            ? 'This feature is coming soon to Pro plans.'
            : 'Upgrade to Pro to unlock this feature.'
          }
        </p>
        <a 
          href="/subscribe" 
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <Crown className="w-4 h-4 mr-2" />
          {isComingSoonFeature ? 'Learn More' : 'Upgrade to Pro'}
        </a>
      </div>
    );
  }

  return null;
}

// Convenience components for common feature gates
export function StarterFeature({ children, ...props }: Omit<FeatureGateProps, 'planId'>) {
  return <FeatureGate planId="starter" {...props}>{children}</FeatureGate>;
}

export function ProFeature({ children, ...props }: Omit<FeatureGateProps, 'planId'>) {
  return <FeatureGate planId="pro" {...props}>{children}</FeatureGate>;
}
