import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Info, Clock, Swords } from 'lucide-react';
import { BossInfoModal } from './BossInfoModal';
import { TeamSlot } from '@/components/character/TeamSlot';
import { CharacterSelectorModal } from '@/components/character/CharacterSelectorModal';
import { useTeamStore } from '@/store/teamStore';
import type { Boss } from '@/types/boss';

interface BattlefieldCardProps {
  boss: Boss;
  battlefieldNumber: number;
}

export function BattlefieldCard({ boss, battlefieldNumber }: BattlefieldCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharacterSelectorOpen, setIsCharacterSelectorOpen] = useState(false);
  const [selectedSlotPosition, setSelectedSlotPosition] = useState<number>(0);

  const {
    getBattlefieldTeam,
    assignCharacter,
    removeCharacter,
    ownedCharacters,
  } = useTeamStore();

  const battlefieldId = `battlefield-${battlefieldNumber}`;
  const team = getBattlefieldTeam(battlefieldId);

  const getCharacterForSlot = (position: number) => {
    const slot = team?.slots.find((s) => s.position === position);
    if (!slot?.characterId) return null;
    return ownedCharacters.find((c) => c.id === slot.characterId) || null;
  };

  const handleSlotClick = (position: number) => {
    setSelectedSlotPosition(position);
    setIsCharacterSelectorOpen(true);
  };

  const handleCharacterSelect = (characterId: string) => {
    assignCharacter(battlefieldId, selectedSlotPosition, characterId);
  };

  const handleRemoveCharacter = (position: number) => {
    removeCharacter(battlefieldId, position);
  };

  return (
    <>
      <div className="genshin-card p-5 group">
        {/* Header with Battlefield Number and Battle Time */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Swords className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-medium text-violet-400 uppercase tracking-wider">
                Battlefield {battlefieldNumber}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              {boss.name}
              <span className="text-slate-500 font-normal"> : {boss.subtitle}</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm">
              {boss.battleTime}s
            </span>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Boss Avatar with Level Badge */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative group/avatar cursor-pointer transition-transform duration-200 hover:scale-105"
            >
              <div className="boss-avatar-ring">
                <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={boss.iconUrl}
                    alt={boss.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-violet-400 text-lg font-bold">
                    {boss.name.charAt(0)}
                  </div>
                </div>
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 border border-violet-500/50 text-violet-300 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-lg">
                Lv. {boss.level}
              </div>
              {/* Info Icon on Hover */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 shadow-lg shadow-violet-600/30">
                <Info className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>

          {/* Boss Info and Team Slots */}
          <div className="flex-1 space-y-4">
            {/* Damage Type Badges */}
            <div className="flex flex-wrap gap-2">
              {boss.recommendedDamageTypes.map((damageType, index) => (
                <span
                  key={`rec-${index}`}
                  className="badge-recommended"
                >
                  <ThumbsUp className="w-3 h-3" />
                  {damageType.label}
                </span>
              ))}
              {boss.discouragedDamageTypes.map((damageType, index) => (
                <span
                  key={`disc-${index}`}
                  className="badge-discouraged"
                >
                  <ThumbsDown className="w-3 h-3" />
                  {damageType.label}
                </span>
              ))}
            </div>

            {/* Team Slots */}
            <div className="flex gap-3 pt-1">
              {[0, 1, 2, 3].map((slotIndex) => (
                <TeamSlot
                  key={slotIndex}
                  character={getCharacterForSlot(slotIndex)}
                  onClick={() => handleSlotClick(slotIndex)}
                  onRemove={() => handleRemoveCharacter(slotIndex)}
                  size="md"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boss Info Modal */}
      <BossInfoModal
        boss={boss}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Character Selector Modal */}
      <CharacterSelectorModal
        isOpen={isCharacterSelectorOpen}
        onClose={() => setIsCharacterSelectorOpen(false)}
        onSelect={handleCharacterSelect}
      />
    </>
  );
}
