import { BattlefieldCard } from './BattlefieldCard';
import { BOSSES } from '@/data/bosses';

export function BattlefieldList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-200">Party Setup</h2>
        <p className="text-sm text-slate-400">Drag to adjust the order</p>
      </div>

      <div className="space-y-4">
        {BOSSES.map((boss, index) => (
          <BattlefieldCard
            key={boss.id}
            boss={boss}
            battlefieldNumber={index + 1}
          />
        ))}
      </div>

      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <p className="text-xs text-slate-400 flex items-start gap-2">
          <span className="text-violet-400 mt-0.5">✦</span>
          For battlefields with existing records, your challenge record will be reset after adjusting your party lineup.
        </p>
      </div>
    </div>
  );
}
