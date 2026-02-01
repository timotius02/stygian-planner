import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ElementType, OwnedCharacter } from '@/types';

interface TeamSlotProps {
  character?: OwnedCharacter | null;
  onClick: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
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
  pyro: 'shadow-red-500/30',
  hydro: 'shadow-blue-500/30',
  electro: 'shadow-purple-500/30',
  cryo: 'shadow-cyan-400/30',
  dendro: 'shadow-green-500/30',
  anemo: 'shadow-teal-400/30',
  geo: 'shadow-yellow-500/30',
};

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

const iconSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-18 h-18',
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
}: TeamSlotProps) {
  const isEmpty = !character;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          'relative rounded-full flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          isEmpty
            ? 'empty-slot'
            : cn(
                'bg-gradient-to-br shadow-lg hover:shadow-xl hover:scale-105',
                ringSizes[size],
                elementGradients[character.element],
                elementGlows[character.element]
              )
        )}
      >
        {isEmpty ? (
          <Plus className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
        ) : (
          <div
            className={cn(
              'w-full h-full rounded-full overflow-hidden bg-slate-900 ring-2 ring-black/30',
              iconSizeClasses[size]
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
              className="character-fallback w-full h-full rounded-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-lg hidden"
            >
              {character.name.charAt(0)}
            </div>
          </div>
        )}
      </button>

      {/* Level Badge */}
      {!isEmpty && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-lg z-10">
          Lv.{character.level}
        </div>
      )}

      {/* Remove Button */}
      {!isEmpty && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg shadow-rose-600/30 hover:scale-110 z-20"
        >
          <X className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Hover Glow Effect for Empty Slots */}
      {isEmpty && (
        <div className="absolute inset-0 rounded-full bg-violet-500/0 group-hover:bg-violet-500/10 transition-colors duration-300 pointer-events-none" />
      )}
    </div>
  );
}
