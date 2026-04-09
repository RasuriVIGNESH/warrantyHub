import React from 'react';
import { Button } from '../ui/Button';
import { Device } from '../../types/device';
import { FileDown } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFExportProps {
  device: Device;
}

export function PDFExport({ device }: PDFExportProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Device Warranty Details', 20, 20);
    
    // Device Info
    doc.setFontSize(12);
    doc.text(`Device: ${device.manufacturer} ${device.model}`, 20, 40);
    doc.text(`Serial Number: ${device.serialNumber || 'Not provided'}`, 20, 50);
    doc.text(`Purchase Date: ${new Date(device.purchaseDate).toLocaleDateString()}`, 20, 60);
    doc.text(`Warranty End Date: ${new Date(device.warrantyEndDate).toLocaleDateString()}`, 20, 70);
    doc.text(`Warranty Status: ${device.warrantyStatus.replace('-', ' ')}`, 20, 80);
    if (device.purchasePrice) {
      doc.text(`Purchase Price: $${device.purchasePrice}`, 20, 90);
    }
    
    // Maintenance History
    if (device.maintenanceHistory.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Maintenance History', 20, 20);
      
      const tableData = device.maintenanceHistory.map(record => [
        new Date(record.date).toLocaleDateString(),
        record.type,
        record.description,
        record.cost ? `$${record.cost}` : '-',
        record.serviceProvider || '-'
      ]);
      
      (doc as any).autoTable({
        startY: 30,
        head: [['Date', 'Type', 'Description', 'Cost', 'Service Provider']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });
    }
    
    // Notes
    if (device.notes) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Notes', 20, 20);
      doc.setFontSize(12);
      
      const splitNotes = doc.splitTextToSize(device.notes, 170);
      doc.text(splitNotes, 20, 30);
    }
    
    // Save the PDF
    doc.save(`${device.manufacturer}-${device.model}-warranty.pdf`);
  };

  return (
    <Button
      onClick={generatePDF}
      className="flex items-center gap-2"
      variant="outline"
    >
      <FileDown className="w-4 h-4" />
      Export PDF
    </Button>
  );
} 