import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Users, Sparkles, RefreshCw, Shield, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEnkaQuery } from '@/hooks/useEnkaQuery';
import { useTeamStore } from '@/store/teamStore';
import { enkaApiService } from '@/services/enkaApi';
import { cn } from '@/lib/utils';
import type { ElementType } from '@/types';

const elementBorderColors: Record<ElementType, string> = {
  pyro: 'border-red-400/70 shadow-red-500/30',
  hydro: 'border-blue-400/70 shadow-blue-500/30',
  electro: 'border-purple-400/70 shadow-purple-500/30',
  cryo: 'border-cyan-300/70 shadow-cyan-400/30',
  dendro: 'border-green-400/70 shadow-green-500/30',
  anemo: 'border-teal-300/70 shadow-teal-400/30',
  geo: 'border-yellow-400/70 shadow-yellow-500/30',
};

const elementBgColors: Record<ElementType, string> = {
  pyro: 'bg-red-500/15',
  hydro: 'bg-blue-500/15',
  electro: 'bg-purple-500/15',
  cryo: 'bg-cyan-400/15',
  dendro: 'bg-green-500/15',
  anemo: 'bg-teal-400/15',
  geo: 'bg-yellow-500/15',
};



export function UIDInputSection() {
  const [uid, setUid] = useState('');
  const [fetchEnabled, setFetchEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const { setUID, setOwnedCharacters, currentUID, ownedCharacters, lastFetched, refreshCharacters } = useTeamStore();

  const { data, isLoading, isError, error } = useEnkaQuery(
    fetchEnabled ? uid : null
  );

  // Process Enka data when received
  useEffect(() => {
    if (data && fetchEnabled) {
      requestAnimationFrame(() => {
        setFetchEnabled(false);
        setUID(uid);

        const characters = enkaApiService.transformToOwnedCharacters(
          data.avatarInfoList
        );

        setOwnedCharacters(characters);
      });
    }
  }, [data, fetchEnabled, uid, setUID, setOwnedCharacters]);

  const handleFetch = () => {
    if (uid.trim() && uid.length >= 9) {
      setFetchEnabled(true);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError(null);
    try {
      await refreshCharacters();
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : 'Failed to refresh characters');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastFetched = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  const isValidUid = uid.trim().length >= 9;

  // Group characters by element for display
  const charactersByElement = ownedCharacters.reduce((acc, char) => {
    if (!acc[char.element]) acc[char.element] = [];
    acc[char.element].push(char);
    return acc;
  }, {} as Record<ElementType, typeof ownedCharacters>);

  const elementOrder: ElementType[] = ['pyro', 'hydro', 'electro', 'cryo', 'dendro', 'anemo', 'geo'];

  return (
    <div className="genshin-card p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-800 rounded-2xl blur-lg opacity-40" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-800/30 flex items-center justify-center border border-violet-500/40 shadow-xl">
              <Users className="w-7 h-7 text-violet-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[hsl(260_25%_12%)] shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Import Characters
            </h2>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Enter your Genshin Impact UID to load your characters from Enka Network.
              Your characters will be available for team assignments across all battlefields.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Shield className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Enter your UID (e.g., 800000000)"
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="input-genshin pl-12 h-14 text-base"
            />
            {uid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {uid.length} digits
              </div>
            )}
          </div>
          <Button
            onClick={handleFetch}
            disabled={!isValidUid || isLoading}
            className="btn-genshin h-14 px-8 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Fetch
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {isError && (
          <div className="flex items-start gap-4 text-rose-400 bg-gradient-to-r from-rose-950/40 to-rose-900/20 border border-rose-600/30 rounded-xl px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-rose-300">
                Failed to fetch character data
              </p>
              <p className="text-sm text-rose-300/70 mt-1">
                {error instanceof Error
                  ? error.message.includes('404')
                    ? 'Profile not found. Please check your UID and make sure your profile is public on Enka Network.'
                    : error.message
                  : 'An unknown error occurred'}
              </p>
            </div>
          </div>
        )}

        {currentUID && !isError && !isLoading && (
          <div className="flex items-start gap-4 text-emerald-400 bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border border-emerald-600/30 rounded-xl px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-emerald-300">
                  Successfully loaded {ownedCharacters.length} characters
                </p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-medium">
                  UID: {currentUID}
                </span>
              </div>
              <p className="text-sm text-emerald-300/70 mt-1">
                Last updated {formatLastFetched(lastFetched)}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="h-10 px-4 text-sm border-emerald-600/30 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-400"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        )}

        {/* Refresh Error Message */}
        {refreshError && (
          <div className="flex items-start gap-4 text-rose-400 bg-gradient-to-r from-rose-950/40 to-rose-900/20 border border-rose-600/30 rounded-xl px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-rose-300">
                Failed to refresh characters
              </p>
              <p className="text-sm text-rose-300/70 mt-1">
                {refreshError}
              </p>
            </div>
          </div>
        )}

        {/* Characters Grid by Element */}
        {ownedCharacters.length > 0 && (
          <div className="mt-2 space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center border border-slate-700">
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-300">
                  Your Characters
                </h3>
              </div>
              <span className="text-xs text-slate-500 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                {ownedCharacters.length} total
              </span>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {ownedCharacters.map((character, index) => (
                <div
                  key={character.id}
                  className="flex flex-col items-center gap-1.5 group animate-scale-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-lg',
                      elementBorderColors[character.element],
                      'group-hover:scale-110 group-hover:shadow-xl'
                    )}
                  >
                    <img
                      src={character.iconUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.character-fallback') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div
                      className="character-fallback w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 font-bold text-sm hidden"
                    >
                      {character.name.charAt(0)}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate w-full text-center group-hover:text-slate-300 transition-colors">
                    {character.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Element Filter Visualization */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                Characters by Element
              </p>
              <div className="flex flex-wrap gap-2">
                {elementOrder.map((element) => {
                  const count = charactersByElement[element]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <div
                      key={element}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all duration-300 hover:scale-105 cursor-default',
                        elementBgColors[element],
                        elementBorderColors[element].split(' ')[0]
                      )}
                    >
                      <span className="capitalize font-medium text-slate-200">
                        {element}
                      </span>
                      <span className="text-slate-400 bg-slate-900/50 px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
