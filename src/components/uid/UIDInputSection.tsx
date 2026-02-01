import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Users, Sparkles, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEnkaQuery } from '@/hooks/useEnkaQuery';
import { useTeamStore } from '@/store/teamStore';
import { enkaApiService } from '@/services/enkaApi';
import { cn } from '@/lib/utils';
import type { ElementType } from '@/types';

const elementBorderColors: Record<ElementType, string> = {
  pyro: 'border-red-400/70 shadow-red-500/20',
  hydro: 'border-blue-400/70 shadow-blue-500/20',
  electro: 'border-purple-400/70 shadow-purple-500/20',
  cryo: 'border-cyan-300/70 shadow-cyan-400/20',
  dendro: 'border-green-400/70 shadow-green-500/20',
  anemo: 'border-teal-300/70 shadow-teal-400/20',
  geo: 'border-yellow-400/70 shadow-yellow-500/20',
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

export function UIDInputSection() {
  const [uid, setUid] = useState('');
  const [fetchEnabled, setFetchEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const { setUID, setOwnedCharacters, currentUID, ownedCharacters, lastFetched, refreshCharacters } = useTeamStore();

  const { data, isLoading, isError, error } = useEnkaQuery(
    fetchEnabled ? uid : null
  );

  // Process Enka data when received - using useEffect to avoid hook issues
  useEffect(() => {
    if (data && fetchEnabled) {
      // Use requestAnimationFrame to avoid synchronous setState warning
      requestAnimationFrame(() => {
        setFetchEnabled(false);
        setUID(uid);

        // Transform Enka characters to OwnedCharacter format using the service
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

  // Format the last fetched time
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
    <div className="genshin-card p-6">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-800/20 flex items-center justify-center border border-violet-500/30">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              Import Characters
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-sm text-slate-400">
              Enter your Genshin Impact UID to load your characters from Enka Network
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Enter your UID (e.g., 800000000)"
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="input-genshin h-12 text-base"
            />
          </div>
          <Button
            onClick={handleFetch}
            disabled={!isValidUid || isLoading}
            className="btn-genshin h-12 px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Fetch
              </>
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {isError && (
          <div className="flex items-center gap-3 text-rose-400 bg-rose-950/30 border border-rose-600/30 rounded-xl px-4 py-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Failed to fetch character data
              </p>
              <p className="text-xs text-rose-300/70 mt-0.5">
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
          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-950/30 border border-emerald-600/30 rounded-xl px-4 py-4">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Successfully loaded {ownedCharacters.length} characters
              </p>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                UID: {currentUID} • Updated {formatLastFetched(lastFetched)}
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-emerald-600/30 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-400"
            >
              {isRefreshing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span className="ml-1.5">Refresh</span>
            </Button>
          </div>
        )}

        {/* Refresh Error Message */}
        {refreshError && (
          <div className="flex items-center gap-3 text-rose-400 bg-rose-950/30 border border-rose-600/30 rounded-xl px-4 py-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Failed to refresh characters
              </p>
              <p className="text-xs text-rose-300/70 mt-0.5">
                {refreshError}
              </p>
            </div>
          </div>
        )}

        {/* Characters Grid by Element */}
        {ownedCharacters.length > 0 && (
          <div className="mt-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">
                Your Characters
              </h3>
              <span className="text-xs text-slate-500">
                {ownedCharacters.length} total
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {ownedCharacters.map((character) => (
                <div
                  key={character.id}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={cn(
                      'w-11 h-11 rounded-full overflow-hidden border-2 transition-all duration-200 shadow-lg',
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
                        // Show a fallback with the character's initial
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
                  <span className="text-[10px] text-slate-400 truncate w-full text-center group-hover:text-slate-300 transition-colors">
                    {character.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Element Filter Visualization */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 mb-3">Characters by Element</p>
              <div className="flex flex-wrap gap-2">
                {elementOrder.map((element) => {
                  const count = charactersByElement[element]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <div
                      key={element}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs',
                        elementBgColors[element],
                        elementBorderColors[element].split(' ')[0]
                      )}
                    >
                      <span className="capitalize font-medium text-slate-200">
                        {element}
                      </span>
                      <span className="text-slate-400">{count}</span>
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
