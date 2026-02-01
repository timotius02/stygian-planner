import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, Users, Sparkles, RefreshCw, Shield, Zap, Plus, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEnkaQuery } from '@/hooks/useEnkaQuery';
import { useTeamStore } from '@/store/teamStore';
import { enkaApiService } from '@/services/enkaApi';
import { cn } from '@/lib/utils';
import type { ElementType, OwnedCharacter } from '@/types';
import { AddCharacterModal } from '@/components/character/AddCharacterModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<OwnedCharacter | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { setUID, setOwnedCharacters, currentUID, ownedCharacters, lastFetched, refreshCharacters, removeCharacter } = useTeamStore();

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
            <div className="flex items-center gap-3">
              {ownedCharacters.length > 0 && (
                <span className="text-xs text-slate-500 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                  {ownedCharacters.length} total
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="h-8 px-3 text-xs border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Add
              </Button>
            </div>
          </div>

          {ownedCharacters.length > 0 && (
            <>
              {/* Character Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {ownedCharacters.map((character, index) => {
                  return (
                    <div
                      key={character.id}
                      className="flex flex-col items-center gap-1.5 group animate-scale-in relative"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Character Icon */}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-lg relative',
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

                        {/* Hover Actions - All characters are editable and removable */}
                        <div className="absolute inset-0 bg-slate-900/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCharacter(character);
                              setIsEditModalOpen(true);
                            }}
                            className="w-6 h-6 rounded-full bg-violet-500/80 hover:bg-violet-500 flex items-center justify-center text-white transition-colors"
                            title="Edit character"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCharacter(character.id);
                            }}
                            className="w-6 h-6 rounded-full bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center text-white transition-colors"
                            title="Remove character"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Character Name */}
                      <span className="text-[10px] text-slate-500 truncate w-full text-center group-hover:text-slate-300 transition-colors">
                        {character.name}
                      </span>

                      {/* Level & Constellation */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-600">
                          Lv.{character.level}
                        </span>
                        {character.constellation > 0 && (
                          <span className="text-[9px] text-amber-400">
                            C{character.constellation}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
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
            </>
          )}
        </div>
      </div>

      {/* Add Character Modal */}
      <AddCharacterModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Character Modal */}
      <EditCharacterModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCharacter(null);
        }}
        character={editingCharacter}
      />
    </div>
  );
}

// Edit Character Modal Component
interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: OwnedCharacter | null;
}

function EditCharacterModal({ isOpen, onClose, character }: EditCharacterModalProps) {
  const { updateCharacter } = useTeamStore();
  const [level, setLevel] = useState(90);
  const [constellation, setConstellation] = useState(0);

  // Initialize form values when character changes
  const characterRef = character;
  if (characterRef && (level !== characterRef.level || constellation !== characterRef.constellation)) {
    // Only update if values are different to avoid infinite loop
    if (level === 90 && constellation === 0) {
      setLevel(characterRef.level);
      setConstellation(characterRef.constellation);
    }
  }

  const handleSave = () => {
    if (!character) return;
    updateCharacter(character.id, {
      level,
      constellation,
    });
    onClose();
  };

  if (!character) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[hsl(260_25%_8%)] border border-white/10 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gradient-mystic flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/40">
              <Pencil className="w-5 h-5 text-violet-400" />
            </div>
            Edit Character
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Character Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div
              className={cn(
                'w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg',
                elementBorderColors[character.element]
              )}
            >
              <img
                src={character.iconUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-200">{character.name}</p>
            </div>
          </div>

          {/* Level and Constellation Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Level</label>
              <Input
                type="number"
                min={1}
                max={90}
                value={level}
                onChange={(e) => setLevel(Math.min(90, Math.max(1, parseInt(e.target.value) || 1)))}
                className="input-genshin h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Constellation</label>
              <Input
                type="number"
                min={0}
                max={6}
                value={constellation}
                onChange={(e) => setConstellation(Math.min(6, Math.max(0, parseInt(e.target.value) || 0)))}
                className="input-genshin h-12 text-base"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="btn-genshin"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
