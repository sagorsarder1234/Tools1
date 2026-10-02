import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Send,
  Users,
  Image as ImageIcon,
  Circle,
  Search,
  X,
  Sparkles,
  ChevronLeft,
  CheckCheck,
  MessageSquare,
  Shield,
} from 'lucide-react';

type ChatTarget =
  | { type: 'GROUP'; id: string }
  | { type: 'DIRECT'; user: User };

export const ChatView: React.FC = () => {
  const {
    messages,
    sendMessage,
    groups,
    users,
    activeChatGroupId,
    setActiveChatGroupId,
    activeChatRecipientId,
    setActiveChatRecipientId,
    currentUser,
    setCurrentPage,
    showToast,
  } = useApp();

  // Primary community group (Community Hub)
  const primaryGroup = groups.find((g) => g.id === activeChatGroupId) || groups[0] || {
    id: 'grp_1',
    name: 'Community Hub',
    description: 'Official global communication channel for all registered platform members.',
    category: 'Official Community',
    memberCount: users.length,
    isPrivate: false,
    createdAt: '2026-01-01',
    avatarIcon: 'Users',
    isJoined: true,
  };

  // Selected chat target: Starts as null so group chat is NOT opened automatically
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(() => {
    if (activeChatRecipientId) {
      const recipientUser = users.find((u) => u.id === activeChatRecipientId);
      if (recipientUser) {
        return { type: 'DIRECT', user: recipientUser };
      }
    }
    return null;
  });

  // If activeChatRecipientId changes, auto-open that direct conversation
  useEffect(() => {
    if (activeChatRecipientId) {
      const recipientUser = users.find((u) => u.id === activeChatRecipientId);
      if (recipientUser) {
        setChatTarget({ type: 'DIRECT', user: recipientUser });
      }
      setActiveChatRecipientId(null);
    }
  }, [activeChatRecipientId, users, setActiveChatRecipientId]);

  const [inputContent, setInputContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedImageId, setExpandedImageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute active conversation messages
  const activeMessages = messages.filter((m) => {
    if (!chatTarget) return false;
    if (chatTarget.type === 'GROUP') {
      return m.groupId === chatTarget.id && !m.recipientId;
    } else {
      if (!currentUser) return false;
      const targetUserId = chatTarget.user.id;
      return (
        (m.senderId === currentUser.id && m.recipientId === targetUserId) ||
        (m.senderId === targetUserId && m.recipientId === currentUser.id)
      );
    }
  });

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (chatTarget) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages.length, selectedImage, chatTarget]);

  // Handle local image file attachment
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Upload failed', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Upload failed', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        showToast('Upload success', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Upload failed', 'error');
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  // Quick preset sample picture option (zero popup)
  const handleAttachSampleImage = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    showToast('Upload success', 'success');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatTarget) return;
    if (!inputContent.trim() && !selectedImage) return;

    if (chatTarget.type === 'GROUP') {
      sendMessage(inputContent.trim(), chatTarget.id, undefined, selectedImage || undefined);
    } else {
      sendMessage(inputContent.trim(), undefined, chatTarget.user.id, selectedImage || undefined);
    }

    setInputContent('');
    setSelectedImage(null);

    // Simulated peer typing response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1400);
    }, 450);
  };

  // Filter members list based on search
  const filteredMembers = users.filter((u) => {
    const q = searchFilter.toLowerCase();
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const isGroupActive = chatTarget?.type === 'GROUP';
  const activePartner = chatTarget?.type === 'DIRECT' ? chatTarget.user : null;

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-black/30 backdrop-blur-2xl border-t border-white/10">
      {/* LEFT COLUMN: CONVERSATION LIST (COMMUNITY GROUP AT TOP, MEMBERS BELOW) */}
      <div
        className={`lg:col-span-4 xl:col-span-3 border-r border-white/10 flex flex-col h-full bg-black/40 backdrop-blur-xl ${
          chatTarget ? 'hidden lg:flex' : 'flex'
        }`}
      >
          {/* Top navigation header for Community & Members */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-item hover:bg-white/15 text-white/90 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              title="Back to Dashboard"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-white/90">Community & Members</span>

            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="p-1.5 rounded-xl glass-item hover:bg-rose-500/20 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-3.5 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search community or members..."
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-item border border-white/10 focus:border-amber-400 focus:outline-none text-white text-xs"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-3 scrollbar-thin">
            {/* 1. PRIMARY GROUP: COMMUNITY HUB (ALWAYS AT TOP) */}
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center justify-between">
                <span>Official Group</span>
                <span className="text-amber-400 font-semibold">Auto-Joined</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setChatTarget({ type: 'GROUP', id: primaryGroup.id });
                  setActiveChatGroupId(primaryGroup.id);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                  isGroupActive
                    ? 'bg-amber-400/20 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                    : 'glass-panel-subtle hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-white/20 ${
                      isGroupActive
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-400 text-black font-bold shadow-md'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-xs font-bold truncate ${
                          isGroupActive ? 'text-amber-300' : 'text-white'
                        }`}
                      >
                        {primaryGroup.name}
                      </p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-white/50 truncate">
                      {users.length} members · Everyone auto-joins
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Group
                  </span>
                </div>
              </button>
            </div>

            {/* 2. MEMBERS LIST (DIRECTLY BELOW THE GROUP) */}
            <div className="space-y-1 pt-1">
              <div className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center justify-between">
                <span>Members</span>
                <span className="text-white/40 font-mono">{filteredMembers.length}</span>
              </div>

              <div className="space-y-1">
                {filteredMembers.map((member) => {
                  const isSelected =
                    chatTarget?.type === 'DIRECT' && chatTarget.user.id === member.id;
                  const isCurrentUser = member.id === currentUser?.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setChatTarget({ type: 'DIRECT', user: member })}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/20 border-2 border-amber-400 shadow-md'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Member Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/20 bg-black/40">
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.username}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {member.username.slice(0, 2)}
                              </div>
                            )}
                          </div>
                          {/* Online status indicator */}
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
                        </div>

                        {/* Name & Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isSelected ? 'text-amber-300 font-bold' : 'text-white'
                              }`}
                            >
                              {member.username}
                            </p>
                            {isCurrentUser && (
                              <span className="text-[9px] text-white/40 font-mono font-normal">
                                (You)
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/40 truncate capitalize">
                            {member.role === 'ADMIN' ? 'Platform Admin' : 'Active Member'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {member.role === 'ADMIN' ? (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ADMIN
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/30 font-mono">Chat</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400 animate-pulse" />
              <span className="text-[11px] text-white/70">Online Directory</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">{users.length} active</span>
          </div>
        </div>

        {/* RIGHT COLUMN: MESSENGER AREA (OR STANDBY HUB WHEN NO CONVERSATION IS OPEN) */}
        <div
          className={`lg:col-span-8 xl:col-span-9 flex flex-col h-full bg-black/20 backdrop-blur-xl ${
            !chatTarget ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {!chatTarget ? (
            /* Standby State: No chat forced open on initial visit */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-10 space-y-5">
              <div className="w-16 h-16 rounded-3xl glass-panel border border-white/20 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  Community & Members Messenger
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Select the Community Hub group or click on any member from the list to start messaging. You can send text and share pictures directly on the display.
                </p>
              </div>

              {/* Quick direct cards right on display (Zero popups) */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-5 py-2.5 rounded-full glass-panel hover:bg-white/15 text-white/90 hover:text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                  <span>Back to Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatTarget({ type: 'GROUP', id: primaryGroup.id });
                    setActiveChatGroupId(primaryGroup.id);
                  }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Open Community Hub</span>
                </button>
              </div>

              {/* Fast member chips */}
              <div className="pt-4 max-w-lg">
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2.5">
                  Direct message any member:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {users.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setChatTarget({ type: 'DIRECT', user: m })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel hover:bg-white/15 text-xs text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
                    >
                      <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 bg-black/40 ring-1 ring-white/20">
                        {m.avatarUrl ? (
                          <img src={m.avatarUrl} alt={m.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-amber-500 text-[8px] font-bold text-black flex items-center justify-center">
                            {m.username.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-[11px]">{m.username}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Conversation (Group or Direct Member) */
            <>
              {/* Header with Back button to return to conversation list */}
              <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between glass-panel-subtle">
                <div className="flex items-center gap-3">
                  {/* Back to List button */}
                  <button
                    type="button"
                    onClick={() => setChatTarget(null)}
                    className="p-1.5 rounded-xl glass-item hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
                    title="Back to conversation list"
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-400" />
                  </button>

                  {isGroupActive ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-black flex items-center justify-center font-bold shadow-md">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{primaryGroup.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Official Group
                          </span>
                        </h3>
                        <p className="text-[10px] text-white/50">
                          {users.length} members · All registered accounts included
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20 bg-black/40">
                          {activePartner?.avatarUrl ? (
                            <img
                              src={activePartner.avatarUrl}
                              alt={activePartner.username}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-xs font-bold text-white uppercase">
                              {activePartner?.username.slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{activePartner?.username}</span>
                          {activePartner?.id === currentUser?.id && (
                            <span className="text-[10px] text-white/40 font-normal">(You)</span>
                          )}
                        </h3>
                        <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Active Now · Direct Messenger</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Header Action: Close conversation back to list or Exit to Dashboard */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage('dashboard')}
                    className="px-2.5 py-1 rounded-xl glass-item hover:bg-white/15 text-white/70 hover:text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    title="Exit to Dashboard"
                  >
                    <span>Exit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatTarget(null)}
                    className="p-1.5 rounded-full glass-item hover:bg-rose-500/20 text-white/60 hover:text-white transition-colors cursor-pointer"
                    title="Close conversation back to list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messenger Messages Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
                {activeMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center text-white/30">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Start the conversation</h4>
                      <p className="text-xs text-white/50 max-w-sm mt-1">
                        {isGroupActive
                          ? 'Say hello to all members in the Community Hub! Send text or share pictures directly.'
                          : `Send a direct message or picture to @${activePartner?.username}.`}
                      </p>
                    </div>
                  </div>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const isAdmin = msg.senderRole === 'ADMIN';
                    const isExpanded = expandedImageId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Incoming sender avatar */}
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20 bg-black/40 mb-1">
                            {msg.senderAvatar ? (
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                {msg.senderName.slice(0, 2)}
                              </div>
                            )}
                          </div>
                        )}

                        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                          {/* Name / Role Header */}
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[11px] font-semibold text-white/80">
                              {isMe ? 'You' : msg.senderName}
                            </span>
                            {isAdmin && (
                              <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ADMIN
                              </span>
                            )}
                            <span className="text-[10px] text-white/40">{msg.timestamp}</span>
                          </div>

                          {/* Message Bubble (Text & Picture) */}
                          <div
                            className={`rounded-2xl overflow-hidden text-xs sm:text-sm leading-relaxed shadow-lg ${
                              isMe
                                ? 'bg-amber-400 text-black font-medium rounded-br-sm'
                                : 'glass-panel border border-white/15 text-white rounded-bl-sm'
                            }`}
                          >
                            {/* If Picture is present - In-Display toggle (Zero Popups) */}
                            {msg.imageUrl && (
                              <div className="relative overflow-hidden">
                                <img
                                  src={msg.imageUrl}
                                  alt="Shared media"
                                  onClick={() =>
                                    setExpandedImageId(isExpanded ? null : msg.id)
                                  }
                                  className={`w-full object-cover transition-all duration-300 cursor-pointer ${
                                    isExpanded ? 'max-h-[500px]' : 'max-h-64'
                                  }`}
                                  title="Click to expand/collapse image inline"
                                />
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white/90 backdrop-blur-sm pointer-events-none">
                                  {isExpanded ? 'Expanded' : 'Tap to expand'}
                                </span>
                              </div>
                            )}

                            {/* If Text content is present */}
                            {msg.content && (
                              <div className={`p-3 ${msg.imageUrl ? 'pt-2' : ''}`}>
                                {msg.content}
                              </div>
                            )}
                          </div>

                          {/* Read status check */}
                          {isMe && (
                            <div className="flex items-center gap-1 text-[10px] text-white/40 mt-0.5 px-1">
                              <CheckCheck className="w-3 h-3 text-amber-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-white/50 text-xs animate-pulse pl-10">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Typing dispatch...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* In-Display Attached Picture Preview Strip (Zero Popups) */}
              {selectedImage && (
                <div className="p-2.5 px-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-amber-400/50 relative shrink-0">
                      <img src={selectedImage} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-white">Picture attached</p>
                      <p className="text-[11px] text-white/50">Ready to send directly in chat</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-1.5 rounded-full hover:bg-rose-500/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Remove Picture"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Messenger Composer Form (ONLY Text and Picture, Zero Popups) */}
              <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  {/* Hidden File Input for Image Selection */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {/* Attach Picture Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                      selectedImage
                        ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'glass-panel hover:bg-white/15 text-white/70 hover:text-white'
                    }`}
                    title="Attach Picture"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  {/* Quick Preset Sample Picture Trigger (zero popup testing) */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAttachSampleImage(
                        '/src/assets/images/marketplace_glass_gadget_1790868090936.jpg'
                      )
                    }
                    className="hidden sm:flex px-2.5 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-semibold items-center gap-1 cursor-pointer shrink-0"
                    title="Attach Sample Picture"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Sample Pic</span>
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    placeholder={
                      selectedImage
                        ? 'Add a caption for this picture (optional)...'
                        : isGroupActive
                        ? `Message #Community Hub...`
                        : `Message @${activePartner?.username}...`
                    }
                    className="flex-1 px-4 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputContent.trim() && !selectedImage}
                    className="p-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-black font-bold transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-lg shadow-amber-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Send</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
  );
};
