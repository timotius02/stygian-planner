import { useState, useMemo } from 'react';
import { Plus, X, UserPlus, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeamStore } from '@/store/teamStore';
import { cn } from '@/lib/utils';
import type { ElementType, WeaponType, OwnedCharacter } from '@/types';
import { CHARACTERS } from '@/data/characters';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const elements: { value: ElementType; label: string; color: string; icon: string }[] = [
  { value: 'pyro', label: 'Pyro', color: 'from-red-500 to-orange-600', icon: '🔥' },
  { value: 'hydro', label: 'Hydro', color: 'from-blue-500 to-cyan-600', icon: '💧' },
  { value: 'electro', label: 'Electro', color: 'from-purple-500 to-fuchsia-600', icon: '⚡' },
  { value: 'cryo', label: 'Cryo', color: 'from-cyan-400 to-blue-500', icon: '❄️' },
  { value: 'dendro', label: 'Dendro', color: 'from-green-500 to-emerald-600', icon: '🌿' },
  { value: 'anemo', label: 'Anemo', color: 'from-teal-400 to-cyan-500', icon: '🌪️' },
  { value: 'geo', label: 'Geo', color: 'from-yellow-500 to-amber-600', icon: '🪨' },
];

const weapons: { value: WeaponType; label: string; icon: string }[] = [
  { value: 'sword', label: 'Sword', icon: '⚔️' },
  { value: 'claymore', label: 'Claymore', icon: '🗡️' },
  { value: 'polearm', label: 'Polearm', icon: '🔱' },
  { value: 'catalyst', label: 'Catalyst', icon: '📖' },
  { value: 'bow', label: 'Bow', icon: '🏹' },
];

