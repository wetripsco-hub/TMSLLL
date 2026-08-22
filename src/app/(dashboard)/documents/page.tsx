'use client';

import React, { useState } from 'react';
import { 
  Sparkles, UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  ZoomIn, ZoomOut, RotateCw, Download, Database, Check, RefreshCw
} from 'lucide-react';
import { initialMockDocuments } from '@/lib/mock-data';
import { DocumentScanResult } from '@/types/tms';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentScanResult[]>(initialMockDocuments);
  const [selectedDoc, setSelectedDoc] = useState<DocumentScanResult>(documents[0]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Editable Form Fields
  const [fields, setFields] = useState(selectedDoc.extractedFields);

  const handleSelectDoc = (doc: DocumentScanResult) => {
    setSelectedDoc(doc);
    setFields(doc.extractedFields);
    setIsVerified(doc.status === 'verified');
  };

  const handleSimulateOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(false);
    }, 800);
  };

  const handleVerifyAndPush = () => {
    setIsVerified(true);
    setDocuments(documents.map(d => d.id === selectedDoc.id ? { ...d, status: 'verified', extractedFields: fields } : d));
  };

  const handleDownloadJSON = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fields, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `${selectedDoc.fileName}_extracted.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Gemini 2.0 AI Document OCR Scanner
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Zero-manual-entry multimodal vision extraction for Rate Confirmations, BOLs, PODs, and Carrier Invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleSimulateOCR}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Parsing Vision...' : 'Re-Run Gemini OCR'}</span>
          </button>
        </div>
      </div>

      {/* Document Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelectDoc(doc)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedDoc.id === doc.id
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{doc.fileName}</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
              selectedDoc.id === doc.id
                ? 'bg-white/20 text-white'
                : 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
            }`}>
              {doc.confidenceScore}%
            </span>
          </button>
        ))}
      </div>

      {/* Split-Screen OCR Canvas & Extracted Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Pane: Zoomable Document Canvas */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              {selectedDoc.fileName}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-muted-foreground px-2 font-bold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Document Preview Paper Canvas */}
          <div className="flex-1 bg-background rounded-xl border border-border p-6 overflow-auto flex items-center justify-center min-h-[380px]">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
              className="w-full max-w-md bg-card border border-border shadow-lg rounded-xl p-6 text-xs space-y-4 font-mono transition-transform"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <div className="font-extrabold text-foreground uppercase tracking-wider text-sm">FREIGHT DOCUMENT</div>
                  <div className="text-[10px] text-muted-foreground">CERTIFIED DIGITAL SCAN</div>
                </div>
                <div className="text-right">
                  <div className="text-orange-600 font-bold">{selectedDoc.fileType.toUpperCase()}</div>
                  <div className="text-[10px] text-muted-foreground">{selectedDoc.uploadDate.split('T')[0]}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div><strong className="text-foreground">REF LOAD #:</strong> <span className="text-orange-600 font-bold">{fields.loadNumber || 'FF-88902'}</span></div>
                <div><strong className="text-foreground">CARRIER:</strong> <span className="text-foreground">{fields.carrierName || 'Titan Freight Lines'}</span></div>
                <div><strong className="text-foreground">SHIPPER:</strong> <span className="text-foreground">{fields.shipperName || 'Apex Cold Foods'}</span></div>
                <div><strong className="text-foreground">ORIGIN:</strong> {fields.originCity}, {fields.originState}</div>
                <div><strong className="text-foreground">DESTINATION:</strong> {fields.destCity}, {fields.destState}</div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg border border-border text-right space-y-1">
                <div className="flex justify-between text-muted-foreground font-semibold">
                  <span>Linehaul Rate:</span>
                  <span className="text-foreground font-bold">${fields.linehaulAmount?.toFixed(2) || '3,100.00'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-semibold">
                  <span>Fuel Surcharge:</span>
                  <span className="text-foreground font-bold">${fields.fuelSurcharge?.toFixed(2) || '420.00'}</span>
                </div>
                {fields.accessorials ? (
                  <div className="flex justify-between text-orange-600 font-semibold">
                    <span>Accessorial / Detention:</span>
                    <span className="font-bold">${fields.accessorials?.toFixed(2)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-foreground border-t border-border pt-1 font-bold">
                  <span>Total Amount:</span>
                  <span className="text-orange-600 font-extrabold">${fields.totalAmount?.toFixed(2) || '3,520.00'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Signature: {fields.signeeName || 'Marcus Vance'}</span>
                <span className="text-emerald-600 font-bold">STAMP VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-2 font-medium">
            <span>OCR Multimodal Engine: Gemini 2.0 Flash</span>
            <span className="font-mono text-orange-600 font-bold">Latency: 1,180ms</span>
          </div>
        </div>

        {/* Right Pane: Extracted & Editable Fields */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Extracted Structured Fields
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  Verify or edit before pushing to active ledger.
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                Confidence: {selectedDoc.confidenceScore}%
              </span>
            </div>

            {/* Validation Alerts */}
            <div className="space-y-2">
              {selectedDoc.validationAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
                      : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 flex-shrink-0 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />}
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Matched Load #</label>
                <input
                  type="text"
                  value={fields.loadNumber || ''}
                  onChange={(e) => setFields({ ...fields, loadNumber: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Invoice / BOL #</label>
                <input
                  type="text"
                  value={fields.invoiceNumber || fields.bolNumber || 'INV-2026-88902'}
                  onChange={(e) => setFields({ ...fields, invoiceNumber: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={fields.carrierName || ''}
                  onChange={(e) => setFields({ ...fields, carrierName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Shipper Name</label>
                <input
                  type="text"
                  value={fields.shipperName || ''}
                  onChange={(e) => setFields({ ...fields, shipperName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Linehaul Amount ($)</label>
                <input
                  type="number"
                  value={fields.linehaulAmount || 0}
                  onChange={(e) => setFields({ ...fields, linehaulAmount: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">Fuel Surcharge ($)</label>
                <input
                  type="number"
                  value={fields.fuelSurcharge || 0}
                  onChange={(e) => setFields({ ...fields, fuelSurcharge: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-muted-foreground mb-1">Accessorials & Detention ($)</label>
                <input
                  type="number"
                  value={fields.accessorials || 0}
                  onChange={(e) => setFields({ ...fields, accessorials: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              type="button"
              onClick={handleVerifyAndPush}
              className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isVerified
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
              }`}
            >
              {isVerified ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Verified & Synced to Database</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Verify & Push to Database / Accounting</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
