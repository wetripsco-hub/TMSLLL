'use client';

import React, { useState } from 'react';
import { X, Download, PenTool, CheckCircle, FileText, Printer, Building2, Truck } from 'lucide-react';
import { DispatchLoad } from '@/types/tms';
import { jsPDF } from 'jspdf';

interface RateConModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: DispatchLoad | null;
  onSignComplete?: (signerName: string) => void;
}

export function RateConModal({ isOpen, onClose, load, onSignComplete }: RateConModalProps) {
  const [signerName, setSignerName] = useState(load?.carrier?.driverName || 'Marcus Vance');
  const [signatureText, setSignatureText] = useState(load?.carrier?.driverName || 'Marcus Vance');
  const [isSigned, setIsSigned] = useState(load?.rateConSigned || false);

  if (!isOpen || !load) return null;

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigned(true);
    if (onSignComplete) {
      onSignComplete(signerName);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('FREIGHTFLOW LOGISTICS 3PL', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('BROKER-CARRIER RATE CONFIRMATION & AGREEMENT', 14, 28);
    doc.text(`Tender Date: ${new Date().toISOString().split('T')[0]} | Load #: ${load.loadNumber}`, 14, 34);

    // Divider
    doc.setDrawColor(203, 213, 225);
    doc.line(14, 38, 196, 38);

    // Carrier & Broker info
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('CARRIER INFORMATION:', 14, 46);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Carrier: ${load.carrier?.name || 'Unassigned'}`, 14, 52);
    doc.text(`MC #: ${load.carrier?.mcNumber || 'N/A'} | DOT #: ${load.carrier?.dotNumber || 'N/A'}`, 14, 58);
    doc.text(`Driver: ${load.carrier?.driverName || 'N/A'} | Phone: ${load.carrier?.driverPhone || 'N/A'}`, 14, 64);
    doc.text(`Equipment: ${load.equipment.toUpperCase()} | Miles: ${load.miles}`, 14, 70);

    // Stops Table
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('ROUTING & APPOINTMENT SCHEDULE:', 14, 82);
    
    let yPos = 90;
    load.stops.forEach((stop, index) => {
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`[STOP ${index + 1}: ${stop.type.toUpperCase()}] - ${stop.facility}`, 14, yPos);
      doc.setTextColor(100, 116, 139);
      doc.text(`${stop.address}, ${stop.city}, ${stop.state} ${stop.zip}`, 14, yPos + 5);
      doc.text(`Date & Time: ${stop.date} @ ${stop.timeWindow}`, 14, yPos + 10);
      if (stop.specialInstructions) {
        doc.text(`Notes: ${stop.specialInstructions}`, 14, yPos + 15);
        yPos += 22;
      } else {
        yPos += 17;
      }
    });

    // Agreed Rate & Financials
    yPos += 5;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, yPos, 196, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('AGREED CARRIER COMPENSATION:', 14, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Linehaul Agreement: $${load.financials.carrierRate.toFixed(2)} USD`, 14, yPos);
    doc.text(`Fuel Surcharge: Included | Accessorials: Pre-Auth Only`, 14, yPos + 5);
    doc.text(`Payment Terms: Net 30 standard or 2% QuickPay upon signed POD submission`, 14, yPos + 10);

    // Signature Area
    yPos += 20;
    doc.rect(14, yPos, 182, 28);
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('DIGITAL SIGNATURE ACCEPTANCE:', 18, yPos + 8);
    doc.setTextColor(234, 88, 12);
    doc.setFont('courier', 'bolditalic');
    doc.setFontSize(14);
    doc.text(`Digitally Signed by: ${signatureText}`, 18, yPos + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Timestamp: ${new Date().toISOString()} | Certified via FreightFlow eSign`, 18, yPos + 24);

    doc.save(`Rate_Confirmation_${load.loadNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground p-6 sm:p-8 max-h-[90vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-6">
          {/* Header */}
          <div className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Rate Confirmation</span>
              <span className="font-mono text-xs text-muted-foreground font-bold">Load #{load.loadNumber}</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground mt-1">
              Broker-Carrier Rate Agreement
            </h2>
          </div>

          {/* Rate Con Paper Preview Card */}
          <div className="bg-background border border-border rounded-xl p-5 text-xs space-y-4">
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
              <div>
                <span className="text-muted-foreground text-[10px] uppercase font-bold">Tendering Broker</span>
                <div className="font-extrabold text-foreground mt-0.5">FreightFlow AI Logistics LLC</div>
                <div className="text-muted-foreground">MC #992014 | Phone: (800) 555-TMS1</div>
              </div>
              <div>
                <span className="text-muted-foreground text-[10px] uppercase font-bold">Assigned Carrier</span>
                <div className="font-extrabold text-foreground mt-0.5">{load.carrier?.name || 'Unassigned'}</div>
                <div className="text-muted-foreground">MC #{load.carrier?.mcNumber} • Driver: {load.carrier?.driverName}</div>
              </div>
            </div>

            {/* Stops */}
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-2">Routing Plan</span>
              <div className="space-y-2 border-l-2 border-orange-500/40 pl-3 ml-1">
                {load.stops.map((s, idx) => (
                  <div key={s.id} className="text-xs">
                    <span className="font-bold text-orange-600 uppercase">Stop {idx + 1} ({s.type}):</span>{' '}
                    <span className="text-foreground font-semibold">{s.facility} ({s.city}, {s.state})</span>
                    <span className="text-muted-foreground block text-[11px] font-mono">{s.date} @ {s.timeWindow}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="bg-card p-4 rounded-xl border border-border flex items-center justify-between font-mono shadow-xs">
              <div>
                <span className="text-muted-foreground text-[10px] block font-sans font-bold">Agreed Carrier Linehaul</span>
                <span className="text-lg font-bold text-orange-600">${load.financials.carrierRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right text-[11px] text-muted-foreground font-sans">
                <span className="font-semibold text-foreground">Commodity: {load.commodity}</span>
                <span className="block font-mono text-muted-foreground">{load.weightLbs.toLocaleString()} lbs • {load.miles} mi</span>
              </div>
            </div>
          </div>

          {/* Digital Signature Pad */}
          <div className="bg-background border border-border rounded-xl p-5">
            <span className="text-xs font-bold text-foreground block mb-2">Digital Signature & Acceptance</span>
            {isSigned ? (
              <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl text-center">
                <CheckCircle className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <div className="font-mono text-base font-bold text-orange-700 dark:text-orange-300 italic">
                  "{signatureText}"
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                  Digitally certified and locked on {new Date().toLocaleDateString()}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSign} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-muted-foreground font-medium mb-1">Type Driver / Dispatcher Full Legal Name to Sign</label>
                  <div className="relative">
                    <PenTool className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      value={signatureText}
                      onChange={(e) => setSignatureText(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all"
                >
                  Apply Digital Signature (eSign)
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl border border-border"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-card hover:bg-muted text-foreground font-bold text-xs rounded-xl border border-border transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-orange-500" />
            Download Certified PDF
          </button>
        </div>
      </div>
    </div>
  );
}