export function AddCharacterModal({ isOpen, onClose }: AddCharacterModalProps) {
  const { addCharacter, ownedCharacters } = useTeamStore();

  const [step, setStep] = useState<'select' | 'custom'>('select');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Custom character form state - only level and constellation are editable
  const [customLevel, setCustomLevel] = useState(90);
  const [customConstellation, setCustomConstellation] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  // Get characters that are not already owned
  const availableCharacters = useMemo(() => {
    const ownedIds = new Set(ownedCharacters.map((c) => c.id));

    return CHARACTERS.filter((c) => !ownedIds.has(c.id));
  }, [ownedCharacters]);

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return availableCharacters;
    const query = searchQuery.toLowerCase();
    return availableCharacters.filter((c) =>
      c.name.toLowerCase().includes(query)
    );
  }, [availableCharacters, searchQuery]);

  // Get selected character data
  const selectedCharacter = useMemo(() => {
    if (!selectedCharacterId) return null;
    return CHARACTERS.find((c) => c.id === selectedCharacterId) || null;
  }, [selectedCharacterId]);

  const handleSelectCharacter = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setStep('custom');
    // Reset level and constellation to defaults when selecting a new character
    setCustomLevel(90);
    setCustomConstellation(0);
  };

  const handleAddCustomCharacter = () => {
    if (!selectedCharacter) return;

    const character: OwnedCharacter = {
      id: selectedCharacter.id,
      name: selectedCharacter.name,
      element: selectedCharacter.element,
      weaponType: selectedCharacter.weaponType,
      iconUrl: selectedCharacter.iconUrl,
      rarity: selectedCharacter.rarity,
      level: customLevel,
      constellation: customConstellation,
      talents: {
        normalAttack: 1,
        elementalSkill: 1,
        elementalBurst: 1,
      },
    };

    addCharacter(character);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setStep('select');
    setSelectedCharacterId(null);
    setCustomLevel(90);
    setCustomConstellation(0);
    setSearchQuery('');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedCharacterId(null);
  };

  const isValid = selectedCharacter && customLevel >= 1 && customLevel <= 90 && customConstellation >= 0 && customConstellation <= 6;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-[hsl(260_25%_8%)] border border-white/10 text-slate-100 shadow-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gradient-mystic flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-md" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-800/30 flex items-center justify-center border border-violet-500/40">
                  {step === 'select' ? (
                    <UserPlus className="w-6 h-6 text-violet-400" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  )}
                </div>
              </div>
              <div>
                <span className="block">
                  {step === 'select' ? 'Add Character' : 'Set Character Details'}
                </span>
                <span className="text-xs font-normal text-slate-400">
                  {step === 'select'
                    ? `${availableCharacters.length} characters available to add`
                    : selectedCharacter?.name
                  }
                </span>
              </div>
            </DialogTitle>
            {step === 'custom' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-slate-400 hover:text-white"
              >
                Back
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        {step === 'select' ? (
          <>
            {/* Search */}
            <div className="p-6 pb-4">
              <div className="relative">
                <Input
                  placeholder="Search characters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-genshin pl-4 h-12 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Character Grid */}
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              {filteredCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-lg text-slate-300">
                    {searchQuery ? 'No characters match your search' : 'All characters added!'}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    {searchQuery
                      ? 'Try a different search term'
                      : 'You have added all available characters'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {filteredCharacters.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => handleSelectCharacter(character.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-slate-800/50 hover:scale-105 group"
                    >
                      <div
                        className={cn(
                          'w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-lg',
                          getElementBorderColor(character.element),
                          'group-hover:shadow-xl'
                        )}
                      >
                        <img
                          src={character.iconUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg">
                          {character.name.charAt(0)}
                        </div>
                      </div>
                      <span className="text-[10px] text-center truncate w-full text-slate-400 group-hover:text-slate-200 transition-colors">
                        {character.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {filteredCharacters.length} available
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Character Details Form - Only Level and Constellation are editable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Selected Character Info (Read-only) */}
              {selectedCharacter && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-500 mb-3">Selected Character</p>
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg',
                        getElementBorderColor(selectedCharacter.element)
                      )}
                    >
                      <img
                        src={selectedCharacter.iconUrl}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{selectedCharacter.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                          {elements.find(e => e.value === selectedCharacter.element)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                          {weapons.find(w => w.value === selectedCharacter.weaponType)?.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] border-slate-600",
                            selectedCharacter.rarity === 5 ? "text-amber-400" : "text-violet-400"
                          )}
                        >
                          {selectedCharacter.rarity}★
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Level and Constellation - Editable */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Level</label>
                  <Input
                    type="number"
                    min={1}
                    max={90}
                    value={customLevel}
                    onChange={(e) => setCustomLevel(Math.min(90, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="input-genshin h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Constellation</label>
                  <Input
                    type="number"
                    min={0}
                    max={6}
                    value={customConstellation}
                    onChange={(e) => setCustomConstellation(Math.min(6, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="input-genshin h-12 text-base"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <p className="text-xs text-slate-500 mb-3">Preview</p>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg',
                      selectedCharacter ? getElementBorderColor(selectedCharacter.element) : ''
                    )}
                  >
                    {selectedCharacter ? (
                      <img
                        src={selectedCharacter.iconUrl}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg">
                        ?
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">
                      {selectedCharacter?.name || 'Select a character'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                        Lv.{customLevel}
                      </Badge>
                      {customConstellation > 0 && (
                        <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">
                          C{customConstellation}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCustomCharacter}
                disabled={!isValid}
                className="btn-genshin"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Character
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getElementBorderColor(element: ElementType): string {
  const colors: Record<ElementType, string> = {
    pyro: 'border-red-400/70 hover:border-red-400 shadow-red-500/20',
    hydro: 'border-blue-400/70 hover:border-blue-400 shadow-blue-500/20',
    electro: 'border-purple-400/70 hover:border-purple-400 shadow-purple-500/20',
    cryo: 'border-cyan-300/70 hover:border-cyan-300 shadow-cyan-400/20',
    dendro: 'border-green-400/70 hover:border-green-400 shadow-green-500/20',
    anemo: 'border-teal-300/70 hover:border-teal-300 shadow-teal-400/20',
    geo: 'border-yellow-400/70 hover:border-yellow-400 shadow-yellow-500/20',
  };
  return colors[element];
}
