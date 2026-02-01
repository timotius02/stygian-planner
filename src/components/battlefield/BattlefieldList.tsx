import { BattlefieldCard } from './BattlefieldCard';
import { BOSSES } from '@/data/bosses';
import { Swords, Trophy, Target } from 'lucide-react';

export function BattlefieldList() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl blur-lg opacity-40" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-purple-800/30 flex items-center justify-center border border-violet-500/40">
              <Trophy className="w-6 h-6 text-violet-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Battlefields</h2>
            <p className="text-sm text-slate-400">
              {BOSSES.length} bosses awaiting your challenge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">
              <span className="font-semibold text-amber-400">3</span> Stages
            </span>
          </div>
        </div>
      </div>

      {/* Battlefield Cards */}
      <div className="space-y-5">
        {BOSSES.map((boss, index) => (
          <div
            key={boss.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BattlefieldCard
              boss={boss}
              battlefieldNumber={index + 1}
            />
          </div>
        ))}
      </div>

      {/* Strategy Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Swords, title: 'Balance Elements', desc: 'Distribute elements across teams' },
          { icon: Target, title: 'Check Weaknesses', desc: 'Review boss recommendations' },
          { icon: Trophy, title: 'Optimize Timing', desc: 'Complete within time limits' },
        ].map((tip) => (
          <div
            key={tip.title}
            className="p-4 rounded-xl bg-slate-800/30 border border-white/5 flex items-center gap-3 hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <tip.icon className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h5 className="text-sm font-medium text-slate-200">{tip.title}</h5>
              <p className="text-xs text-slate-500">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
