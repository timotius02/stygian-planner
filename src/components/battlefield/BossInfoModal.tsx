import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ThumbsUp, ThumbsDown, Info, Lightbulb, Sword, Clock, Shield, Sparkles } from 'lucide-react';
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
      <DialogContent className="max-w-2xl bg-[hsl(260_30%_8%)] border border-white/10 text-slate-100 shadow-2xl">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="boss-avatar-ring">
                <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
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
              <div className="absolute -bottom-1 -right-1 bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-full border-2 border-[hsl(260_30%_8%)] shadow-lg">
                Lv. {boss.level}
              </div>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gradient-mystic">
                {boss.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                {boss.subtitle}
              </DialogDescription>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold text-sm">
                    Battle Time: {boss.battleTime}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Damage Types */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                <Sword className="w-4 h-4 text-violet-400" />
              </div>
              Damage Recommendations
            </h4>

            {boss.recommendedDamageTypes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Recommended
                </p>
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
              <div className="space-y-2">
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Not Recommended
                </p>
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

          {/* Mechanics */}
          {boss.mechanics.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                Boss Mechanics
              </h4>
              <div className="space-y-3">
                {boss.mechanics.map((mechanic, index) => (
                  <div
                    key={index}
                    className="genshin-card p-4"
                  >
                    <h5 className="font-semibold text-violet-300 mb-1.5 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
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

          {/* Tips */}
          {boss.tips.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                </div>
                Strategy Tips
              </h4>
              <ul className="space-y-2">
                {boss.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-400"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
