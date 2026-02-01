import { AVATAR_ID_MAP } from '@/data/characters';

/**
 * Map Enka Network avatarId to character ID
 */
export function mapAvatarIdToCharacterId(avatarId: number): string | null {
  return AVATAR_ID_MAP[avatarId] ?? null;
}

/**
 * Check if an avatarId is valid/known
 */
export function isValidAvatarId(avatarId: number): boolean {
  return avatarId in AVATAR_ID_MAP;
}

/**
 * Get all known avatar IDs
 */
export function getAllAvatarIds(): number[] {
  return Object.keys(AVATAR_ID_MAP).map(Number);
}

/**
 * Get character ID from avatar ID with fallback
 */
export function getCharacterIdSafe(
  avatarId: number,
  fallback: string = 'unknown'
): string {
  return AVATAR_ID_MAP[avatarId] ?? fallback;
}
