import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import {
  Users,
  Search,
  Plus,
  Shield,
  MessageSquare,
  Lock,
  Globe,
  UserCheck,
  UserPlus,
  X,
} from 'lucide-react';

export const GroupsView: React.FC = () => {
  const { groups, joinOrLeaveGroup, createGroup, setCurrentPage, setActiveChatGroupId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Technology');
  const [isPrivate, setIsPrivate] = useState(false);

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    createGroup(newGroupName.trim(), newGroupDesc.trim(), newGroupCategory, isPrivate);
    setCreateModalOpen(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handleOpenChat = (groupId: string) => {
    setActiveChatGroupId(groupId);
    setCurrentPage('chat');
  };

  return (
    <div className="space-y-7 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Syndicates & Groups
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Join domain-specific operational groups, trade insights, and collaborate in real-time.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-white hover:bg-white/95 text-black font-semibold text-xs shadow-xl transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups by name or topic..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass-panel border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm"
        />
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5 pointer-events-none" />
      </div>

      {/* GROUPS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="p-6 rounded-3xl glass-panel border border-white/15 flex flex-col justify-between space-y-4 hover:border-white/25 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>{group.name}</span>
                      {group.isPrivate ? (
                        <Lock className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-white/40" />
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                      <span>{group.category}</span>
                      <span>·</span>
                      <span>{group.memberCount} members</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    group.isJoined
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {group.isJoined ? 'Member' : 'Public'}
                </span>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => joinOrLeaveGroup(group.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  group.isJoined
                    ? 'glass-panel text-white/70 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                {group.isJoined ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Leave</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Group</span>
                  </>
                )}
              </button>

              {group.isJoined && (
                <button
                  onClick={() => handleOpenChat(group.id)}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enter Chat</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE GROUP MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-xl font-bold font-display text-white">Create New Syndicate</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Distributed Security Mesh"
                  className="w-full px-4 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="State the focus and objectives of this group..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Category</label>
                  <select
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs bg-[#11121a]"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Security">Security</option>
                    <option value="Finance">Finance</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 py-2.5">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
                    />
                    <span>Private Syndicate</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-full glass-panel text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
