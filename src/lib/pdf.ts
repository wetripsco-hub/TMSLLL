import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { LoadRow, LoadStopRow, CarrierRow } from "@/types/database.types"

export async function generateRateConfirmation(
  load: LoadRow,
  stops: LoadStopRow[],
  carrier: CarrierRow | null,
  signatureBase64?: string
): Promise<Blob> {
  const doc = new jsPDF()

  // --- Header ---
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("RATE CONFIRMATION", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("TMS Freight Brokerage, LLC", 14, 30)
  doc.text("123 Broker Way, Suite 100", 14, 35)
  doc.text("Chicago, IL 60601", 14, 40)
  doc.text("Phone: 800-555-0100", 14, 45)

  doc.setFont("helvetica", "bold")
  doc.text(`Load #: ${load.reference_number}`, 150, 30)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35)

  // --- Carrier Details ---
  doc.setDrawColor(0)
  doc.setFillColor(240, 240, 240)
  doc.rect(14, 55, 182, 8, "FD")
  doc.setFontSize(12)
  doc.text("Carrier Information", 16, 60.5)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  if (carrier) {
    doc.text(`Company: ${carrier.company_name}`, 14, 70)
    doc.text(`MC #: ${carrier.mc_number}`, 14, 75)
    doc.text(`DOT #: ${carrier.dot_number}`, 100, 75)
    doc.text(`Contact: ${carrier.phone}`, 14, 80)
  } else {
    doc.text("Company: PENDING ASSIGNMENT", 14, 70)
  }

  doc.text(`Equipment Req: ${load.equipment_type}`, 100, 70)
  doc.text(`Weight: ${load.weight} lbs`, 100, 80)
  if (load.temperature) {
    doc.text(`Temperature: ${load.temperature}°F`, 100, 85)
  }

  // --- Stops ---
  const tableData = stops.map((stop) => [
    stop.stop_type.toUpperCase(),
    stop.stop_sequence.toString(),
    stop.facility_name,
    `${stop.city}, ${stop.state}`,
    stop.appointment_time ? new Date(stop.appointment_time).toLocaleString() : "TBD",
  ])

  // @ts-ignore - jspdf-autotable plugin adds autoTable to doc
  doc.autoTable({
    startY: 95,
    head: [["Type", "Seq", "Facility", "Location", "Appointment"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [40, 40, 40] },
    margin: { left: 14, right: 14 },
  })

  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 150

  // --- Financials ---
  doc.setFillColor(240, 240, 240)
  doc.rect(14, finalY + 10, 182, 8, "FD")
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Rate Details & Instructions", 16, finalY + 15.5)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Agreed Carrier Rate: $${load.carrier_rate?.toFixed(2) || "0.00"}`, 14, finalY + 25)
  doc.text("Line Haul: Included", 14, finalY + 30)
  doc.text("Fuel Surcharge: Included", 14, finalY + 35)

  doc.setFont("helvetica", "bold")
  doc.text("Total Pay: $" + (load.carrier_rate?.toFixed(2) || "0.00"), 14, finalY + 45)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  const instructions = [
    "* Driver MUST call for dispatch before heading to origin.",
    "* 2 hours free time for loading/unloading. Detention requires in/out times on BOL.",
    "* POD must be submitted within 24 hours of delivery to ensure prompt payment.",
    "* Double brokering is strictly prohibited and will result in non-payment."
  ]
  doc.text(instructions, 100, finalY + 25)

  // --- Signature Block ---
  const sigY = finalY + 70
  doc.setFontSize(10)
  doc.text("By signing below, Carrier agrees to the terms and conditions outlined above.", 14, sigY)

  doc.line(14, sigY + 20, 90, sigY + 20)
  doc.text("Carrier Representative Signature", 14, sigY + 25)

  doc.line(120, sigY + 20, 180, sigY + 20)
  doc.text("Date", 120, sigY + 25)

  if (signatureBase64) {
    try {
      doc.addImage(signatureBase64, "PNG", 14, sigY + 5, 70, 14)
      doc.text(new Date().toLocaleDateString(), 125, sigY + 18)
    } catch (e) {
      console.error("Failed to add signature image to PDF", e)
    }
  }

  return doc.output("blob")
}
