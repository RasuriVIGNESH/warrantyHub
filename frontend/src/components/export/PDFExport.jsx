import { Button } from '../ui/Button';
import { FileDown } from 'lucide-react';
import { jsPDF as JsPDF } from 'jspdf';
import { default as autoTable } from 'jspdf-autotable';

export function PDFExport({ device }) {
  // Helper function to check if a value is empty/null/undefined
  const isEmpty = (value) => {
    return value === null || value === undefined || value === '' || value === 'Not provided' || value === 'Not specified';
  };

  // Helper function to filter out empty data
  const filterEmptyData = (data) => {
    return data.filter(([label, value]) => !isEmpty(value));
  };

  // Device icon drawing function
  const addDeviceIcon = async (doc, device, x, y, size = 20) => {
    const iconMap = {
      'laptop': 'laptop',
      'macbook': 'laptop',
      'phone': 'phone',
      'smartphone': 'phone',
      'tablet': 'tablet',
      'ipad': 'tablet',
      'tv': 'tv',
      'smart-tv': 'tv',
      'desktop': 'desktop',
      'desktop-pc': 'desktop',
      'printer': 'printer',
      'scanner': 'printer'
    };
  
    const normalizedCategory = device.category?.toLowerCase().replace(/\s+/g, '-');
    let iconName = iconMap[normalizedCategory] || 'default';
  
    const model = device.model?.toLowerCase();
    if (!iconMap[normalizedCategory]) {
      if (model?.includes('macbook')) iconName = 'laptop';
      if (model?.includes('iphone')) iconName = 'phone';
      if (model?.includes('tv')) iconName = 'tv';
    }
  
    try {
      const imgUrl = `/device-icons/${iconName}.png`;
      const img = await preloadImage(imgUrl);
      
      if (img) {
        doc.addImage(img, 'PNG', x, y, size, size);
      } else {
        throw new Error('Image failed to load');
      }
    } catch (error) {
      console.error('Error loading device icon:', error);
      // Modern fallback icon
      doc.setFillColor(100, 116, 139);
      doc.roundedRect(x, y, size, size, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text('DEV', x + size/2 - 6, y + size/2 + 2);
    }
  };

  const preloadImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleExport = async () => {
    try {
      const doc = new JsPDF();
      
      // Modern gradient header
      doc.setFillColor(55, 65, 81); // Dark slate
      doc.rect(0, 0, 220, 45, 'F');
      
      // Add subtle gradient effect with overlays
      doc.setFillColor(79, 172, 254, 0.1);
      doc.rect(0, 0, 220, 45, 'F');
      
      // Brand section
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(32);
      doc.setFont(undefined, 'bold');
      doc.text('WarrantyHub', 20, 25);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Professional Device Management', 20, 33);
      
      // Date stamp
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 40);
      
      // Modern device header with improved styling
      const deviceTitle = device.name ? 
        `${device.name}` :
        `${device.manufacturer || 'Unknown'} ${device.model || 'Device'}`;

      // Main device card with shadow effect
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.roundedRect(15, 60, 180, 50, 5, 5, 'FD');
      
      // Add subtle shadow
      doc.setFillColor(0, 0, 0, 0.05);
      doc.roundedRect(16, 61, 180, 50, 5, 5, 'F');
      
      // Device icon with modern styling
      doc.setFillColor(79, 172, 254);
      doc.roundedRect(25, 70, 30, 30, 15, 15, 'F');
      
      await addDeviceIcon(doc, device, 32, 77, 16);
      
      // Device title and info
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text(deviceTitle, 65, 80);
      
      if (device.manufacturer && device.model) {
        doc.setTextColor(75, 85, 99);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`${device.manufacturer} • ${device.model}`, 65, 87);
      }
      
      // Warranty status badge with better design
      if (device.warrantyStatus && !isEmpty(device.warrantyStatus)) {
        const statusColors = {
          'active': [34, 197, 94],
          'expiring-soon': [249, 115, 22],
          'expired': [239, 68, 68]
        };
        
        const statusColor = statusColors[device.warrantyStatus] || [107, 114, 128];
        doc.setFillColor(...statusColor);
        doc.roundedRect(65, 95, 50, 10, 5, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        const statusText = device.warrantyStatus.replace('-', ' ').toUpperCase();
        doc.text(statusText, 67, 102);
      }

      let currentY = 130;

      // Prepare data arrays with conditional rendering
      const basicInfoData = [
        ['Serial Number', device.serialNumber],
        ['Category', device.category],
        ['Location', device.room],
        ['Priority', device.priority],
        ['Brand', device.manufacturer]
      ];

      const warrantyInfoData = [
        ['Purchase Date', device.purchaseDate ? new Date(device.purchaseDate).toLocaleDateString() : null],
        ['Purchase Price', device.purchasePrice ? `$${device.purchasePrice.toFixed(2)}` : null],
        ['Warranty Provider', device.warrantyProvider],
        ['Warranty End Date', device.warrantyEndDate ? new Date(device.warrantyEndDate).toLocaleDateString() : null],
        ['Warranty Duration', device.warrantyDuration]
      ];

      // Filter out empty data
      const filteredBasicInfo = filterEmptyData(basicInfoData);
      const filteredWarrantyInfo = filterEmptyData(warrantyInfoData);

      // Only render cards if they have data
      if (filteredBasicInfo.length > 0) {
        // Basic Information Card with modern design
        const cardHeight = Math.max(60, filteredBasicInfo.length * 12 + 25);
        
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, currentY, 85, cardHeight, 5, 5, 'FD');
        
        // Card header with gradient
        doc.setFillColor(59, 130, 246);
        doc.roundedRect(15, currentY, 85, 18, 5, 5, 'F');
        doc.setFillColor(59, 130, 246);
        doc.rect(15, currentY + 13, 85, 5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('DEVICE INFORMATION', 18, currentY + 12);

        // Card content
        doc.setTextColor(17, 24, 39);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        let itemY = currentY + 28;
        
        filteredBasicInfo.forEach(([label, value], index) => {
          if (index % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, itemY - 3, 85, 12, 'F');
          }
          doc.setTextColor(75, 85, 99);
          doc.setFontSize(8);
          doc.text(label.toUpperCase(), 18, itemY + 2);
          doc.setTextColor(17, 24, 39);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.text(String(value), 18, itemY + 7);
          doc.setFont(undefined, 'normal');
          itemY += 12;
        });
      }

      if (filteredWarrantyInfo.length > 0) {
        // Warranty Information Card
        const cardHeight = Math.max(60, filteredWarrantyInfo.length * 12 + 25);
        
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(110, currentY, 85, cardHeight, 5, 5, 'FD');
        
        // Card header with different color
        doc.setFillColor(16, 185, 129);
        doc.roundedRect(110, currentY, 85, 18, 5, 5, 'F');
        doc.setFillColor(16, 185, 129);
        doc.rect(110, currentY + 13, 85, 5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('WARRANTY DETAILS', 113, currentY + 12);

        doc.setTextColor(17, 24, 39);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        let itemY = currentY + 28;
        
        filteredWarrantyInfo.forEach(([label, value], index) => {
          if (index % 2 === 0) {
            doc.setFillColor(240, 253, 244);
            doc.rect(110, itemY - 3, 85, 12, 'F');
          }
          doc.setTextColor(75, 85, 99);
          doc.setFontSize(8);
          doc.text(label.toUpperCase(), 113, itemY + 2);
          doc.setTextColor(17, 24, 39);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          const truncatedValue = String(value).length > 20 ? String(value).substring(0, 17) + '...' : String(value);
          doc.text(truncatedValue, 113, itemY + 7);
          doc.setFont(undefined, 'normal');
          itemY += 12;
        });
      }

      currentY += Math.max(90, Math.max(filteredBasicInfo.length, filteredWarrantyInfo.length) * 12 + 50);

      // Maintenance History Section - only if data exists
      if (device.maintenanceHistory && device.maintenanceHistory.length > 0) {
        // Modern section header
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(15, currentY, 180, 20, 5, 5, 'FD');
        
        doc.setFillColor(168, 85, 247);
        doc.roundedRect(15, currentY, 180, 20, 5, 5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('MAINTENANCE HISTORY', 20, currentY + 13);

        // Filter maintenance records to remove empty data
        const filteredMaintenance = device.maintenanceHistory.filter(record => {
          return record.date || record.type || record.description || record.cost || record.serviceProvider;
        });

        if (filteredMaintenance.length > 0) {
          const maintenanceData = filteredMaintenance.map(record => {
            const row = [];
            if (record.date) row.push(new Date(record.date).toLocaleDateString());
            else row.push('N/A');
            
            if (record.type) row.push(record.type);
            else row.push('N/A');
            
            if (record.description) row.push(record.description);
            else row.push('N/A');
            
            if (record.cost) row.push(`$${record.cost.toFixed(2)}`);
            else row.push('No Cost');
            
            if (record.serviceProvider) row.push(record.serviceProvider);
            else row.push('N/A');
            
            return row;
          });

          autoTable(doc, {
            startY: currentY + 25,
            head: [['Date', 'Type', 'Description', 'Cost', 'Provider']],
            body: maintenanceData,
            theme: 'grid',
            headStyles: {
              fillColor: [168, 85, 247],
              textColor: [255, 255, 255],
              fontSize: 10,
              fontStyle: 'bold'
            },
            styles: {
              fontSize: 9,
              cellPadding: 6,
              overflow: 'linebreak',
              textColor: [17, 24, 39]
            },
            alternateRowStyles: {
              fillColor: [249, 250, 251]
            },
            columnStyles: {
              0: { cellWidth: 28 },
              1: { cellWidth: 25 },
              2: { cellWidth: 65 },
              3: { cellWidth: 25 },
              4: { cellWidth: 37 }
            },
            didDrawPage: (data) => {
              currentY = data.cursor.y;
            }
          });
        }
      }

      // Notes Section - only if notes exist
      if (device.notes && !isEmpty(device.notes)) {
        currentY += 20;
        const notesHeight = Math.max(50, Math.ceil(device.notes.length / 80) * 10 + 30);
        
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(15, currentY, 180, notesHeight, 5, 5, 'FD');
        
        // Notes header
        doc.setFillColor(245, 158, 11);
        doc.roundedRect(15, currentY, 180, 18, 5, 5, 'F');
        doc.setFillColor(245, 158, 11);
        doc.rect(15, currentY + 13, 180, 5, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('ADDITIONAL NOTES', 18, currentY + 12);
        
        doc.setTextColor(55, 65, 81);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        const splitNotes = doc.splitTextToSize(device.notes, 170);
        doc.text(splitNotes, 18, currentY + 30);
      }

      // Footer with modern styling
      const pageHeight = doc.internal.pageSize.height;
      doc.setFillColor(249, 250, 251);
      doc.rect(0, pageHeight - 25, 220, 25, 'F');
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text('This document was generated automatically by WarrantyHub', 20, pageHeight - 15);
      doc.text(`© ${new Date().getFullYear()} WarrantyHub. All rights reserved.`, 20, pageHeight - 8);

      // Save the PDF
      const filename = `${device.manufacturer || 'Device'}-${device.model || 'Report'}-warranty-details.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="flex items-center gap-2"
      type="button"
    >
      <FileDown className="w-4 h-4" />
      Export PDF
    </Button>
  );
}