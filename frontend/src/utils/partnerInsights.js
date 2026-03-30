export const SDG_GOALS = [
  { id: 1, title: 'No Poverty' },
  { id: 2, title: 'Zero Hunger' },
  { id: 3, title: 'Good Health and Well-being' },
  { id: 4, title: 'Quality Education' },
  { id: 5, title: 'Gender Equality' },
  { id: 6, title: 'Clean Water and Sanitation' },
  { id: 7, title: 'Affordable and Clean Energy' },
  { id: 8, title: 'Decent Work and Economic Growth' },
  { id: 9, title: 'Industry, Innovation and Infrastructure' },
  { id: 10, title: 'Reduced Inequalities' },
  { id: 11, title: 'Sustainable Cities and Communities' },
  { id: 12, title: 'Responsible Consumption and Production' },
  { id: 13, title: 'Climate Action' },
  { id: 14, title: 'Life Below Water' },
  { id: 15, title: 'Life on Land' },
  { id: 16, title: 'Peace, Justice and Strong Institutions' },
  { id: 17, title: 'Partnerships for the Goals' },
];

export function formatSdgLabel(goalNumber) {
  const sdg = SDG_GOALS.find((item) => item.id === Number(goalNumber));
  return sdg ? `SDG ${sdg.id}: ${sdg.title}` : `SDG ${goalNumber}`;
}

function isContactComplete(contact) {
  return Boolean(contact?.name && contact?.email && contact?.phone && contact?.position);
}

export function calculatePartnerReadiness(partner) {
  let score = 0;

  if (partner?.verificationStatus === 'verified') score += 15;
  if ((partner?.verificationDocuments || []).length > 0) score += 15;
  if (isContactComplete(partner?.contactPerson)) score += 15;

  const sdgCount = (partner?.sdgGoals || []).length;
  if (sdgCount > 0) score += 10;
  if (sdgCount >= 3) score += 10;

  const csrCount = (partner?.csrFocus || []).length;
  if (csrCount > 0) score += 10;
  if (csrCount >= 2) score += 5;

  const minBudget = Number(partner?.partnershipPreferences?.budgetRange?.min || 0);
  const maxBudget = Number(partner?.partnershipPreferences?.budgetRange?.max || 0);
  if (maxBudget >= minBudget && maxBudget > 0) score += 10;

  if (Number(partner?.capabilities?.financialCapacity || 0) > 0) score += 5;

  const hasContributionSignals =
    Number(partner?.capabilities?.volunteerHoursAvailable || 0) > 0 ||
    Number(partner?.capabilities?.employeeCount || 0) > 0 ||
    (partner?.capabilities?.skillsAvailable || []).length > 0 ||
    (partner?.capabilities?.inKindOfferings || []).length > 0;

  if (hasContributionSignals) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function getReadinessTier(score) {
  if (score >= 80) return 'high';
  if (score >= 55) return 'medium';
  return 'low';
}

export function getReadinessLabel(score) {
  const tier = getReadinessTier(score);
  if (tier === 'high') return 'High Readiness';
  if (tier === 'medium') return 'Medium Readiness';
  return 'Early Readiness';
}
