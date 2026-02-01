import { BOSSES } from '@/data/bosses';
import type { Boss } from '@/types/boss';

/**
 * Hook to get all boss data
 */
export function useBossData(): Boss[] {
  return BOSSES;
}

/**
 * Hook to get a specific boss by ID
 */
export function useBossById(bossId: string): Boss | undefined {
  return BOSSES.find((boss) => boss.id === bossId);
}

/**
 * Hook to get multiple bosses by IDs
 */
export function useBossesByIds(bossIds: string[]): Boss[] {
  return BOSSES.filter((boss) => bossIds.includes(boss.id));
}
