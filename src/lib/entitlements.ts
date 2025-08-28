import { PLANS, PlanId } from '../config/plans';

export function hasFeature(planId: PlanId, key: string) {
  const plan = PLANS[planId];
  if (!plan) return false;
  const path = key.split('.'); // supports integrations.square
  let cur: any = plan.features;
  for (const p of path) cur = cur?.[p];
  return !!(cur && cur !== 'coming_soon' && cur !== 'beta');
}

export function isBeta(planId: PlanId, key: string) {
  const v = key.split('.').reduce((acc: any, p) => acc?.[p], PLANS[planId].features);
  return v === 'beta';
}

export function isComingSoon(planId: PlanId, key: string) {
  const v = key.split('.').reduce((acc: any, p) => acc?.[p], PLANS[planId].features);
  return v === 'coming_soon';
}

export function getPlanLimit(planId: PlanId, key: string) {
  const plan = PLANS[planId];
  if (!plan) return null;
  const path = key.split('.');
  let cur: any = plan.limits;
  for (const p of path) cur = cur?.[p];
  return cur;
}

export function getPlan(planId: PlanId) {
  return PLANS[planId];
}
