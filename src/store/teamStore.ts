import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OwnedCharacter, TeamSlot, BattlefieldTeam } from '@/types';

interface TeamState {
  // State
  currentUID: string | null;
  ownedCharacters: OwnedCharacter[]; // Unified character storage
  lastFetched: number | null; // timestamp of last character fetch
  teams: Record<string, BattlefieldTeam>; // keyed by battlefieldId

  // Actions
  setUID: (uid: string) => void;
  setOwnedCharacters: (characters: OwnedCharacter[]) => void;
  refreshCharacters: () => Promise<void>;
  addCharacter: (character: OwnedCharacter) => void;
  removeCharacter: (characterId: string) => void;
  updateCharacter: (characterId: string, updates: Partial<OwnedCharacter>) => void;
  assignCharacter: (
    battlefieldId: string,
    slotPosition: number,
    characterId: string
  ) => void;
  removeCharacterFromSlot: (battlefieldId: string, slotPosition: number) => void;
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
        set({
          ownedCharacters: characters,
          lastFetched: Date.now(),
        }),

      refreshCharacters: async () => {
        const { currentUID, ownedCharacters } = get();
        if (!currentUID) {
          throw new Error('No UID set. Please enter your UID first.');
        }
        // Import dynamically to avoid circular dependency
        const { enkaApiService } = await import('@/services/enkaApi');
        const data = await enkaApiService.fetchPlayerData(currentUID);
        const apiCharacters = enkaApiService.transformToOwnedCharacters(
          data.avatarInfoList
        );

        // Update existing characters or add new ones from API
        const updatedCharacters = [...ownedCharacters];

        for (const apiChar of apiCharacters) {
          const existingIndex = updatedCharacters.findIndex(c => c.id === apiChar.id);
          if (existingIndex >= 0) {
            // Update existing character with API data
            updatedCharacters[existingIndex] = apiChar;
          } else {
            // Add new character from API
            updatedCharacters.push(apiChar);
          }
        }

        set({
          ownedCharacters: updatedCharacters,
          lastFetched: Date.now()
        });
      },

      addCharacter: (character: OwnedCharacter) =>
        set((state) => {
          // Check if character already exists
          const exists = state.ownedCharacters.some((c) => c.id === character.id);
          if (exists) {
            // Update existing character
            return {
              ownedCharacters: state.ownedCharacters.map((c) =>
                c.id === character.id ? character : c
              ),
            };
          }
          // Add new character
          return {
            ownedCharacters: [...state.ownedCharacters, character],
          };
        }),

      removeCharacter: (characterId: string) =>
        set((state) => ({
          ownedCharacters: state.ownedCharacters.filter((c) => c.id !== characterId),
        })),

      updateCharacter: (characterId: string, updates: Partial<OwnedCharacter>) =>
        set((state) => ({
          ownedCharacters: state.ownedCharacters.map((c) =>
            c.id === characterId ? { ...c, ...updates } : c
          ),
        })),

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

      removeCharacterFromSlot: (battlefieldId: string, slotPosition: number) =>
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
          const { [battlefieldId]: removed, ...remainingTeams } = state.teams;
          void removed; // Explicitly mark as intentionally unused
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
