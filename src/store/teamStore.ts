import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TeamSlot, BattlefieldTeam } from '@/types';

interface TeamState {
  // State
  teams: Record<string, BattlefieldTeam>; // keyed by battlefieldId

  // Actions
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
      teams: {},

      // Actions
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

      clearAllTeams: () => set({ teams: {} }),

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
        teams: state.teams,
      }),
    }
  )
);
