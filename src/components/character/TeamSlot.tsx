import { Plus, X, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ElementType, OwnedCharacter } from '@/types';

interface TeamSlotProps {
  character?: OwnedCharacter | null;
  onClick: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showConstellation?: boolean;
}

const elementGradients: Record<ElementType, string> = {
  pyro: 'from-red-500 via-orange-500 to-red-600',
  hydro: 'from-blue-500 via-cyan-500 to-blue-600',
  electro: 'from-purple-500 via-fuchsia-500 to-purple-600',
  cryo: 'from-cyan-400 via-blue-400 to-cyan-500',
  dendro: 'from-green-500 via-emerald-500 to-green-600',
  anemo: 'from-teal-400 via-cyan-400 to-teal-500',
  geo: 'from-yellow-500 via-amber-500 to-yellow-600',
};

const elementGlows: Record<ElementType, string> = {
  pyro: 'shadow-red-500/40',
  hydro: 'shadow-blue-500/40',
  electro: 'shadow-purple-500/40',
  cryo: 'shadow-cyan-400/40',
  dendro: 'shadow-green-500/40',
  anemo: 'shadow-teal-400/40',
  geo: 'shadow-yellow-500/40',
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

const ringSizes = {
  sm: 'p-[2px]',
  md: 'p-[3px]',
  lg: 'p-[4px]',
};

export function TeamSlot({
  character,
  onClick,
  onRemove,
  size = 'md',
  showConstellation = true,
}: TeamSlotProps) {
  const isEmpty = !character;

  return (
    <div className="relative group slot-container">
      {/* Outer Glow Effect */}
      {!isEmpty && (
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500',
            elementGlows[character.element]
          )}
        />
      )}

      <button
        onClick={onClick}
        className={cn(
          'relative rounded-full flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          isEmpty
            ? 'empty-slot'
            : cn(
                'bg-gradient-to-br shadow-xl hover:shadow-2xl hover:scale-110',
                ringSizes[size],
                elementGradients[character.element],
                elementGlows[character.element]
              )
        )}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center gap-1">
            <Plus className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors duration-300" />
          </div>
        ) : (
          <div
            className={cn(
              'w-full h-full rounded-full overflow-hidden bg-slate-900 ring-2 ring-black/40 relative'
            )}
          >
            {/* Character Image */}
            <img
              src={character.iconUrl}
              alt={character.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              crossOrigin="anonymous"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error(`Failed to load icon for ${character.name}:`, character.iconUrl);
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.character-fallback') as HTMLElement;
                if (fallback) {
                  fallback.style.display = 'flex';
                }
              }}
            />

            {/* Fallback Initial */}
            <div
              className="character-fallback w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg hidden"
            >
              {character.name.charAt(0)}
            </div>

            {/* Rarity Indicator */}
            {character.rarity === 5 && (
              <div className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center">
                <Crown className="w-3 h-3 text-amber-400 drop-shadow-md" />
              </div>
            )}
          </div>
        )}
      </button>

      {/* Level Badge */}
      {!isEmpty && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg z-10 flex items-center gap-1">
          <span>Lv.{character.level}</span>
        </div>
      )}

      {/* Constellation Badge */}
      {!isEmpty && showConstellation && character.constellation > 0 && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 z-10">
          <span className="text-[9px] font-bold text-white">C{character.constellation}</span>
        </div>
      )}

      {/* Remove Button */}
      {!isEmpty && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg shadow-rose-600/30 hover:scale-110 z-20"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Hover Glow Effect for Empty Slots */}
      {isEmpty && (
        <div className="absolute inset-0 rounded-full bg-violet-500/0 group-hover:bg-violet-500/10 transition-colors duration-300 pointer-events-none" />
      )}

      {/* Character Name Tooltip */}
      {!isEmpty && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 px-2 py-1 rounded-lg text-xs text-slate-300 whitespace-nowrap shadow-xl">
            {character.name}
          </div>
        </div>
      )}
    </div>
  );
}
