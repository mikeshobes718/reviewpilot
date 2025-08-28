export const PLANS = {
  starter: {
    price: 0,
    label: 'Starter',
    trialIncludesPro: true,
    limits: {
      review_requests_per_month: 25,
      users_included: 1,
      csv_export_window_days: 30,
      locations_included: 1
    },
    features: {
      public_rating_link: true,
      qr_codes_and_signage: true,
      google_test_redirect: true,
      inbox_statuses_and_notes: true,
      analytics_basic: true,
      analytics_advanced: false,
      manual_sharing_only: true,
      automations_pos: false,
      automations_followup: false,
      integrations: {
        zapier_make: true,
        csv_import: true,
        square: false,
        toast: false,
        clover: false
      },
      branding: false,
      custom_domain: false,
      api_access: false,
      priority_support: false,
      team_collaboration: false,
      testimonials_widget: false,
      ai_reply_assistant_beta: false,
      slack_teams_alerts_beta: false,
      multilanguage_beta: false,
      kiosk_mode_beta: false,
      whitelabel_addon: false
    },
    ctas: { primary: 'Get Started Free' }
  },
  pro: {
    price: 49.99,
    label: 'Pro',
    trialDays: 30,
    mostPopular: true,
    limits: {
      review_requests_per_month: null,
      users_included: 5,
      csv_export_window_days: null,
      locations_included: 1
    },
    features: {
      public_rating_link: true,
      qr_codes_and_signage: true,
      google_test_redirect: true,
      inbox_statuses_and_notes: true,
      analytics_basic: true,
      analytics_advanced: true,
      manual_sharing_only: false,
      automations_pos: true,
      automations_followup: true,
      integrations: {
        zapier_make: true,
        csv_import: true,
        square: true,
        toast: 'coming_soon',
        clover: 'coming_soon'
      },
      branding: true,
      custom_domain: true,
      api_access: true,
      priority_support: true,
      team_collaboration: true,
      testimonials_widget: 'beta',
      ai_reply_assistant_beta: 'beta',
      slack_teams_alerts_beta: 'beta',
      multilanguage_beta: 'beta',
      kiosk_mode_beta: 'beta',
      whitelabel_addon: true
    },
    ctas: { primary: 'Start Pro Free' }
  }
} as const;

export type PlanId = keyof typeof PLANS;
