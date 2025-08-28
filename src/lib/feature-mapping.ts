import { PlanId } from '../config/plans';

// Mapping function that converts truthy features into exact bullet strings
export function getFeatureBullets(planId: PlanId): string[] {
  const bullets: string[] = [];
  
  if (planId === 'starter') {
    bullets.push('Up to 25 review requests per month');
    bullets.push('Public rating link & QR code downloads (print‑ready signage)');
    bullets.push('Google review link with Test Redirect (policy‑safe flow)');
    bullets.push('Feedback Inbox with Statuses & Private Notes');
    bullets.push('Basic analytics: KPIs + star distribution (last 30 days)');
    bullets.push('Manual sharing (link/QR)');
    bullets.push('Basic integrations: Zapier/Make & CSV import');
    bullets.push('Email support');
  } else if (planId === 'pro') {
    bullets.push('Unlimited review requests');
    bullets.push('Automations: POS auto‑send (Square), send delays & 1 follow‑up reminder');
    bullets.push('Advanced analytics & insights: trends, keyword cloud, peak times');
    bullets.push('Team collaboration (up to 5 seats)');
    bullets.push('Custom branding for public page + custom domain');
    bullets.push('Full CSV exports (all time)');
    bullets.push('Advanced integrations: Square (Toast/Clover as they roll out)');
    bullets.push('Priority support');
    bullets.push('API access');
    bullets.push('Extras (Beta): AI reply assistant, Slack/MS Teams alerts, multi‑language templates, testimonial widget, kiosk mode');
    bullets.push('White‑label options (add‑on)');
  }
  
  return bullets;
}

// Get beta features for a plan
export function getBetaFeatures(planId: PlanId): string[] {
  if (planId === 'pro') {
    return [
      'testimonials_widget',
      'ai_reply_assistant_beta',
      'slack_teams_alerts_beta',
      'multilanguage_beta',
      'kiosk_mode_beta'
    ];
  }
  return [];
}
