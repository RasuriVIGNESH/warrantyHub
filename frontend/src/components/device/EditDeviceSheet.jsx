// src/components/device/EditDeviceSheet.jsx

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '../ui/Sheet';

// A simple form field component for clean layout
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export function EditDeviceSheet({ isOpen, setIsOpen, device, onSave }) {
  // State to manage the form data
  const [formData, setFormData] = useState(device);

  // When the 'device' prop changes (e.g., user selects a different device),
  // reset the form data to match the new device.
  useEffect(() => {
    setFormData(device);
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Pass the updated form data back to the parent to be saved
    onSave(formData);
  };
  
  // Helper to format date for the input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit {device.name}</SheetTitle>
          <SheetDescription>
            Make changes to your device details here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        
        {/* New, clean form layout */}
        <div className="py-6 px-1 space-y-4">
          <FormField label="Device Name">
            <Input name="name" value={formData.name || ''} onChange={handleChange} />
          </FormField>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Manufacturer">
              <Input name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} />
            </FormField>
            <FormField label="Model">
              <Input name="model" value={formData.model || ''} onChange={handleChange} />
            </FormField>
          </div>

          <FormField label="Serial Number">
            <Input name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Purchase Date">
              <Input type="date" name="purchaseDate" value={formatDateForInput(formData.purchaseDate)} onChange={handleChange} />
            </FormField>
            <FormField label="Warranty End Date">
              <Input type="date" name="warrantyEndDate" value={formatDateForInput(formData.warrantyEndDate)} onChange={handleChange} />
            </FormField>
          </div>
          
           <FormField label="Purchase Price">
              <Input type="number" name="purchasePrice" value={formData.purchasePrice || ''} onChange={handleChange} />
            </FormField>

          <FormField label="Notes">
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md bg-transparent dark:border-gray-600 focus:border-primary focus:ring-primary"
            />
          </FormField>
        </div>
        
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}