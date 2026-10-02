import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Plus, Search, Copy, Check, Trash2, Tag, BookMarked, X } from 'lucide-react';

interface StoredName {
  id: string;
  name: string;
  category: string;
  notes: string;
}

interface NameStoreToolProps {
  onClose?: () => void;
}

export const NameStoreTool: React.FC<NameStoreToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [names, setNames] = useState<StoredName[]>(() => {
    const saved = localStorage.getItem('tenex_name_store');
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', name: 'TitanShield', category: 'Security Hardware', notes: 'Flagship product handle' },
          { id: '2', name: 'AlexThorne', category: 'Personal Alias', notes: 'Primary engineer handle' },
          { id: '3', name: 'ZeroK-Vault', category: 'Infrastructure', notes: 'Private cluster node' },
          { id: '4', name: 'ApexSaaS', category: 'Brand Domain', notes: 'Marketing brand reserved' },
        ];
  });

  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Brand Domain');
  const [newNotes, setNewNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('tenex_name_store', JSON.stringify(names));
  }, [names]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const item: StoredName = {
      id: Date.now().toString(),
      name: newName.trim(),
      category: newCategory,
      notes: newNotes.trim() || 'No remarks',
    };

    setNames([item, ...names]);
    setNewName('');
    setNewNotes('');
  };

  const handleDelete = (id: string) => {
    setNames(names.filter((n) => n.id !== id));
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const filteredNames = names.filter(
    (n) =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Name & Handle Vault</h2>
          <p className="text-xs text-white/50">Store, categorize, and recall brand names, server hostnames, and aliases.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vault..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Add Form */}
        <div className="lg:col-span-4">
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Save New Handle</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Name / Handle</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. CyberVortex"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs bg-[#11121a]"
                >
                  <option value="Brand Domain">Brand Domain</option>
                  <option value="Personal Alias">Personal Alias</option>
                  <option value="Security Hardware">Security Hardware</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Gaming & VR">Gaming & VR</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Optional Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. DNS reserved on Cloudflare"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 shadow transition-all active:scale-95"
              >
                Store in Vault
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right: Stored Names Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredNames.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white font-mono">{item.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/70">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 mt-1">{item.notes}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(item.id, item.name)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-white/30 hover:text-rose-400 p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredNames.length === 0 && (
            <div className="p-8 text-center glass-panel rounded-2xl text-xs text-white/50">
              No matching names found in vault.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
