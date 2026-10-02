import React, { useState, useRef } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Target,
  User as UserIcon,
  DollarSign,
  HelpCircle,
  X,
  ChevronDown,
  Send,
  Share2,
  BarChart2,
  Plus,
  Loader2,
} from 'lucide-react';

// Reusable Line-Numbered Textarea/Output Component
interface LineNumberedBoxProps {
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  borderColorClass?: string;
  heightClass?: string;
}

const LineNumberedBox: React.FC<LineNumberedBoxProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder = '',
  rows = 6,
  borderColorClass = 'focus-within:border-white/40',
  heightClass = 'h-36',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lines = value ? value.split('\n') : [''];
  const totalLines = Math.max(1, lines.length);
  const lineNumbers = Array.from({ length: totalLines }, (_, i) => i + 1);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div
      className={`w-full rounded-xl glass-item border border-white/15 ${borderColorClass} flex overflow-hidden ${heightClass} transition-colors`}
    >
      {/* Line Numbers Gutter (1, 2, 3...) */}
      <div
        ref={gutterRef}
        className="w-8 sm:w-9 shrink-0 py-2.5 pr-2 pl-1 select-none font-mono text-[11px] leading-[20px] text-white/35 text-right bg-black/25 border-r border-white/10 overflow-hidden"
      >
        {lineNumbers.map((num) => (
          <div key={num} className="h-[20px]">
            {num}
          </div>
        ))}
      </div>

      {/* Synchronized Text Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={handleScroll}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={rows}
        className="w-full py-2.5 px-3 bg-transparent text-white font-mono text-xs leading-[20px] resize-none focus:outline-none scrollbar-thin overflow-y-auto whitespace-pre"
        wrap="off"
      />
    </div>
  );
};

interface ReportDetails {
  createdTo: string;
  totalEmailsCount: number;
  goodEmailsCount: number;
  reportEmailsCount: number;
  unknownEmailsCount: number;
  pricePerUnit: number;
  finalAmount: number;
  mainBalance: number;
  reportCreatedBy: string;
  selectedMemberName: string;
  goodList: string[];
  reportList: string[];
  unknownList: string[];
}

interface ReportCheckerToolProps {
  onClose?: () => void;
}

export const ReportCheckerTool: React.FC<ReportCheckerToolProps> = ({ onClose }) => {
  const {
    currentUser,
    users,
    showToast,
    sendMessage,
    setCurrentPage,
    setActiveChatRecipientId,
    adjustUserBalance,
  } = useApp();

  // Selected Member & Set Price
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    users.find((u) => u.username.toLowerCase() === 'sagor')?.id || users[0]?.id || currentUser?.id || 'usr_1'
  );
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState<boolean>(false);
  const [priceInput, setPriceInput] = useState<string>('');

  // Three Sequential Input Boxes
  const [totalEmailsInput, setTotalEmailsInput] = useState<string>('');
  const [reportEmailsInput, setReportEmailsInput] = useState<string>('');
  const [targetEmailsInput, setTargetEmailsInput] = useState<string>('');

  // Hide / Show content toggles (Collapses box into a narrow slim ribbon)
  const [hideTotalEmail, setHideTotalEmail] = useState<boolean>(false);
  const [hideReportEmail, setHideReportEmail] = useState<boolean>(false);
  const [hideTargetEmail, setHideTargetEmail] = useState<boolean>(false);

  // Execution & UI state
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [viewReportInApp, setViewReportInApp] = useState<boolean>(false);
  const [isAddedToMainBalance, setIsAddedToMainBalance] = useState<boolean>(false);

  // Active Output Tab: 'good' | 'report' | 'unknown'
  const [activeOutputTab, setActiveOutputTab] = useState<'good' | 'report' | 'unknown'>('good');

  // Output Lists
  const [goodEmails, setGoodEmails] = useState<string[]>([]);
  const [flaggedEmails, setFlaggedEmails] = useState<string[]>([]);
  const [unknownEmails, setUnknownEmails] = useState<string[]>([]);

  // Generated Report Data
  const [reportData, setReportData] = useState<ReportDetails | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isCopyingImage, setIsCopyingImage] = useState<boolean>(false);
  const [isSharingImage, setIsSharingImage] = useState<boolean>(false);
  const [isSendingImage, setIsSendingImage] = useState<boolean>(false);
  const reportCardRef = useRef<HTMLDivElement>(null);

  // Strict email regex matcher
  const EMAIL_PATTERN = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

  // Helper to extract email lines while preserving full string (with password/metadata)
  const parseEmailRecords = (rawText: string): { cleanEmail: string; rawLine: string }[] => {
    if (!rawText.trim()) return [];
    const lines = rawText.split('\n');
    const records: { cleanEmail: string; rawLine: string }[] = [];
    const seen = new Set<string>();

    for (const raw of lines) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const match = trimmed.match(EMAIL_PATTERN);
      if (match) {
        const cleanEmail = match[1].toLowerCase();
        if (!seen.has(cleanEmail)) {
          seen.add(cleanEmail);
          records.push({
            cleanEmail,
            rawLine: trimmed,
          });
        }
      }
    }
    return records;
  };

  // Helper to format date as: 2 Oct 2026,  3:09 am
  const getFormattedDateTime = (): string => {
    const now = new Date();
    const day = now.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    return `${day} ${month} ${year},  ${timeStr}`;
  };

  // Build report calculation:
  // - Compare strictly by example@domain.com (ignoring password/text for matching)
  // - Output retains full line (with password)
  // - Target email matching Total & Report -> Report / Bad
  // - Target email matching Total & NOT Report -> Good
  // - Target email NOT matching Total -> Unknown
  // - Final Amount is Good Emails multiplied by Price!
  const computeReport = (
    totalText: string,
    reportText: string,
    targetText: string
  ): ReportDetails => {
    const totalRecords = parseEmailRecords(totalText);
    const reportRecords = parseEmailRecords(reportText);
    const targetRecords = parseEmailRecords(targetText);

    const totalEmailSet = new Set(totalRecords.map((r) => r.cleanEmail));
    const reportEmailSet = new Set(reportRecords.map((r) => r.cleanEmail));

    const lineLookup = new Map<string, string>();
    for (const item of targetRecords) {
      lineLookup.set(item.cleanEmail, item.rawLine);
    }
    for (const item of totalRecords) {
      if (!lineLookup.has(item.cleanEmail)) {
        lineLookup.set(item.cleanEmail, item.rawLine);
      }
    }

    const getLineWithPassword = (email: string) => lineLookup.get(email) || email;

    const goodList: string[] = [];
    const reportList: string[] = [];
    const unknownList: string[] = [];

    if (targetRecords.length > 0) {
      for (const t of targetRecords) {
        const email = t.cleanEmail;
        const line = t.rawLine;
        if (!totalEmailSet.has(email)) {
          unknownList.push(line);
        } else if (reportEmailSet.has(email)) {
          reportList.push(line);
        } else {
          goodList.push(line);
        }
      }
    } else {
      for (const rec of totalRecords) {
        const email = rec.cleanEmail;
        const line = getLineWithPassword(email);
        if (reportEmailSet.has(email)) {
          reportList.push(line);
        } else {
          goodList.push(line);
        }
      }
    }

    const parsedPrice = parseFloat(priceInput) || 0;
    // Final Amount is specifically Good Emails * Price!
    const finalAmount = goodList.length * parsedPrice;
    const currentMember = users.find((u) => u.id === selectedMemberId);
    const currentBalance = currentMember ? currentMember.balance : 0;
    const selectedMember = users.find((u) => u.id === selectedMemberId);

    return {
      createdTo: getFormattedDateTime(),
      totalEmailsCount: totalRecords.length,
      goodEmailsCount: goodList.length,
      reportEmailsCount: reportList.length,
      unknownEmailsCount: unknownList.length,
      pricePerUnit: parsedPrice,
      finalAmount: finalAmount,
      mainBalance: currentBalance,
      reportCreatedBy: currentUser?.username || 'sagor',
      selectedMemberName: selectedMember
        ? `${selectedMember.username} (${selectedMember.email})`
        : 'System Syndicate',
      goodList,
      reportList,
      unknownList,
    };
  };

  // The Check execution
  const handleCheck = () => {
    setIsChecking(true);

    setTimeout(() => {
      const details = computeReport(totalEmailsInput, reportEmailsInput, targetEmailsInput);

      setGoodEmails(details.goodList);
      setFlaggedEmails(details.reportList);
      setUnknownEmails(details.unknownList);
      setReportData(details);
      setIsAddedToMainBalance(false);

      setIsChecking(false);
      setHasChecked(true);
      showToast('Check completed successfully!', 'success');
    }, 600);
  };

  // Opens the in-app bottom page
  const handleOpenReport = () => {
    const details = computeReport(totalEmailsInput, reportEmailsInput, targetEmailsInput);
    setReportData(details);
    setViewReportInApp(true);
  };

  // Copy list helper
  const handleCopyList = async (list: string[], key: string) => {
    if (list.length === 0) {
      showToast('Nothing to copy', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(list.join('\n'));
      setCopiedSection(key);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopiedSection(null), 1800);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const selectedMember = users.find((u) => u.id === selectedMemberId) || users[0];

  const handleAddToMainBalance = () => {
    if (!reportData || !selectedMember || isAddedToMainBalance) return;
    adjustUserBalance(
      selectedMember.id,
      reportData.finalAmount,
      `Audit verification credit (${reportData.goodEmailsCount} good emails)`
    );
    setIsAddedToMainBalance(true);
    showToast(
      `Tk ${reportData.finalAmount.toFixed(2)} added to @${selectedMember.username}'s Main Balance!`,
      'success'
    );
  };

  const getCaptureOptions = () => ({
    pixelRatio: 2,
    backgroundColor: '#0c0f17',
    skipFonts: true,
    cacheBust: true,
    filter: (element: HTMLElement) => {
      if (element instanceof HTMLElement && element.dataset.skipCapture === 'true') {
        return false;
      }
      return true;
    },
  });

  const copyReportImage = async () => {
    if (!reportCardRef.current || !reportData) return;
    setIsCopyingImage(true);
    try {
      const node = reportCardRef.current;
      const captureOptions = getCaptureOptions();
      const blob = await toBlob(node, captureOptions);

      if (!blob) {
        throw new Error('Blob generation failed');
      }

      let copiedDirectly = false;
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          copiedDirectly = true;
          showToast('Report image copied to clipboard!', 'success');
        } catch (clipErr) {
          console.warn('Clipboard write permission restricted, downloading image as fallback:', clipErr);
        }
      }

      if (!copiedDirectly) {
        const dataUrl = await toPng(node, captureOptions);
        const link = document.createElement('a');
        link.download = `report-${selectedMember?.username || 'overview'}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        showToast('Report image saved to your device!', 'success');
      }
    } catch (err) {
      console.error('Failed to copy report image:', err);
      showToast('Could not copy report image. Try again.', 'error');
    } finally {
      setIsCopyingImage(false);
    }
  };

  const handleShareReport = async () => {
    if (!reportCardRef.current || !reportData || !selectedMember) return;
    setIsSharingImage(true);
    try {
      const node = reportCardRef.current;
      const captureOptions = getCaptureOptions();
      const blob = await toBlob(node, captureOptions);

      if (!blob) {
        throw new Error('Image blob generation failed');
      }

      const fileName = `exclusive-report-${selectedMember.username}-${Date.now()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // If browser supports sharing files natively via Web Share API
      if (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: `Exclusive Report - @${selectedMember.username}`,
            files: [file],
          });
          showToast('Report image shared!', 'success');
          return;
        } catch (shareErr: unknown) {
          if (shareErr instanceof DOMException && shareErr.name === 'AbortError') {
            return;
          }
          console.warn('Native share file failed, falling back:', shareErr);
        }
      }

      // Fallback: Copy image to clipboard
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          showToast('Report image copied to clipboard for sharing!', 'success');
          return;
        } catch {
          // Fallback to downloading image file
        }
      }

      // Fallback: Download file directly
      const dataUrl = await toPng(node, captureOptions);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      showToast('Report image downloaded to share!', 'success');
    } catch (err) {
      console.error('Failed to share report image:', err);
      showToast('Could not share report image. Try again.', 'error');
    } finally {
      setIsSharingImage(false);
    }
  };

  const handleSendToSeller = async () => {
    if (!reportCardRef.current || !reportData || !selectedMember) return;
    setIsSendingImage(true);
    try {
      const node = reportCardRef.current;
      const captureOptions = getCaptureOptions();
      const dataUrl = await toPng(node, captureOptions);

      if (!dataUrl) {
        throw new Error('Failed to generate image data URL');
      }

      // Send the report image directly into selected seller's chat
      sendMessage('', undefined, selectedMember.id, dataUrl);
      setActiveChatRecipientId(selectedMember.id);
      showToast(`Report image sent to @${selectedMember.username}'s message box!`, 'success');
    } catch (err) {
      console.error('Failed to send report image:', err);
      showToast('Could not send report image. Please try again.', 'error');
    } finally {
      setIsSendingImage(false);
    }
  };

  const liveTotalCount = parseEmailRecords(totalEmailsInput).length;
  const liveReportCount = parseEmailRecords(reportEmailsInput).length;
  const liveTargetCount = parseEmailRecords(targetEmailsInput).length;

  return (
    <div className="space-y-4 pb-12">
      {/* Title & Right-Aligned Controls: Price & Member Dropdown (Compact & Equal Width) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-violet-400" />
            <span>Report Checker</span>
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Audit verification system with compact metrics and in-app executive overview.
          </p>
        </div>

        {/* Right-Aligned Controls: Price on top, Member placed below Price (Compact & Equal Width: w-36 sm:w-44) */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 self-start sm:self-auto">
          {/* Price Box - Compact Equal Width with Tk (Taka) */}
          <div className="w-36 sm:w-44 h-8 sm:h-9 flex items-center justify-between px-3 rounded-xl glass-panel border border-white/20 text-xs shadow-sm">
            <span className="text-white/70 text-xs font-semibold">Price:</span>
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-bold text-xs font-mono">Tk</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={priceInput}
                onChange={(e) => {
                  setPriceInput(e.target.value);
                  setHasChecked(false);
                  setIsAddedToMainBalance(false);
                }}
                placeholder="0.00"
                className="w-14 bg-transparent text-right text-white font-mono font-bold text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Select Member Button - Compact Equal Width */}
          <div className="relative w-36 sm:w-44">
            <button
              type="button"
              onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
              className="w-full h-8 sm:h-9 flex items-center justify-between px-3 rounded-xl glass-panel border border-white/20 hover:border-amber-400/50 text-xs shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 ring-1 ring-white/30 bg-black/40">
                  {selectedMember?.avatarUrl ? (
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.username}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                      {selectedMember?.username.slice(0, 2)}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-white truncate text-xs">
                  {selectedMember?.username || 'Select Member'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/50 shrink-0 transition-transform ${
                  isMemberDropdownOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu - Safely bounded inside display, prevents overflowing off-screen */}
            {isMemberDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={() => setIsMemberDropdownOpen(false)}
                />
                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-48 sm:w-56 max-w-[calc(100vw-2rem)] rounded-2xl glass-panel border border-white/25 shadow-2xl p-2 z-50 backdrop-blur-2xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 max-h-60 overflow-y-auto">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                    Select Member
                  </div>
                  {users.map((u) => {
                    const isSelected = u.id === selectedMemberId;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(u.id);
                          setIsMemberDropdownOpen(false);
                          setHasChecked(false);
                          setIsAddedToMainBalance(false);
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40'
                            : 'hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20 bg-black/40">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.username}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                              {u.username.slice(0, 2)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{u.username}</div>
                          <div className="text-[10px] text-white/40 truncate capitalize">
                            Tk {u.balance.toFixed(2)}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* THREE SEQUENTIAL INPUT BOXES (1. TOTAL EMAIL, 2. REPORT EMAIL, 3. TARGET EMAIL) */}
      <div className="space-y-3">
        {/* INPUT BOX 1: TOTAL EMAIL */}
        <GlassCard className="space-y-2 p-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Total Email</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  {liveTotalCount}
                </span>

                {/* Action option: Hide & Clear */}
                <button
                  type="button"
                  onClick={() => setHideTotalEmail(!hideTotalEmail)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    hideTotalEmail
                      ? 'bg-amber-400 text-black font-bold'
                      : 'glass-item hover:bg-white/15 text-white/70 hover:text-white'
                  }`}
                  title={hideTotalEmail ? 'Expand box' : 'Hide / Collapse box'}
                >
                  {hideTotalEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{hideTotalEmail ? 'Expand' : 'Hide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTotalEmailsInput('');
                    setHasChecked(false);
                  }}
                  className="px-2 py-0.5 rounded-lg glass-item hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear Total Email"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Input Box with Line Numbers 1, 2, 3... */}
            {!hideTotalEmail && (
              <LineNumberedBox
                value={totalEmailsInput}
                onChange={(val) => {
                  setTotalEmailsInput(val);
                  setHasChecked(false);
                }}
                placeholder="guiltyfullfull519@gmail.com&#9;turne9-juxdob-niRpex&#10;janethung8@gmail.com&#9;dakdUp-fojqoc-6ryvru&#10;..."
                borderColorClass="focus-within:border-sky-400"
                heightClass="h-36"
              />
            )}
          </div>
        </GlassCard>

        {/* INPUT BOX 2: REPORT EMAIL */}
        <GlassCard className="space-y-2 p-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Report Email</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  {liveReportCount}
                </span>

                {/* Action option: Hide & Clear */}
                <button
                  type="button"
                  onClick={() => setHideReportEmail(!hideReportEmail)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    hideReportEmail
                      ? 'bg-amber-400 text-black font-bold'
                      : 'glass-item hover:bg-white/15 text-white/70 hover:text-white'
                  }`}
                  title={hideReportEmail ? 'Expand box' : 'Hide / Collapse box'}
                >
                  {hideReportEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{hideReportEmail ? 'Expand' : 'Hide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReportEmailsInput('');
                    setHasChecked(false);
                  }}
                  className="px-2 py-0.5 rounded-lg glass-item hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear Report Email"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Input Box with Line Numbers 1, 2, 3... */}
            {!hideReportEmail && (
              <LineNumberedBox
                value={reportEmailsInput}
                onChange={(val) => {
                  setReportEmailsInput(val);
                  setHasChecked(false);
                }}
                placeholder="janethung8@gmail.com&#10;badaccount@domain.com&#10;..."
                borderColorClass="focus-within:border-rose-400"
                heightClass="h-36"
              />
            )}
          </div>
        </GlassCard>

        {/* INPUT BOX 3: TARGET EMAIL */}
        <GlassCard className="space-y-2 p-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Target Email</span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {liveTargetCount}
                </span>

                {/* Action option: Hide & Clear */}
                <button
                  type="button"
                  onClick={() => setHideTargetEmail(!hideTargetEmail)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    hideTargetEmail
                      ? 'bg-amber-400 text-black font-bold'
                      : 'glass-item hover:bg-white/15 text-white/70 hover:text-white'
                  }`}
                  title={hideTargetEmail ? 'Expand box' : 'Hide / Collapse box'}
                >
                  {hideTargetEmail ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{hideTargetEmail ? 'Expand' : 'Hide'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetEmailsInput('');
                    setHasChecked(false);
                  }}
                  className="px-2 py-0.5 rounded-lg glass-item hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Clear Target Email"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Input Box with Line Numbers 1, 2, 3... */}
            {!hideTargetEmail && (
              <LineNumberedBox
                value={targetEmailsInput}
                onChange={(val) => {
                  setTargetEmailsInput(val);
                  setHasChecked(false);
                }}
                placeholder="guiltyfullfull519@gmail.com&#9;turne9-juxdob-niRpex&#10;janethung8@gmail.com&#9;dakdUp-fojqoc-6ryvru&#10;..."
                borderColorClass="focus-within:border-amber-400"
                heightClass="h-36"
              />
            )}
          </div>
        </GlassCard>
      </div>

      {/* CHECK & VIEW REPORT ACTION ROW */}
      <div className="flex items-center justify-center gap-3 pt-1 pb-1">
        {/* Check Button */}
        <button
          type="button"
          onClick={handleCheck}
          disabled={isChecking}
          className="px-8 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-black font-display font-bold text-xs sm:text-sm hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isChecking ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Check</span>
            </>
          )}
        </button>

        {/* View Report Option (ONLY appears after Check is clicked) */}
        {hasChecked && (
          <button
            type="button"
            onClick={handleOpenReport}
            className="px-8 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs sm:text-sm border border-white/25 hover:border-amber-400 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 group cursor-pointer animate-in fade-in slide-in-from-left-2 duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="text-amber-300">View Report</span>
          </button>
        )}
      </div>

      {/* OUTPUT SECTION: TABS & CHART & ACTIVE BOX */}
      {/* Format: Good (..) | Report (..) | Unknown (..) -> Chart -> Selected List */}
      <div className="space-y-2.5 pt-1">
        {/* Tab Controls */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl glass-panel border border-white/15 bg-white/[0.02]">
            {/* Good Tab */}
            <button
              type="button"
              onClick={() => setActiveOutputTab('good')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeOutputTab === 'good'
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Good ({goodEmails.length})</span>
            </button>

            <span className="text-white/20 select-none">|</span>

            {/* Report Tab */}
            <button
              type="button"
              onClick={() => setActiveOutputTab('report')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeOutputTab === 'report'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report ({flaggedEmails.length})</span>
            </button>

            <span className="text-white/20 select-none">|</span>

            {/* Unknown Tab */}
            <button
              type="button"
              onClick={() => setActiveOutputTab('unknown')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeOutputTab === 'unknown'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unknown ({unknownEmails.length})</span>
            </button>
          </div>

          {hasChecked && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>Check Finished</span>
            </span>
          )}
        </div>

        {/* Selected Category Chart & Output Box */}
        {(() => {
          const totalChecked = Math.max(1, goodEmails.length + flaggedEmails.length + unknownEmails.length);
          const activeList =
            activeOutputTab === 'good'
              ? goodEmails
              : activeOutputTab === 'report'
              ? flaggedEmails
              : unknownEmails;
          const activeCount = activeList.length;
          const activePct = Math.round((activeCount / totalChecked) * 100);

          const theme =
            activeOutputTab === 'good'
              ? {
                  title: 'Good Email',
                  icon: CheckCircle2,
                  textColor: 'text-emerald-400',
                  bgBar: 'bg-emerald-500',
                  borderColor: 'border-emerald-500/30',
                  focusBorder: 'focus-within:border-emerald-400',
                  hoverBg: 'hover:bg-emerald-500/20',
                  hoverText: 'hover:text-emerald-300',
                  placeholder: 'Good emails will appear here after clicking Check...',
                }
              : activeOutputTab === 'report'
              ? {
                  title: 'Report Email',
                  icon: AlertTriangle,
                  textColor: 'text-rose-400',
                  bgBar: 'bg-rose-500',
                  borderColor: 'border-rose-500/30',
                  focusBorder: 'focus-within:border-rose-400',
                  hoverBg: 'hover:bg-rose-500/20',
                  hoverText: 'hover:text-rose-300',
                  placeholder: 'Reported / bad emails will appear here after clicking Check...',
                }
              : {
                  title: 'Unknown',
                  icon: HelpCircle,
                  textColor: 'text-amber-400',
                  bgBar: 'bg-amber-400',
                  borderColor: 'border-amber-500/30',
                  focusBorder: 'focus-within:border-amber-400',
                  hoverBg: 'hover:bg-amber-500/20',
                  hoverText: 'hover:text-amber-300',
                  placeholder: 'Unknown emails will appear here after clicking Check...',
                };

          const IconComponent = theme.icon;

          return (
            <GlassCard className={`space-y-2.5 p-4 ${theme.borderColor}`}>
              {/* Box Header & Controls */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <IconComponent className={`w-3.5 h-3.5 ${theme.textColor}`} />
                    <span>{theme.title}</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyList(activeList, activeOutputTab)}
                      disabled={activeCount === 0}
                      className={`px-2.5 py-1 rounded-lg glass-item ${theme.hoverBg} text-white/80 ${theme.hoverText} text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-30`}
                    >
                      {copiedSection === activeOutputTab ? (
                        <Check className={`w-3.5 h-3.5 ${theme.textColor}`} />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedSection === activeOutputTab ? 'Copied' : 'Copy'}</span>
                    </button>
                    {activeCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeOutputTab === 'good') setGoodEmails([]);
                          else if (activeOutputTab === 'report') setFlaggedEmails([]);
                          else setUnknownEmails([]);
                        }}
                        className="px-2.5 py-1 rounded-lg glass-item hover:bg-rose-500/20 text-white/80 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Clear Output"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Line Numbered Box for Active Category */}
                <LineNumberedBox
                  value={activeList.join('\n')}
                  readOnly
                  placeholder={theme.placeholder}
                  borderColorClass={`${theme.borderColor} ${theme.focusBorder}`}
                  heightClass="h-52"
                />
              </div>
            </GlassCard>
          );
        })()}
      </div>

      {/* IN-APP PAGE / MODAL (RAISED HIGHER & FULLY VISIBLE WITHOUT SCROLLING) */}
      {viewReportInApp && reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop Scrim */}
          <div
            onClick={() => setViewReportInApp(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          />

          {/* Single Unified In-App Dialog / Report Card */}
          <div
            ref={reportCardRef}
            className="relative w-full max-w-lg rounded-[26px] bg-[#0c0f17] border border-white/15 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-200 p-4 sm:p-5 z-50 space-y-3 my-auto"
          >
            {/* Header: EXCLUSIVE OVERVIEW, Report For & Created To */}
            <div className="flex items-start justify-between pb-2.5 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exclusive Overview</span>
                </div>
                {/* Report For WITH Small Profile Avatar */}
                <div className="flex items-center gap-2 leading-snug">
                  <span className="text-white/60 font-semibold text-sm sm:text-base">Report For:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-amber-400/40 bg-black/40">
                      {selectedMember?.avatarUrl ? (
                        <img
                          src={selectedMember.avatarUrl}
                          alt={selectedMember.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center text-[9px] font-bold text-white uppercase">
                          {selectedMember?.username.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <span className="text-amber-300 font-bold text-base sm:text-lg">{selectedMember?.username}</span>
                  </div>
                </div>
                <p className="text-xs text-white/50 font-mono leading-none mt-1">
                  Created To: {reportData.createdTo}
                </p>
              </div>

              {/* Close Button (Excluded from copied image via data-skip-capture) */}
              <button
                type="button"
                data-skip-capture="true"
                onClick={() => setViewReportInApp(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* RECEIPT BREAKDOWN */}
            <div className="space-y-1 font-mono">
              {/* Total Email */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-sky-400 font-bold w-4 text-center">#</span>
                  <span>Total Email</span>
                </span>
                <span className="font-bold text-sky-400 font-mono text-base sm:text-lg whitespace-nowrap">
                  {reportData.totalEmailsCount}
                </span>
              </div>

              {/* Good Email */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-emerald-400 font-bold w-4 text-center">✓</span>
                  <span>Good Email</span>
                </span>
                <span className="font-bold text-emerald-400 font-mono text-base sm:text-lg whitespace-nowrap">
                  {reportData.goodEmailsCount}
                </span>
              </div>

              {/* Report Email */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-rose-400 font-bold w-4 text-center">✕</span>
                  <span>Report Email</span>
                </span>
                <span className="font-bold text-rose-400 font-mono text-base sm:text-lg whitespace-nowrap">
                  {reportData.reportEmailsCount}
                </span>
              </div>

              {/* Unknown */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-amber-400 font-bold w-4 text-center">?</span>
                  <span>Unknown</span>
                </span>
                <span className="font-bold text-amber-300 font-mono text-base sm:text-lg whitespace-nowrap">
                  {reportData.unknownEmailsCount}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-amber-300 font-bold w-4 text-center">$</span>
                  <span>Price</span>
                </span>
                <span className="font-bold text-amber-300 font-mono text-base sm:text-lg whitespace-nowrap">
                  Tk {reportData.pricePerUnit.toFixed(2)}
                </span>
              </div>

              {/* Final Amount (Good Email * Price) */}
              <div className="flex items-center justify-between py-1.5 border-b border-white/5 gap-2">
                <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                  <span className="text-amber-400 font-bold w-4 text-center">★</span>
                  <span>Final Amount</span>
                </span>
                <span className="font-bold text-amber-400 font-mono text-base sm:text-lg whitespace-nowrap">
                  Tk {reportData.finalAmount.toFixed(2)}
                </span>
              </div>

              {/* Main Balance (Shows single due balance before add, shows addition formula after add) */}
              {(() => {
                const sellerDue = selectedMember?.balance || 0;
                const finalAmt = reportData.finalAmount;
                const previousDue = isAddedToMainBalance ? sellerDue - finalAmt : sellerDue;
                const newTotal = isAddedToMainBalance ? sellerDue : sellerDue + finalAmt;
                const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(2));

                return (
                  <div className="flex items-center justify-between py-2 border-b border-white/5 gap-3">
                    <div className="min-w-0">
                      <span className="text-white/80 text-sm sm:text-base font-sans font-medium flex items-center gap-2 whitespace-nowrap">
                        <span className="text-emerald-400 font-bold w-4 text-center">$</span>
                        <span>Main Balance</span>
                      </span>
                      <div className="text-emerald-400 font-mono text-sm sm:text-base font-bold mt-0.5 whitespace-nowrap pl-6">
                        {!isAddedToMainBalance ? (
                          <span>{fmt(sellerDue)} Tk</span>
                        ) : (
                          <span>
                            {fmt(previousDue)}+{fmt(finalAmt)}={fmt(newTotal)} Tk
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {!isAddedToMainBalance ? (
                        <button
                          type="button"
                          onClick={handleAddToMainBalance}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
                          title="Add to seller's main balance"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Main Balance</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/25 text-emerald-300 border border-emerald-500/45 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Report Created By - positioned directly together right above Copy & Share options */}
            <div className="flex items-center gap-1 px-1 py-0.5 text-xs sm:text-sm font-mono text-white/80">
              <span className="text-white/60 font-sans font-medium">Report Created By:</span>
              <span className="font-bold text-amber-300 font-mono text-xs sm:text-sm">
                @{reportData.reportCreatedBy}
              </span>
            </div>

            {/* ACTION TOOLBAR (COPY, SHARE, SEND TO SELLER) - Excluded from copied image via data-skip-capture */}
            <div data-skip-capture="true" className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/10">
              {/* Copy Button (Copies whole report image) */}
              <button
                type="button"
                onClick={copyReportImage}
                disabled={isCopyingImage || isSharingImage || isSendingImage}
                className="py-2.5 px-3 rounded-xl glass-panel hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                title="Copy report card as image"
              >
                {isCopyingImage ? (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                ) : (
                  <Copy className="w-4 h-4 text-sky-400" />
                )}
                <span>{isCopyingImage ? 'Copying...' : 'Copy'}</span>
              </button>

              {/* Share Button (Shares report image) */}
              <button
                type="button"
                onClick={handleShareReport}
                disabled={isCopyingImage || isSharingImage || isSendingImage}
                className="py-2.5 px-3 rounded-xl glass-panel hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                title="Share report image"
              >
                {isSharingImage ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isSharingImage ? 'Sharing...' : 'Share'}</span>
              </button>

              {/* Send Button -> Directly dispatches image into selected seller's message box */}
              <button
                type="button"
                onClick={handleSendToSeller}
                disabled={isCopyingImage || isSharingImage || isSendingImage}
                className="col-span-2 sm:col-span-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 hover:from-amber-300 hover:to-orange-300 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                title={`Send report image to @${selectedMember?.username}'s message box`}
              >
                {isSendingImage ? (
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-black" />
                )}
                <span>{isSendingImage ? 'Sending...' : `Send to @${selectedMember?.username}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
