import React, { useState } from 'react';
import { api } from '../api/index.ts';
import { DocumentType, ConfidentialityLevel } from '../types/index.ts';
import { UploadCloud, FileText, Lock, X, AlertCircle } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultAppointmentId?: string;
  defaultLawyerId?: string;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultAppointmentId,
  defaultLawyerId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('case_file');
  const [confidentialityLevel, setConfidentialityLevel] =
    useState<ConfidentialityLevel>('lawyer_client_only');
  const [fileName, setFileName] = useState('Draft_Legal_Notice_Exhibit.pdf');
  const [fileSize] = useState(245000); // 245 KB
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a document title.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await api.uploadDocument({
        title: title.trim(),
        description: description.trim(),
        documentType,
        confidentialityLevel,
        fileType: 'application/pdf',
        fileSize,
        fileData:
          'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1OSAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeJwrSi0uVkjLz0stUrC1VTA0tTAyUDA0NFAwsVAIzy/KSVEoSi3NyVHQ5VKw1dPVVVBwtgUAq/QMNwplbmRzdHJlYW0KZW5kb2Jq',
        relatedAppointmentId: defaultAppointmentId,
        relatedLawyerId: defaultLawyerId,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error uploading document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-white">Upload Legal Document</h3>
              <p className="text-[11px] text-amber-300">Confidential Legal Document Centre</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Non-Disclosure Agreement Draft v2"
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Document Classification
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              >
                <option value="case_file">Case File</option>
                <option value="agreement">Contract / Agreement</option>
                <option value="notice">Legal Notice</option>
                <option value="evidence">Evidence / Exhibit</option>
                <option value="client_brief">Client Brief</option>
                <option value="bar_license">Bar License / ID</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                Confidentiality
              </label>
              <select
                value={confidentialityLevel}
                onChange={(e) =>
                  setConfidentialityLevel(e.target.value as ConfidentialityLevel)
                }
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              >
                <option value="lawyer_client_only">Lawyer & Client Only</option>
                <option value="confidential">Strictly Confidential</option>
                <option value="admin_only">Compliance Admin Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              File Attachment
            </label>
            <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-slate-800 truncate max-w-[200px]">{fileName}</p>
                  <p className="text-[10px] text-slate-400">PDF • 245 KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFileName(`Attachment_${Date.now().toString().slice(-4)}.pdf`)}
                className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
              >
                Change File
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
              Description or Context Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes for the review advocate..."
              className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-400 font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? 'Uploading...' : 'Securely Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
