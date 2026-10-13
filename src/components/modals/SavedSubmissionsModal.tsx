import { useState, useEffect, useMemo } from 'react';
import {
    X,
    Building2,
    Calendar,
    Copy,
    Check,
    Search,
    Trash2,
    FileText,
    Inbox,
    Loader2,
    Download,
    ExternalLink,
    Eye,
    Code,
    ZoomIn,
    ZoomOut
} from 'lucide-react';
import { ResumePreview } from '../preview/ResumePreview';
import { defaultLayout } from '../../types';
import type { LayoutSettings } from '../../types';
import { handleExportPDF } from '../../utils/pdfExport';
import { deserializeResumeSubmission, type DeserializedSubmission } from '../../utils/resumeSerializer';

interface Submission {
    company: string;
    fileName: string;
    filePath: string;
    jobId: string;
    jobName: string;
    modifiedAt: string;
    content: string;
}

interface CompanyGroup {
    company: string;
    submissions: Submission[];
}

interface SavedSubmissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadInEditor?: (submission: DeserializedSubmission) => void;
    currentLayout?: LayoutSettings;
}

export function SavedSubmissionsModal({
    isOpen,
    onClose,
    onLoadInEditor,
    currentLayout = defaultLayout
}: SavedSubmissionsModalProps) {
    const [companies, setCompanies] = useState<CompanyGroup[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
    const [zoomLevel, setZoomLevel] = useState<number>(0.85);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/saved-submissions');
            if (res.ok) {
                const data = await res.json();
                if (data.companies) {
                    setCompanies(data.companies);
                    // Automatically select first submission if none selected
                    if (data.companies.length > 0 && data.companies[0].submissions.length > 0) {
                        setSelectedSubmission((prev) => {
                            if (!prev) return data.companies[0].submissions[0];
                            const stillExists = data.companies
                                .flatMap((c: CompanyGroup) => c.submissions)
                                .find((s: Submission) => s.filePath === prev.filePath);
                            return stillExists || data.companies[0].submissions[0];
                        });
                    } else {
                        setSelectedSubmission(null);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load submissions', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchSubmissions();
        }
    }, [isOpen]);

    // Parse active submission into structured ResumeData & layout
    const deserializedSubmission = useMemo<DeserializedSubmission | null>(() => {
        if (!selectedSubmission) return null;
        return deserializeResumeSubmission(selectedSubmission.content, currentLayout);
    }, [selectedSubmission, currentLayout]);

    // Filtered list based on search
    const filteredCompanies = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return companies;

        return companies
            .map((c) => {
                const matchesCompany = c.company.toLowerCase().includes(q);
                const matchingSubmissions = c.submissions.filter(
                    (s) =>
                        matchesCompany ||
                        s.jobId.toLowerCase().includes(q) ||
                        s.jobName.toLowerCase().includes(q) ||
                        s.content.toLowerCase().includes(q)
                );
                return {
                    ...c,
                    submissions: matchingSubmissions
                };
            })
            .filter((c) => c.submissions.length > 0);
    }, [companies, searchQuery]);

    const handleCopy = () => {
        if (!selectedSubmission) return;
        navigator.clipboard.writeText(selectedSubmission.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDelete = async (submission: Submission) => {
        if (!window.confirm(`Are you sure you want to delete the saved resume for "${submission.jobName}" (${submission.jobId}) at ${submission.company}?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch('/api/saved-submission', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: submission.filePath })
            });
            if (res.ok) {
                await fetchSubmissions();
            } else {
                alert('Could not delete submission.');
            }
        } catch (err) {
            alert(String(err));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLoadInEditorClick = () => {
        if (!deserializedSubmission || !onLoadInEditor) return;
        onLoadInEditor(deserializedSubmission);
        onClose();
    };

    const handleExportSavedPDF = () => {
        if (!deserializedSubmission) return;
        handleExportPDF(deserializedSubmission.layout);
    };

    const formatDate = (isoString: string) => {
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return isoString;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-7xl h-[92vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                            <Building2 size={22} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Saved Resumes by Company & Job ID</h2>
                            <p className="text-xs text-slate-500">
                                Review saved job submissions rendered in the full resume format
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Split Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Panel: Search + Submissions List */}
                    <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
                        {/* Search Bar */}
                        <div className="p-3 border-b border-slate-200 bg-white">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search company, job ID, title..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                                    <Loader2 size={24} className="animate-spin mb-2 text-sky-500" />
                                    <span className="text-xs font-medium">Loading saved resumes...</span>
                                </div>
                            ) : filteredCompanies.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-center px-4">
                                    <Inbox size={32} className="mb-2 stroke-1 text-slate-300" />
                                    <p className="text-sm font-semibold text-slate-600">No saved resumes found</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {searchQuery
                                            ? 'Try searching with different keywords.'
                                            : 'Save your first resume using the "Save Submission" button.'}
                                    </p>
                                </div>
                            ) : (
                                filteredCompanies.map((group) => (
                                    <div key={group.company} className="space-y-1.5">
                                        <div className="flex items-center justify-between px-2 pt-1">
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                                <Building2 size={13} className="text-sky-600" />
                                                {group.company}
                                            </span>
                                            <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full">
                                                {group.submissions.length} {group.submissions.length === 1 ? 'job' : 'jobs'}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {group.submissions.map((sub) => {
                                                const isSelected = selectedSubmission?.filePath === sub.filePath;
                                                return (
                                                    <div
                                                        key={sub.filePath}
                                                        onClick={() => setSelectedSubmission(sub)}
                                                        className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                                            isSelected
                                                                ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                                                                : 'bg-white hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <span
                                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                                                                            isSelected
                                                                                ? 'bg-sky-600 text-white'
                                                                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                                                                        }`}
                                                                    >
                                                                        {sub.jobId}
                                                                    </span>
                                                                </div>
                                                                <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                                                    {sub.jobName}
                                                                </p>
                                                                <p className={`text-[11px] mt-1 flex items-center gap-1 ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                                                                    <Calendar size={11} />
                                                                    {formatDate(sub.modifiedAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Exact Resume View / Raw View */}
                    <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
                        {selectedSubmission && deserializedSubmission ? (
                            <>
                                {/* Viewer Top Bar */}
                                <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shrink-0 z-10 shadow-xs">
                                    <div className="min-w-0 flex-1 pr-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                                                {selectedSubmission.company}
                                            </span>
                                            <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                                ID: {selectedSubmission.jobId}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                Role: <strong>{deserializedSubmission.targetGroup} / {deserializedSubmission.targetRole}</strong>
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 truncate mt-0.5">
                                            {selectedSubmission.jobName}
                                        </h3>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* View Mode Toggle */}
                                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                            <button
                                                onClick={() => setViewMode('visual')}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                                    viewMode === 'visual'
                                                        ? 'bg-white text-sky-700 shadow-xs'
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="View as formatted resume"
                                            >
                                                <Eye size={13} />
                                                <span>Resume View</span>
                                            </button>
                                            <button
                                                onClick={() => setViewMode('raw')}
                                                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                                    viewMode === 'raw'
                                                        ? 'bg-white text-sky-700 shadow-xs'
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                                title="View raw markdown text"
                                            >
                                                <Code size={13} />
                                                <span>Raw Text</span>
                                            </button>
                                        </div>

                                        {/* Zoom Controls (only in visual view) */}
                                        {viewMode === 'visual' && (
                                            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                                                <button
                                                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                                                    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                                    title="Zoom out"
                                                >
                                                    <ZoomOut size={14} />
                                                </button>
                                                <span className="px-2 font-mono text-[11px] text-slate-600 select-none">
                                                    {Math.round(zoomLevel * 100)}%
                                                </span>
                                                <button
                                                    onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                                                    className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                                    title="Zoom in"
                                                >
                                                    <ZoomIn size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Load in Edit Mode */}
                                        {onLoadInEditor && (
                                            <button
                                                onClick={handleLoadInEditorClick}
                                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-xs"
                                                title="Open this saved resume in the editor to make changes"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Open in Editor</span>
                                            </button>
                                        )}

                                        {/* Export PDF */}
                                        <button
                                            onClick={handleExportSavedPDF}
                                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs"
                                            title="Export this saved resume directly to PDF"
                                        >
                                            <Download size={14} />
                                            <span>Export PDF</span>
                                        </button>

                                        {/* Copy */}
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                                            title="Copy markdown content to clipboard"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(selectedSubmission)}
                                            disabled={isDeleting}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                                            title="Delete this saved resume"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Display */}
                                {viewMode === 'visual' ? (
                                    <div className="flex-1 overflow-y-auto w-full flex justify-center p-8 bg-slate-200/70">
                                        <div
                                            style={{
                                                transform: `scale(${zoomLevel})`,
                                                transformOrigin: 'top center',
                                                transition: 'transform 0.15s ease-out'
                                            }}
                                            className="shrink-0"
                                        >
                                            <ResumePreview
                                                data={deserializedSubmission.data}
                                                selectedPoints={deserializedSubmission.selectedPoints}
                                                layout={deserializedSubmission.layout}
                                                customPersonalDetails={deserializedSubmission.personalDetails}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto p-6 bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed">
                                        <pre className="whitespace-pre-wrap font-inherit">
                                            {selectedSubmission.content}
                                        </pre>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                                <FileText size={48} className="mb-3 stroke-1 text-slate-300" />
                                <p className="text-base font-semibold text-slate-700">No Resume Selected</p>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                    Select a saved resume from the left panel to review its exact layout, typography, and submitted bullet points.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
