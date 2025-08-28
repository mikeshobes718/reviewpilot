// Usage examples for the entitlements system
// This file demonstrates how to use hasFeature(), isBeta(), and isComingSoon() throughout the app

import { hasFeature, isBeta, isComingSoon, getPlanLimit } from './entitlements';
import { PlanId } from '../config/plans';

// Example 1: Dashboard usage limits
export function getDashboardUsageInfo(userPlan: PlanId) {
  const reviewLimit = getPlanLimit(userPlan, 'review_requests_per_month');
  const csvExportDays = getPlanLimit(userPlan, 'csv_export_window_days');
  
  return {
    reviewLimit: reviewLimit || 'Unlimited',
    csvExportDays: csvExportDays || 'All time',
    canExportCSV: hasFeature(userPlan, 'csv_export_window_days')
  };
}

// Example 2: Analytics page feature gating
export function getAnalyticsFeatures(userPlan: PlanId) {
  return {
    basicAnalytics: hasFeature(userPlan, 'analytics_basic'),
    advancedAnalytics: hasFeature(userPlan, 'analytics_advanced'),
    trends: hasFeature(userPlan, 'analytics_advanced'),
    keywordCloud: hasFeature(userPlan, 'analytics_advanced'),
    peakTimes: hasFeature(userPlan, 'analytics_advanced'),
    csvExport: hasFeature(userPlan, 'csv_export_window_days')
  };
}

// Example 3: Integrations page
export function getIntegrationStatus(userPlan: PlanId) {
  return {
    zapier: hasFeature(userPlan, 'integrations.zapier_make'),
    csvImport: hasFeature(userPlan, 'integrations.csv_import'),
    square: hasFeature(userPlan, 'integrations.square'),
    toast: isComingSoon(userPlan, 'integrations.toast'),
    clover: isComingSoon(userPlan, 'integrations.clover'),
    apiAccess: hasFeature(userPlan, 'api_access')
  };
}

// Example 4: Setup page features
export function getSetupFeatures(userPlan: PlanId) {
  return {
    publicRatingLink: hasFeature(userPlan, 'public_rating_link'),
    qrCodes: hasFeature(userPlan, 'qr_codes_and_signage'),
    googleTestRedirect: hasFeature(userPlan, 'google_test_redirect'),
    customBranding: hasFeature(userPlan, 'branding'),
    customDomain: hasFeature(userPlan, 'custom_domain')
  };
}

// Example 5: Inbox features
export function getInboxFeatures(userPlan: PlanId) {
  return {
    statuses: hasFeature(userPlan, 'inbox_statuses_and_notes'),
    privateNotes: hasFeature(userPlan, 'inbox_statuses_and_notes'),
    aiReplyAssistant: isBeta(userPlan, 'ai_reply_assistant_beta'),
    slackAlerts: isBeta(userPlan, 'slack_teams_alerts_beta')
  };
}

// Example 6: Team collaboration
export function getTeamFeatures(userPlan: PlanId) {
  const userLimit = getPlanLimit(userPlan, 'users_included');
  
  return {
    enabled: hasFeature(userPlan, 'team_collaboration'),
    userLimit: userLimit || 'Unlimited',
    canInvite: hasFeature(userPlan, 'team_collaboration')
  };
}

// Example 7: Automation features
export function getAutomationFeatures(userPlan: PlanId) {
  return {
    posAutoSend: hasFeature(userPlan, 'automations_pos'),
    followUpReminders: hasFeature(userPlan, 'automations_followup'),
    sendDelays: hasFeature(userPlan, 'automations_pos')
  };
}

// Example 8: Beta features with proper labeling
export function getBetaFeatures(userPlan: PlanId) {
  const betaFeatures = [
    { key: 'testimonials_widget', label: 'Testimonials Widget' },
    { key: 'ai_reply_assistant_beta', label: 'AI Reply Assistant' },
    { key: 'slack_teams_alerts_beta', label: 'Slack/MS Teams Alerts' },
    { key: 'multilanguage_beta', label: 'Multi-language Templates' },
    { key: 'kiosk_mode_beta', label: 'Kiosk Mode' }
  ];

  return betaFeatures
    .filter(feature => isBeta(userPlan, feature.key))
    .map(feature => ({
      ...feature,
      isBeta: true
    }));
}

// Example 9: CSV export limitations
export function getCSVExportInfo(userPlan: PlanId) {
  const exportDays = getPlanLimit(userPlan, 'csv_export_window_days');
  
  return {
    enabled: hasFeature(userPlan, 'csv_export_window_days'),
    windowDays: exportDays,
    isLimited: exportDays !== null,
    message: exportDays 
      ? `Export limited to last ${exportDays} days`
      : 'Export all time data'
  };
}

// Example 10: Review request limits
export function getReviewRequestInfo(userPlan: PlanId) {
  const monthlyLimit = getPlanLimit(userPlan, 'review_requests_per_month');
  
  return {
    monthlyLimit: monthlyLimit || 'Unlimited',
    isLimited: monthlyLimit !== null,
    remaining: monthlyLimit ? monthlyLimit - 0 : null, // Would get from actual usage
    canSend: monthlyLimit === null || (monthlyLimit - 0) > 0
  };
}
