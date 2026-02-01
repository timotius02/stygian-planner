import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Info, Swords, Sparkles, Shield, Target } from 'lucide-react';
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
    removeCharacterFromSlot,
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
    removeCharacterFromSlot(battlefieldId, position);
  };

  const filledSlots = team?.slots.filter(s => s.characterId).length || 0;

  return (
    <>
      <div className="genshin-card p-6 group relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex items-start justify-between mb-6 relative">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30">
                <Swords className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                  Battlefield {battlefieldNumber}
                </span>
              </div>
              {filledSlots > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-300">
                    {filledSlots}/4
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 flex-wrap">
              {boss.name}
              <span className="text-slate-500 font-normal text-base">: {boss.subtitle}</span>
            </h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 relative">
          {/* Boss Avatar with Level Badge */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative group/avatar cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />

              <div className="relative boss-avatar-ring">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={boss.iconUrl}
                    alt={boss.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/avatar:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-violet-400 text-2xl font-bold bg-slate-900">
                    {boss.name.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-700 border border-violet-400/50 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-violet-600/30">
                Lv. {boss.level}
              </div>

              {/* Info Icon on Hover */}
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 shadow-lg shadow-violet-600/40 scale-90 group-hover/avatar:scale-100">
                <Info className="w-3.5 h-3.5 text-white" />
              </div>
            </button>

            {/* Boss Info Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-violet-500/10"
            >
              <Target className="w-3.5 h-3.5" />
              View Details
            </button>
          </div>

          {/* Boss Info and Team Slots */}
          <div className="flex-1 space-y-5">
            {/* Damage Type Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Damage Recommendations</span>
              </div>
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
            </div>

            {/* Divider */}
            <div className="section-divider" />

            {/* Team Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  Team Composition
                </span>
                <span className="text-xs text-slate-500">
                  Click to assign characters
                </span>
              </div>
              <div className="flex gap-4 justify-center sm:justify-start">
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
