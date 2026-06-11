import React, { useState, useRef } from 'react';
import { uploadReceiptApi } from '../../api/expenseApi';

interface ReceiptUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function ReceiptUpload({ value, onChange }: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadReceiptApi(file);
      onChange(res.data.url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="form-label">Receipt (optional)</label>
      <div
        className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-200"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <div className="space-y-2">
            <img src={value} alt="Receipt" className="h-24 mx-auto rounded-lg object-contain" />
            <p className="text-xs text-amber-600 font-medium">Click to replace</p>
          </div>
        ) : (
          <div className="py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-400">Click to upload receipt</p>
            <p className="text-xs text-slate-300 mt-1">JPG, PNG, PDF</p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" />
      {uploading && <p className="text-xs text-amber-500 animate-pulse">Uploading...</p>}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
