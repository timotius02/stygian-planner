import { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, X, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ElementType, Character } from '@/types';
import { CHARACTERS } from '@/data/characters';

interface CharacterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: string) => void;
}

const elementFilters: { element: ElementType; label: string; gradient: string; glow: string; icon: string }[] = [
  { element: 'pyro', label: 'Pyro', gradient: 'from-red-500 to-orange-600', glow: 'shadow-red-500/40', icon: '🔥' },
  { element: 'hydro', label: 'Hydro', gradient: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/40', icon: '💧' },
  { element: 'electro', label: 'Electro', gradient: 'from-purple-500 to-fuchsia-600', glow: 'shadow-purple-500/40', icon: '⚡' },
  { element: 'cryo', label: 'Cryo', gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/40', icon: '❄️' },
  { element: 'dendro', label: 'Dendro', gradient: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/40', icon: '🌿' },
  { element: 'anemo', label: 'Anemo', gradient: 'from-teal-400 to-cyan-500', glow: 'shadow-teal-400/40', icon: '🌪️' },
  { element: 'geo', label: 'Geo', gradient: 'from-yellow-500 to-amber-600', glow: 'shadow-yellow-500/40', icon: '🪨' },
];

export function CharacterSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: CharacterSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  const filteredCharacters = useMemo(() => {
    let characters = CHARACTERS;

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
  }, [selectedElement, searchQuery]);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-[hsl(260_25%_8%)] border border-white/10 text-slate-100 shadow-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gradient-mystic flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/30 rounded-xl blur-md" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-800/30 flex items-center justify-center border border-violet-500/40">
                  <Users className="w-6 h-6 text-violet-400" />
                </div>
              </div>
              <div>
                <span className="block">Select Character</span>
                <span className="text-xs font-normal text-slate-400">
                  {CHARACTERS.length} characters available
                </span>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="p-6 pb-4 space-y-5 border-b border-white/5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-genshin pl-12 h-12 text-base"
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

          {/* Element Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Filter className="w-4 h-4" />
              <span>Filter by Element</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedElement === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedElement(null)}
                className={cn(
                  'rounded-full px-4 h-9 transition-all duration-300',
                  selectedElement === null
                    ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/25'
                    : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                All
              </Button>
              {elementFilters.map(({ element, label, gradient, glow }) => (
                <Button
                  key={element}
                  variant={selectedElement === element ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedElement(element)}
                  className={cn(
                    'rounded-full px-4 h-9 transition-all duration-300',
                    selectedElement === element
                      ? cn('bg-gradient-to-r text-white shadow-lg', gradient, glow)
                      : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600'
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
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-lg text-slate-300">No characters match your filters</p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearchQuery(''); setSelectedElement(null); }}
                  className="mt-4 border-slate-700 text-slate-400 hover:bg-slate-800"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
              {filteredCharacters.map((character) => (
                <CharacterGridItem
                  key={character.id}
                  character={character}
                  onClick={() => handleSelect(character.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            Showing <span className="text-slate-300 font-medium">{filteredCharacters.length}</span> of{' '}
            <span className="text-slate-300 font-medium">{CHARACTERS.length}</span> characters
          </span>
          {selectedElement && (
            <button
              onClick={() => setSelectedElement(null)}
              className="text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium"
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
  character: Character;
  onClick: () => void;
}

const elementBorderColors: Record<ElementType, string> = {
  pyro: 'border-red-400/70 hover:border-red-400 shadow-red-500/20 hover:shadow-red-500/40',
  hydro: 'border-blue-400/70 hover:border-blue-400 shadow-blue-500/20 hover:shadow-blue-500/40',
  electro: 'border-purple-400/70 hover:border-purple-400 shadow-purple-500/20 hover:shadow-purple-500/40',
  cryo: 'border-cyan-300/70 hover:border-cyan-300 shadow-cyan-400/20 hover:shadow-cyan-400/40',
  dendro: 'border-green-400/70 hover:border-green-400 shadow-green-500/20 hover:shadow-green-500/40',
  anemo: 'border-teal-300/70 hover:border-teal-300 shadow-teal-400/20 hover:shadow-teal-400/40',
  geo: 'border-yellow-400/70 hover:border-yellow-400 shadow-yellow-500/20 hover:shadow-yellow-500/40',
};

const elementBgColors: Record<ElementType, string> = {
  pyro: 'bg-red-500/10',
  hydro: 'bg-blue-500/10',
  electro: 'bg-purple-500/10',
  cryo: 'bg-cyan-400/10',
  dendro: 'bg-green-500/10',
  anemo: 'bg-teal-400/10',
  geo: 'bg-yellow-500/10',
};

function CharacterGridItem({
  character,
  onClick,
}: CharacterGridItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300',
        'hover:bg-slate-800/50 cursor-pointer hover:scale-105'
      )}
    >
      {/* Character Icon Container */}
      <div
        className={cn(
          'relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-lg',
          elementBorderColors[character.element],
          'group-hover:scale-110 group-hover:shadow-xl'
        )}
      >
        {/* Glow Effect */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-md',
            elementBgColors[character.element]
          )}
        />

        {/* Character Image */}
        <img
          src={character.image}
          alt={character.name}
          className="relative w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error(`Failed to load image for ${character.name}:`, character.image);
            target.style.display = 'none';
            const fallback = target.parentElement?.querySelector('.character-fallback') as HTMLElement;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }}
        />

        {/* Fallback */}
        <div
          className="character-fallback w-full h-full items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg hidden"
        >
          {character.name.charAt(0)}
        </div>
      </div>

      {/* Character Name */}
      <span className={cn(
        'text-xs text-center truncate w-full transition-colors font-medium',
        'text-slate-300 group-hover:text-slate-100'
      )}>
        {character.name}
      </span>
    </button>
  );
}
