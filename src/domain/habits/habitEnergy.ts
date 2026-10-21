import type { EnergyColorTheme, EnergyStage } from './types';

export const ENERGY_STAGES: Record<EnergyStage, EnergyColorTheme> = {
  seedling: {
    stage: 'seedling',
    label: 'Seedling',
    gradient: 'from-[#E07A5F] to-[#EA580C]',
    fillColor: '#E07A5F',
    glowColor: 'rgba(224, 122, 95, 0.4)',
    textColor: 'text-terracotta',
  },
  sprout: {
    stage: 'sprout',
    label: 'Momentum',
    gradient: 'from-[#F59E0B] to-[#D97706]',
    fillColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    textColor: 'text-amber-600',
  },
  growth: {
    stage: 'growth',
    label: 'Growth',
    gradient: 'from-[#10B981] to-[#059669]',
    fillColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    textColor: 'text-emerald-600',
  },
  bloom: {
    stage: 'bloom',
    label: 'Almost There',
    gradient: 'from-[#06B6D4] to-[#0284C7]',
    fillColor: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    textColor: 'text-cyan-600',
  },
  achieved: {
    stage: 'achieved',
    label: 'Goal Reached 🏆',
    gradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FDE047]',
    fillColor: '#FBBF24',
    glowColor: 'rgba(251, 191, 36, 0.65)',
    textColor: 'text-amber-500 font-bold',
  },
};

export function getEnergyColorTheme(percent: number): EnergyColorTheme {
  const safePercent = Math.max(0, Math.min(100, percent));
  if (safePercent >= 100) return ENERGY_STAGES.achieved;
  if (safePercent >= 75) return ENERGY_STAGES.bloom;
  if (safePercent >= 50) return ENERGY_STAGES.growth;
  if (safePercent >= 25) return ENERGY_STAGES.sprout;
  return ENERGY_STAGES.seedling;
}
