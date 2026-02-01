import { useState, useMemo } from 'react';
import { Search, UserCheck, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTeamStore } from '@/store/teamStore';
import { cn } from '@/lib/utils';
import type { ElementType, OwnedCharacter } from '@/types';

interface CharacterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: string) => void;
}

const elementFilters: { element: ElementType; label: string; gradient: string; glow: string }[] = [
  { element: 'pyro', label: 'Pyro', gradient: 'from-red-500 to-orange-600', glow: 'shadow-red-500/30' },
  { element: 'hydro', label: 'Hydro', gradient: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/30' },
  { element: 'electro', label: 'Electro', gradient: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/30' },
  { element: 'cryo', label: 'Cryo', gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/30' },
  { element: 'dendro', label: 'Dendro', gradient: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/30' },
  { element: 'anemo', label: 'Anemo', gradient: 'from-teal-400 to-cyan-500', glow: 'shadow-teal-400/30' },
  { element: 'geo', label: 'Geo', gradient: 'from-yellow-500 to-amber-600', glow: 'shadow-yellow-500/30' },
];

export function CharacterSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: CharacterSelectorModalProps) {
  const { ownedCharacters, isCharacterAssigned } = useTeamStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  const filteredCharacters = useMemo(() => {
    let characters = ownedCharacters;

    if (selectedElement) {
      characters = characters.filter((c) => c.element === selectedElement);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      characters = characters.filter((c) =>
        c.name.toLowerCase().includes(query)
      );
    }

    return characters;
  }, [ownedCharacters, selectedElement, searchQuery]);

  const handleSelect = (characterId: string) => {
    onSelect(characterId);
    onClose();
    setSearchQuery('');
    setSelectedElement(null);
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setSelectedElement(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-[hsl(260_30%_8%)] border border-white/10 text-slate-100 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-white/10">
          <DialogTitle className="text-xl font-bold text-gradient-mystic flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
              <UserCheck className="w-5 h-5 text-violet-400" />
            </div>
            Select Character
          </DialogTitle>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-genshin pl-11 h-11"
            />
          </div>

          {/* Element Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by Element</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedElement === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedElement(null)}
                className={cn(
                  'rounded-full px-4 transition-all duration-200',
                  selectedElement === null
                    ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
              >
                All
              </Button>
              {elementFilters.map(({ element, label, gradient, glow }) => (
                <Button
                  key={element}
                  variant={selectedElement === element ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedElement(element)}
                  className={cn(
                    'rounded-full px-4 transition-all duration-200',
                    selectedElement === element
                      ? cn('bg-gradient-to-r text-white shadow-lg', gradient, glow)
                      : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  )}
                >
                  <span className={cn(
                    'w-2 h-2 rounded-full mr-2',
                    selectedElement === element ? 'bg-white' : cn('bg-gradient-to-r', gradient)
                  )} />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto mt-4 -mx-6 px-6 py-2">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              {ownedCharacters.length === 0 ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto">
                    <UserCheck className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-lg font-medium">No characters found</p>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    Enter your UID to load your characters from Enka Network
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg">No characters match your filters</p>
                  <p className="text-sm text-slate-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {filteredCharacters.map((character) => (
                <CharacterGridItem
                  key={character.id}
                  character={character}
                  isAssigned={isCharacterAssigned(character.id)}
                  onClick={() => handleSelect(character.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <span>
            {filteredCharacters.length} of {ownedCharacters.length} characters
          </span>
          {selectedElement && (
            <button
              onClick={() => setSelectedElement(null)}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CharacterGridItemProps {
  character: OwnedCharacter;
  isAssigned: boolean;
  onClick: () => void;
}

const elementBorderColors: Record<ElementType, string> = {
  pyro: 'border-red-400/70 hover:border-red-400 shadow-red-500/10 hover:shadow-red-500/20',
  hydro: 'border-blue-400/70 hover:border-blue-400 shadow-blue-500/10 hover:shadow-blue-500/20',
  electro: 'border-purple-400/70 hover:border-purple-400 shadow-purple-500/10 hover:shadow-purple-500/20',
  cryo: 'border-cyan-300/70 hover:border-cyan-300 shadow-cyan-400/10 hover:shadow-cyan-400/20',
  dendro: 'border-green-400/70 hover:border-green-400 shadow-green-500/10 hover:shadow-green-500/20',
  anemo: 'border-teal-300/70 hover:border-teal-300 shadow-teal-400/10 hover:shadow-teal-400/20',
  geo: 'border-yellow-400/70 hover:border-yellow-400 shadow-yellow-500/10 hover:shadow-yellow-500/20',
};

function CharacterGridItem({
  character,
  isAssigned,
  onClick,
}: CharacterGridItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={isAssigned}
      className={cn(
        'relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
        isAssigned
          ? 'opacity-40 cursor-not-allowed bg-slate-900/50'
          : 'hover:bg-slate-800/50 cursor-pointer'
      )}
    >
      {/* Character Icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-200 shadow-lg',
          elementBorderColors[character.element],
          !isAssigned && 'group-hover:scale-110 group-hover:shadow-xl'
        )}
      >
        <img
          src={character.iconUrl}
          alt={character.name}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error(`Failed to load icon for ${character.name}:`, character.iconUrl);
            target.style.display = 'none';
            // Show a fallback with the character's initial
            const fallback = target.parentElement?.querySelector('.character-fallback') as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />
        <div
          className="character-fallback w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg hidden"
        >
          {character.name.charAt(0)}
        </div>
      </div>

      {/* Character Name */}
      <span className={cn(
        'text-xs text-center truncate w-full transition-colors',
        isAssigned ? 'text-slate-600' : 'text-slate-300 group-hover:text-slate-100'
      )}>
        {character.name}
      </span>

      {/* Level Badge */}
      <span className="text-[10px] text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded-full">
        Lv.{character.level}
      </span>

      {/* Assigned Indicator */}
      {isAssigned && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-xl">
          <span className="text-[10px] font-medium text-slate-500 bg-slate-900/90 px-2 py-1 rounded-full border border-slate-700">
            Assigned
          </span>
        </div>
      )}

      {/* Hover Glow Effect */}
      {!isAssigned && (
        <div className="absolute inset-0 rounded-xl bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors duration-200 -z-10" />
      )}
    </button>
  );
}
