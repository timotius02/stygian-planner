import axios from 'axios';
import type { EnkaPlayerData, EnkaCharacterData } from '@/types/enka';
import type { OwnedCharacter } from '@/types/character';
import { AVATAR_ID_MAP, getCharacterById } from '@/data/characters';

const ENKA_API_BASE = 'https://enka.network/api';

const apiClient = axios.create({
  baseURL: ENKA_API_BASE,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

export class EnkaApiService {
  /**
   * Fetch player data from Enka Network API
   */
  async fetchPlayerData(uid: string): Promise<EnkaPlayerData> {
    const response = await apiClient.get<EnkaPlayerData>(`/uid/${uid}`);
    return response.data;
  }

  /**
   * Transform Enka character data to app format
   */
  transformToOwnedCharacters(
    avatarInfoList: EnkaCharacterData[] | undefined
  ): OwnedCharacter[] {
    if (!avatarInfoList || !Array.isArray(avatarInfoList)) {
      return [];
    }
    return avatarInfoList
      .map((avatar) => this.transformCharacter(avatar))
      .filter((char): char is OwnedCharacter => char !== null);
  }

  /**
   * Transform single Enka character to OwnedCharacter
   */
  private transformCharacter(
    avatarData: EnkaCharacterData
  ): OwnedCharacter | null {
    const characterId = AVATAR_ID_MAP[avatarData.avatarId];

    if (!characterId) {
      console.warn(`Unknown avatarId: ${avatarData.avatarId}`);
      return null;
    }

    const level = this.extractCharacterLevel(avatarData.propMap);
    const constellation = this.extractConstellation(avatarData.talentIdList);
    const talents = this.extractTalentLevels(avatarData.skillLevelMap);

    // Get character metadata from static data
    const characterData = getCharacterById(characterId);

    if (characterData) {
      // Use the static character data for metadata
      return {
        id: characterId,
        name: characterData.name,
        element: characterData.element,
        weaponType: characterData.weaponType,
        iconUrl: characterData.iconUrl,
        rarity: characterData.rarity,
        level,
        constellation,
        talents,
      };
    }

    // Fallback for characters not in static data
    return {
      id: characterId,
      name: characterId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      element: 'pyro', // Placeholder
      weaponType: 'sword', // Placeholder
      iconUrl: `https://enka.network/ui/UI_AvatarIcon_${characterId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}.png`,
      rarity: 5, // Placeholder
      level,
      constellation,
      talents,
    };
  }

  /**
   * Extract character level from propMap
   */
  extractCharacterLevel(
    propMap: EnkaCharacterData['propMap']
  ): number {
    // Level is typically stored with type 4001
    const levelProp = propMap['4001'];
    if (levelProp?.val) {
      return parseInt(levelProp.val, 10);
    }
    return 1;
  }

  /**
   * Extract constellation count from talentIdList
   */
  extractConstellation(talentIdList?: number[]): number {
    return talentIdList?.length ?? 0;
  }

  /**
   * Extract talent levels from skillLevelMap
   */
  extractTalentLevels(
    skillLevelMap: EnkaCharacterData['skillLevelMap']
  ): {
    normalAttack: number;
    elementalSkill: number;
    elementalBurst: number;
  } {
    const skillIds = Object.keys(skillLevelMap);

    // Sort skill IDs to determine which is which
    // This is a simplified approach - actual mapping may vary by character
    const sortedIds = skillIds.sort();

    return {
      normalAttack: skillLevelMap[sortedIds[0]] ?? 1,
      elementalSkill: skillLevelMap[sortedIds[1]] ?? 1,
      elementalBurst: skillLevelMap[sortedIds[2]] ?? 1,
    };
  }
}

// Export singleton instance
export const enkaApiService = new EnkaApiService();
