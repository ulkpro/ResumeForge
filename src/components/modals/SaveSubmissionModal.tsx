import React, { useState, useEffect } from 'react';
import { X, Building2, Hash, Briefcase, FileText, CheckCircle2, AlertCircle, Loader2, Plus } from 'lucide-react';

interface SaveSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: (company: string, jobId: string, jobName: string) => void;
    getContent: (company: string, jobId: string, jobName: string) => string;
    targetGroup: string;
    targetRole: string;
}

export function SaveSubmissionModal({
    isOpen,
    onClose,
    onSaved,
    getContent,
    targetGroup,
    targetRole
}: SaveSubmissionModalProps) {
    const [existingCompanies, setExistingCompanies] = useState<string[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [isCustomCompany, setIsCustomCompany] = useState<boolean>(false);
    const [customCompany, setCustomCompany] = useState<string>('');
    const [jobId, setJobId] = useState<string>('');
    const [jobName, setJobName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);

    // Fetch existing companies when opening
    useEffect(() => {
        if (!isOpen) return;
        setError(null);
        setSuccessMessage(null);

        const fetchCompanies = async () => {
            try {
                const res = await fetch('/api/saved-submissions');
                if (res.ok) {
                    const data = await res.json();
                    if (data.companies) {
                        const comps = data.companies.map((c: any) => c.company);
                        setExistingCompanies(comps);
                        if (comps.length > 0) {
                            setSelectedCompany(comps[0]);
                            setIsCustomCompany(false);
                        } else {
                            setIsCustomCompany(true);
                        }
                    }
                }
            } catch (e) {
                // If failed, default to custom input
                setIsCustomCompany(true);
            }
        };

        fetchCompanies();
    }, [isOpen]);

    const activeCompany = isCustomCompany ? (customCompany || 'Company') : (selectedCompany || 'Company');
    const dynamicPreviewContent = getContent(activeCompany, jobId || 'JOB-ID', jobName || 'Job Title');

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const companyToSave = isCustomCompany ? customCompany.trim() : selectedCompany.trim();
        const trimmedJobId = jobId.trim();
        const trimmedJobName = jobName.trim();

        if (!companyToSave) {
            setError('Please provide a company name.');
            return;
        }
        if (!trimmedJobId) {
            setError('Please provide a Job ID.');
            return;
        }
        if (!trimmedJobName) {
            setError('Please provide a Job Name / Title.');
            return;
        }

        const finalContent = getContent(companyToSave, trimmedJobId, trimmedJobName);

        setLoading(true);
        try {
            const res = await fetch('/api/save-submission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: companyToSave,
                    jobId: trimmedJobId,
                    jobName: trimmedJobName,
                    content: finalContent
                })
            });

            const result = await res.json();
            if (res.ok && result.success) {
                setSuccessMessage(`Saved to ${result.filePath}`);
                if (onSaved) {
                    onSaved(companyToSave, trimmedJobId, trimmedJobName);
                }
                setTimeout(() => {
                    onClose();
                    // Reset fields
                    setJobId('');
                    setJobName('');
                    setSuccessMessage(null);
                }, 1200);
            } else {
                setError(result.error || 'Failed to save submission.');
            }
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
                            <FileText size={20} className="stroke-[2.5]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Save Resume for Job Application</h2>
                            <p className="text-xs text-slate-500">Saves the active tailored markdown content inside the company's folder</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
                    {/* Active profile badge */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-sky-800">
                        <span className="font-semibold uppercase tracking-wider text-[11px] text-sky-600">Current Profile:</span>
                        <span className="font-medium bg-white px-2.5 py-1 rounded-md border border-sky-200 shadow-xs">
                            {targetGroup} / <strong className="text-sky-900">{targetRole}</strong>
                        </span>
                    </div>

                    {/* Company Selection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 size={15} className="text-slate-500" />
                            Company Name <span className="text-rose-500">*</span>
                        </label>
                        
                        {existingCompanies.length > 0 && !isCustomCompany ? (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <select
                                        value={selectedCompany}
                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                    >
                                        {existingCompanies.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomCompany(true)}
                                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors whitespace-nowrap"
                                    >
                                        <Plus size={14} />
                                        Add New
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. UPMC Health Plan, Google, Restek"
                                        value={customCompany}
                                        onChange={(e) => setCustomCompany(e.target.value)}
                                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                        autoFocus
                                    />
                                    {existingCompanies.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomCompany(false)}
                                            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                                        >
                                            Pick Existing
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job ID */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Hash size={15} className="text-slate-500" />
                            Job ID / Requisition # <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. REQ-240182, 10492, or 24-001"
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-sm"
                        />
                    </div>

                    {/* Job Name / Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Briefcase size={15} className="text-slate-500" />
                            Job Title / Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Senior AWS Business Analyst"
                            value={jobName}
                            onChange={(e) => setJobName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                    </div>

                    {/* Content Preview Collapse */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/80 font-semibold text-slate-700 transition-colors text-left"
                        >
                            <span className="flex items-center gap-2">
                                <FileText size={14} className="text-slate-400" />
                                Inspect Job Content to be Saved ({dynamicPreviewContent.split('\n').length} lines)
                            </span>
                            <span className="text-[11px] text-sky-600 font-medium">
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </span>
                        </button>
                        {showPreview && (
                            <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border-t border-slate-200">
                                {dynamicPreviewContent}
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                            <CheckCircle2 size={16} className="shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Resume Content</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
