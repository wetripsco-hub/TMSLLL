'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, UploadCloud, FileText, CheckCircle2, AlertTriangle, 
  ZoomIn, ZoomOut, RotateCw, Download, Database, Check, RefreshCw,
  Plus, Eye, ArrowRight, ShieldCheck, DollarSign, Calendar, MapPin, Truck
} from 'lucide-react';
import { initialMockDocuments } from '@/lib/mock-data';
import { DocumentScanResult } from '@/types/tms';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentScanResult[]>(initialMockDocuments);
  const [selectedDoc, setSelectedDoc] = useState<DocumentScanResult>(documents[0]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(selectedDoc.status === 'verified');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable Form Fields
  const [fields, setFields] = useState(selectedDoc.extractedFields);

  const handleSelectDoc = (doc: DocumentScanResult) => {
    setSelectedDoc(doc);
    setFields(doc.extractedFields);
    setIsVerified(doc.status === 'verified');
    setZoomLevel(100);
    setRotation(0);
  };

  const handleSimulateOCR = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(false);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newDoc: DocumentScanResult = {
        id: `doc_${Date.now()}`,
        fileName: file.name,
        fileType: 'carrier_invoice',
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: 'Just now',
        status: 'needs_review',
        confidenceScore: 99.1,
        extractedFields: {
          invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
          loadNumber: 'FF-88401',
          carrierName: 'Lone Star Logistics LLC',
          shipperName: 'Midwest Grain & Feed Co',
          originCity: 'Kansas City, MO',
          destCity: 'Dallas, TX',
          deliveryDate: '2026-08-20',
          linehaulAmount: 3200.0,
          fuelSurcharge: 420.0,
          totalAmount: 3620.0,
          weight: 43500,
        },
        validationAlerts: [],
        previewUrl: '/mock-invoice.png',
      };

      setDocuments([newDoc, ...documents]);
      setSelectedDoc(newDoc);
      setFields(newDoc.extractedFields);
      setIsVerified(false);
      setIsProcessing(false);
    }, 1000);
  };

  const handleVerifyAndSave = () => {
    setIsVerified(true);
    setDocuments(
      documents.map((d) =>
        d.id === selectedDoc.id
          ? { ...d, status: 'verified', extractedFields: fields }
          : d
      )
    );
  };

  const handleDownloadJSON = () => {
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({ ...fields, verifiedAt: new Date().toISOString() }, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `${selectedDoc.fileName}_extracted.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Gemini 2.0 AI Multimodal Document Scanner
            </h1>
            <span className="text-[10px] font-mono font-bold bg-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              OCR ENGINE
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Upload Carrier Invoices, BOLs, PODs, or Rate Confirmations for instant vision extraction and automated ledger posting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/25 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document (PDF/Image)</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-card hover:bg-muted border border-border text-foreground rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Document Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelectDoc(doc)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedDoc.id === doc.id
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                : 'bg-card text-muted-foreground hover:text-foreground border-border hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{doc.fileName}</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
              selectedDoc.id === doc.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {doc.fileType.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Split-View Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: High-Resolution Zoomable Document Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
          <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
              <span>{selectedDoc.fileName}</span>
              <span>•</span>
              <span className="font-mono">{selectedDoc.fileSize}</span>
            </div>

            {/* Canvas Zoom & Rotate Toolbar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
                className="p-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-muted"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold px-2 text-foreground">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(175, zoomLevel + 15))}
                className="p-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-muted"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotation((rotation + 90) % 360)}
                className="p-1.5 rounded-lg bg-background border border-border text-foreground hover:bg-muted ml-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Render Document Graphic Canvas */}
          <div className="p-6 bg-slate-950 flex items-center justify-center min-h-[460px] overflow-auto relative">
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out',
              }}
              className="w-[420px] bg-white text-slate-900 rounded-xl shadow-2xl p-6 space-y-4 border border-slate-200 font-mono text-[11px]"
            >
              {/* Simulated Authentic Document Paper Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-slate-900">
                    {fields.carrierName || 'CARRIER FREIGHT INVOICE'}
                  </h3>
                  <p className="text-[10px] text-slate-600">DOT Approved Electronic Billing Document</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-600">#{fields.invoiceNumber || 'INV-2026-8819'}</span>
                  <p className="text-[9px] text-slate-500">Date: {fields.deliveryDate || '2026-08-21'}</p>
                </div>
              </div>

              {/* Shipper / Receiver */}
              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block">CUSTOMER (SHIPPER):</span>
                  <strong className="text-slate-900 block">{fields.shipperName || 'Midwest Logistics'}</strong>
                  <span className="text-slate-600">{fields.originCity || 'Kansas City, MO'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">DESTINATION CONSIGNEE:</span>
                  <strong className="text-slate-900 block">Dallas Distribution Hub</strong>
                  <span className="text-slate-600">{fields.destCity || 'Dallas, TX'}</span>
                </div>
              </div>

              {/* Line Items Table on Document */}
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 font-bold text-slate-700">
                    <th className="py-1">Description</th>
                    <th className="py-1 text-right">Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1.5">Linehaul Rate ({fields.loadNumber || 'FF-88401'})</td>
                    <td className="py-1.5 text-right font-bold">${fields.linehaulAmount?.toFixed(2) || '2,900.00'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5">DOE Fuel Surcharge (Index Avg)</td>
                    <td className="py-1.5 text-right font-bold">${fields.fuelSurcharge?.toFixed(2) || '320.00'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Grand Total */}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center text-xs font-bold text-slate-950">
                <span>TOTAL SETTLEMENT AMOUNT DUE:</span>
                <span className="text-sm font-extrabold text-orange-600">${fields.totalAmount?.toFixed(2) || '3,220.00'}</span>
              </div>
            </div>

            {/* AI Vision Scan Active Indicator */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold font-mono">Gemini 2.0 Extracting Document AST...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Auto-Populated OCR Extraction Fields (5 Cols) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">AI Vision Extraction</span>
                <h3 className="text-base font-extrabold text-foreground">Extracted Document Fields</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border border-emerald-200">
                99.4% Match Confidence
              </span>
            </div>

            {/* Editable Fields Grid */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-muted-foreground">Invoice / Doc #</label>
                  <input
                    type="text"
                    value={fields.invoiceNumber || ''}
                    onChange={(e) => setFields({ ...fields, invoiceNumber: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 font-mono text-foreground font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-muted-foreground">Load Reference #</label>
                  <input
                    type="text"
                    value={fields.loadNumber || ''}
                    onChange={(e) => setFields({ ...fields, loadNumber: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 font-mono text-orange-600 font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-muted-foreground">Carrier / Billing Party Name</label>
                <input
                  type="text"
                  value={fields.carrierName || ''}
                  onChange={(e) => setFields({ ...fields, carrierName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-foreground font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-muted-foreground">Customer Shipper</label>
                <input
                  type="text"
                  value={fields.shipperName || ''}
                  onChange={(e) => setFields({ ...fields, shipperName: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-foreground font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-muted-foreground">Origin City/State</label>
                  <input
                    type="text"
                    value={fields.originCity || ''}
                    onChange={(e) => setFields({ ...fields, originCity: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-foreground font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-muted-foreground">Delivery Destination</label>
                  <input
                    type="text"
                    value={fields.destCity || ''}
                    onChange={(e) => setFields({ ...fields, destCity: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-foreground font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 bg-background border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground block">Linehaul ($)</span>
                  <input
                    type="number"
                    value={fields.linehaulAmount || 0}
                    onChange={(e) => setFields({ ...fields, linehaulAmount: Number(e.target.value) })}
                    className="w-full bg-transparent font-mono font-bold text-foreground text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 bg-background border border-border rounded-xl">
                  <span className="text-[10px] text-muted-foreground block">Fuel Surcharge</span>
                  <input
                    type="number"
                    value={fields.fuelSurcharge || 0}
                    onChange={(e) => setFields({ ...fields, fuelSurcharge: Number(e.target.value) })}
                    className="w-full bg-transparent font-mono font-bold text-foreground text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl">
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block">Total Invoiced</span>
                  <span className="font-mono font-extrabold text-orange-600 dark:text-orange-400 text-sm">
                    ${((fields.linehaulAmount || 0) + (fields.fuelSurcharge || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Single Primary Green Verify & Save Button */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              onClick={handleVerifyAndSave}
              className={`w-full py-3 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isVerified
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
              }`}
            >
              {isVerified ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>
                {isVerified ? '✓ Verified & Synced to Load Ledger' : 'Verify & Generate Complete Invoice / Save to Load'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
