"use client";

import { useRef, useState } from "react";
import type { Evidence } from "@/lib/types";

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evidence: Omit<Evidence, "id">) => void;
  existingEvidence?: Evidence[];
}

export default function EvidenceUploadModal({
  isOpen,
  onClose,
  onSubmit,
  existingEvidence = [],
}: EvidenceUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Only allow PDFs and images
      if (["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert("Please upload a PDF, PNG, or JPG file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setIsUploading(true);

    // Simulate file upload - in production, this would upload to a server
    const fileUrl = URL.createObjectURL(selectedFile);

    onSubmit({
      fileName: selectedFile.name,
      fileUrl,
      fileType: selectedFile.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User", // In production, get from auth context
      description: description || undefined,
    });

    setSelectedFile(null);
    setDescription("");
    setIsUploading(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Add Evidence
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload File (PDF, PNG, JPG)
            </label>
            <div
              className="relative rounded-lg border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-2">📄</div>
                  <div className="text-sm font-semibold text-slate-900">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-slate-500">
                    PDF, PNG, or JPG (Max 10MB)
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this evidence, e.g., 'Bank reconciliation statement for Q1 2024'"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
            />
          </div>

          {/* Existing Evidence */}
          {existingEvidence.length > 0 && (
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold text-slate-600 mb-2">
                Existing Evidence ({existingEvidence.length})
              </div>
              <div className="space-y-1">
                {existingEvidence.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between text-xs text-slate-600"
                  >
                    <span className="truncate">{e.fileName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(e.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Add Evidence"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
