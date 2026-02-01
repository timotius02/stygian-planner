export interface EnkaPlayerData {
  player: {
    nickname: string;
    level: number;
    signature?: string;
    worldLevel?: number;
    nameCardId?: number;
    finishAchievementNum?: number;
    towerFloorIndex?: number;
    towerLevelIndex?: number;
    showAvatarInfoList?: Array<{
      avatarId: number;
      level: number;
    }>;
    showNameCardIdList?: number[];
    profilePicture?: {
      avatarId: number;
    };
  };
  avatarInfoList: EnkaCharacterData[];
  ttl: number;
  uid: string;
}

export interface EnkaCharacterData {
  avatarId: number;
  propMap: {
    [key: string]: {
      type: number;
      ival: string;
      val?: string;
    };
  };
  fightPropMap: {
    [key: string]: number;
  };
  skillDepotId: number;
  inherentProudSkillList: number[];
  skillLevelMap: {
    [skillId: string]: number;
  };
  equipList: EnkaEquipment[];
  fetterInfo?: {
    expLevel: number;
  };
  talentIdList?: number[];
  proudSkillExtraLevelMap?: {
    [skillId: string]: number;
  };
}

export interface EnkaEquipment {
  itemId: number;
  reliquary?: EnkaReliquary;
  weapon?: EnkaWeapon;
  flat: {
    itemType: string;
    nameTextMapHash: string;
    rankLevel: number;
  };
}

export interface EnkaReliquary {
  // Artifact properties
}

export interface EnkaWeapon {
  // Weapon properties
}
