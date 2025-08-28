# Centralized Plan Entitlements System

This document describes the centralized plan entitlements system that ensures consistent feature gating across the Review Pilot application.

## Overview

The entitlements system centralizes all plan features, limits, and pricing in a single configuration file, making it easy to:
- Maintain consistent feature availability across the app
- Add new features without hardcoding them in multiple places
- Implement proper upsell flows for Pro features
- Track beta and coming soon features

## Files

### 1. `/src/config/plans.ts`
Contains the master configuration for all plans with:
- Pricing information
- Feature flags (boolean, 'beta', or 'coming_soon')
- Usage limits
- CTA button text

### 2. `/src/lib/entitlements.ts`
Core helper functions for feature gating:
- `hasFeature(planId, featureKey)` - Check if a plan has access to a feature
- `isBeta(planId, featureKey)` - Check if a feature is in beta for a plan
- `isComingSoon(planId, featureKey)` - Check if a feature is coming soon
- `getPlanLimit(planId, limitKey)` - Get plan-specific limits

### 3. `/src/lib/feature-mapping.ts`
Maps plan features to human-readable bullet points for the pricing page.

### 4. `/src/components/FeatureGate.tsx`
React component for gating features with upsell prompts.

## Usage Examples

### Basic Feature Checking
```typescript
import { hasFeature } from '../lib/entitlements';

// Check if user can access advanced analytics
if (hasFeature(userPlan, 'analytics_advanced')) {
  // Show advanced analytics
} else {
  // Show upsell prompt
}
```

### Using the FeatureGate Component
```typescript
import { FeatureGate } from '../components/FeatureGate';

<FeatureGate planId={userPlan} feature="api_access">
  <APIAccessPanel />
</FeatureGate>
```

### Checking Beta Features
```typescript
import { isBeta } from '../lib/entitlements';

if (isBeta(userPlan, 'ai_reply_assistant_beta')) {
  // Show beta badge and feature
}
```

### Getting Plan Limits
```typescript
import { getPlanLimit } from '../lib/entitlements';

const reviewLimit = getPlanLimit(userPlan, 'review_requests_per_month');
// Returns 25 for Starter, null (unlimited) for Pro
```

## Feature Keys

### Core Features
- `public_rating_link` - Public rating page
- `qr_codes_and_signage` - QR codes and printable signage
- `google_test_redirect` - Google review test redirect
- `inbox_statuses_and_notes` - Feedback inbox with statuses
- `analytics_basic` - Basic analytics (KPIs, star distribution)
- `analytics_advanced` - Advanced analytics (trends, keyword cloud)

### Integrations
- `integrations.zapier_make` - Zapier/Make integration
- `integrations.csv_import` - CSV import functionality
- `integrations.square` - Square POS integration
- `integrations.toast` - Toast POS (coming soon)
- `integrations.clover` - Clover POS (coming soon)

### Pro Features
- `automations_pos` - POS auto-send functionality
- `automations_followup` - Follow-up reminders
- `team_collaboration` - Multi-user collaboration
- `branding` - Custom branding options
- `custom_domain` - Custom domain support
- `api_access` - API access
- `priority_support` - Priority customer support

### Beta Features
- `testimonials_widget` - Testimonials widget
- `ai_reply_assistant_beta` - AI reply suggestions
- `slack_teams_alerts_beta` - Slack/MS Teams alerts
- `multilanguage_beta` - Multi-language support
- `kiosk_mode_beta` - In-store kiosk mode

## Plan Limits

### Starter Plan
- `review_requests_per_month: 25`
- `users_included: 1`
- `csv_export_window_days: 30`
- `locations_included: 1`

### Pro Plan
- `review_requests_per_month: null` (unlimited)
- `users_included: 5`
- `csv_export_window_days: null` (all time)
- `locations_included: 1`

## Analytics Events

The pricing page automatically tracks:
- `pricing_view` - When pricing page is viewed
- `pricing_cta_click` - When CTA buttons are clicked (with plan info)

## Best Practices

1. **Always use entitlements functions** instead of hardcoding plan checks
2. **Use FeatureGate component** for UI elements that need upsell prompts
3. **Check limits before operations** (e.g., review requests, CSV exports)
4. **Show beta badges** for beta features using `isBeta()`
5. **Handle coming soon features** gracefully using `isComingSoon()`

## Adding New Features

1. Add the feature flag to `/src/config/plans.ts`
2. Add the feature bullet to `/src/lib/feature-mapping.ts`
3. Use `hasFeature()` checks throughout the app
4. Add upsell prompts using `FeatureGate` component

## Testing

Use the test IDs in the pricing page:
- `starter-cta`, `pro-cta` - CTA buttons
- `starter-bullet-1..n`, `pro-bullet-1..n` - Feature bullets
- `pro-badge-most-popular` - Most popular badge

## Migration

When migrating existing hardcoded plan checks:
1. Replace `if (userPlan === 'pro')` with `if (hasFeature(userPlan, 'feature_key'))`
2. Replace `if (userPlan === 'starter')` with `if (!hasFeature(userPlan, 'feature_key'))`
3. Use `FeatureGate` component for UI elements
4. Update usage limits to use `getPlanLimit()`
