import './App.css';
import { BattlefieldList } from '@/components/battlefield/BattlefieldList';
import { Sparkles, Github, Heart, Sword, Shield, Flame } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-800 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-violet-800 flex items-center justify-center shadow-2xl">
                  <Sword className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-pulse-glow glow-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-gold tracking-wide">
                  Stygian Onslaught Planner
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  Genshin Impact Team Builder
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-slate-300">Plan your victory</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/50 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border-violet-500/30 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Stygian Onslaught Event</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            Plan Your <span className="text-gradient-mystic">Battle Teams</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Select any characters from the full roster and strategically assign them to each battlefield.
            Optimize your team composition for maximum efficiency against powerful bosses.
          </p>
        </section>

        {/* Battlefield List */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <BattlefieldList />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 glass mt-auto relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>for Genshin Impact players</span>
            </div>
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
