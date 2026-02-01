export interface TeamSlot {
  position: 0 | 1 | 2 | 3;
  characterId: string | null;
}

export interface BattlefieldTeam {
  battlefieldId: string;
  slots: TeamSlot[];
}

export interface TeamComposition {
  uid: string;
  battlefields: BattlefieldTeam[];
  lastUpdated: Date;
}
