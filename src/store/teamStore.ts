import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OwnedCharacter, TeamSlot, BattlefieldTeam } from '@/types';

interface TeamState {
  // State
  currentUID: string | null;
  ownedCharacters: OwnedCharacter[];
  lastFetched: number | null; // timestamp of last character fetch
  teams: Record<string, BattlefieldTeam>; // keyed by battlefieldId

  // Actions
  setUID: (uid: string) => void;
  setOwnedCharacters: (characters: OwnedCharacter[]) => void;
  refreshCharacters: () => Promise<void>;
  assignCharacter: (
    battlefieldId: string,
    slotPosition: number,
    characterId: string
  ) => void;
  removeCharacter: (battlefieldId: string, slotPosition: number) => void;
  clearBattlefieldTeam: (battlefieldId: string) => void;
  clearAllTeams: () => void;
  getBattlefieldTeam: (battlefieldId: string) => BattlefieldTeam | undefined;
  isCharacterAssigned: (characterId: string) => boolean;
}

const createEmptySlots = (): TeamSlot[] => [
  { position: 0, characterId: null },
  { position: 1, characterId: null },
  { position: 2, characterId: null },
  { position: 3, characterId: null },
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUID: null,
      ownedCharacters: [],
      lastFetched: null,
      teams: {},

      // Actions
      setUID: (uid: string) => set({ currentUID: uid }),

      setOwnedCharacters: (characters: OwnedCharacter[]) =>
        set({ ownedCharacters: characters, lastFetched: Date.now() }),

      refreshCharacters: async () => {
        const { currentUID } = get();
        if (!currentUID) {
          throw new Error('No UID set. Please enter your UID first.');
        }
        // Import dynamically to avoid circular dependency
        const { enkaApiService } = await import('@/services/enkaApi');
        const data = await enkaApiService.fetchPlayerData(currentUID);
        const characters = enkaApiService.transformToOwnedCharacters(
          data.avatarInfoList
        );
        set({ ownedCharacters: characters, lastFetched: Date.now() });
      },

      assignCharacter: (
        battlefieldId: string,
        slotPosition: number,
        characterId: string
      ) =>
        set((state) => {
          const existingTeam = state.teams[battlefieldId];
          const slots = existingTeam
            ? [...existingTeam.slots]
            : createEmptySlots();

          // Update the specific slot
          const slotIndex = slots.findIndex((s) => s.position === slotPosition);
          if (slotIndex !== -1) {
            slots[slotIndex] = { position: slotPosition as 0 | 1 | 2 | 3, characterId };
          }

          return {
            teams: {
              ...state.teams,
              [battlefieldId]: {
                battlefieldId,
                slots,
              },
            },
          };
        }),

      removeCharacter: (battlefieldId: string, slotPosition: number) =>
        set((state) => {
          const existingTeam = state.teams[battlefieldId];
          if (!existingTeam) return state;

          const slots = existingTeam.slots.map((slot) =>
            slot.position === slotPosition
              ? { ...slot, characterId: null }
              : slot
          );

          return {
            teams: {
              ...state.teams,
              [battlefieldId]: {
                ...existingTeam,
                slots,
              },
            },
          };
        }),

      clearBattlefieldTeam: (battlefieldId: string) =>
        set((state) => {
          const { [battlefieldId]: _, ...remainingTeams } = state.teams;
          return { teams: remainingTeams };
        }),

      clearAllTeams: () => set({ teams: {}, currentUID: null, ownedCharacters: [], lastFetched: null }),

      getBattlefieldTeam: (battlefieldId: string) => {
        return get().teams[battlefieldId];
      },

      isCharacterAssigned: (characterId: string) => {
        const { teams } = get();
        return Object.values(teams).some((team) =>
          team.slots.some((slot) => slot.characterId === characterId)
        );
      },
    }),
    {
      name: 'stygian-planner-storage',
      partialize: (state) => ({
        currentUID: state.currentUID,
        ownedCharacters: state.ownedCharacters,
        lastFetched: state.lastFetched,
        teams: state.teams,
      }),
    }
  )
);
