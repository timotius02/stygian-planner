import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown, Lightbulb, Sword, Sparkles, Target, Skull, Zap } from 'lucide-react';
import type { Boss } from '@/types/boss';

interface BossInfoModalProps {
  boss: Boss | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BossInfoModal({ boss, isOpen, onClose }: BossInfoModalProps) {
  if (!boss) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[hsl(260_25%_8%)] border border-white/10 text-slate-100 shadow-2xl p-0 gap-0 overflow-hidden">
        {/* Header with Boss Info */}
        <DialogHeader className="p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-violet-600/10 to-purple-600/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              {/* Avatar Glow */}
              <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-xl" />

              <div className="relative boss-avatar-ring">
                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={boss.iconUrl}
                    alt={boss.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/bosses/placeholder.png';
                    }}
                  />
                </div>
              </div>

              {/* Level Badge */}
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-violet-600 to-purple-700 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-[hsl(260_25%_8%)] shadow-lg shadow-violet-600/30">
                Lv. {boss.level}
              </div>
            </div>

            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gradient-mystic">
                {boss.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1 text-base">
                {boss.subtitle}
              </DialogDescription>

            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Damage Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 flex items-center justify-center border border-violet-500/30">
                <Sword className="w-5 h-5 text-violet-400" />
              </div>
              Damage Recommendations
            </h4>

            {boss.recommendedDamageTypes.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </div>
                  Recommended
                </div>
                <div className="flex flex-wrap gap-2">
                  {boss.recommendedDamageTypes.map((damageType, index) => (
                    <span
                      key={`rec-${index}`}
                      className="badge-recommended"
                    >
                      {damageType.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {boss.discouragedDamageTypes.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs text-rose-400 font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </div>
                  Not Recommended
                </div>
                <div className="flex flex-wrap gap-2">
                  {boss.discouragedDamageTypes.map((damageType, index) => (
                    <span
                      key={`disc-${index}`}
                      className="badge-discouraged"
                    >
                      {damageType.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="section-divider" />

          {/* Mechanics */}
          {boss.mechanics.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-blue-500/30">
                  <Skull className="w-5 h-5 text-blue-400" />
                </div>
                Boss Mechanics
              </h4>
              <div className="space-y-3">
                {boss.mechanics.map((mechanic, index) => (
                  <div
                    key={index}
                    className="genshin-card p-4 group hover:border-blue-500/30 transition-colors"
                  >
                    <h5 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {mechanic.title}
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {mechanic.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {boss.mechanics.length > 0 && boss.tips.length > 0 && (
            <div className="section-divider" />
          )}

          {/* Tips */}
          {boss.tips.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                Strategy Tips
              </h4>
              <ul className="space-y-3">
                {boss.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-sm text-slate-400 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500/50 transition-colors">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="leading-relaxed pt-1.5">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Target className="w-4 h-4" />
            <span>Stygian Onslaught Event</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
