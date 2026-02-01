import './App.css';
import { BattlefieldList } from '@/components/battlefield/BattlefieldList';
import { UIDInputSection } from '@/components/uid/UIDInputSection';
import { Sparkles, Github, Heart, Sword } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[hsl(260_35%_8%_/_0.8)] backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-lg shadow-violet-900/30">
                  <Sword className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse-glow" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-gold tracking-wide">
                  Stygian Onslaught Planner
                </h1>
                <p className="text-xs text-slate-400">
                  Genshin Impact Team Builder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Plan your victory</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-2 py-4">
          <h2 className="text-2xl font-semibold text-slate-200">
            Plan Your <span className="text-gradient-mystic">Stygian Onslaught</span> Teams
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Import your characters from Enka Network and strategically assign them to each battlefield.
            Optimize your team composition for maximum efficiency.
          </p>
        </section>

        <UIDInputSection />

        {/* Section Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/20 to-purple-800/20 flex items-center justify-center border border-violet-500/20">
              <Sword className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-200">Party Setup</h2>
          </div>
          <p className="text-sm text-slate-500">
            Click slots to assign characters
          </p>
        </div>

        <BattlefieldList />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[hsl(260_35%_8%_/_0.5)] mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>for Genshin Impact players</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Data provided by</span>
              <a
                href="https://enka.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                Enka Network
              </a>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-center text-xs text-slate-600">
            <p>
              Stygian Onslaught Planner is not affiliated with HoYoverse.
              Genshin Impact and all related assets are trademarks of HoYoverse.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
