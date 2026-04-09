// src/components/device/EditDeviceDialog.jsx

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../ui/Dialog'; // ✨ Import from Dialog instead of Sheet

// A simple form field component for clean layout
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export function EditDeviceDialog({ isOpen, setIsOpen, device, onSave }) {
  const [formData, setFormData] = useState(device);

  useEffect(() => {
    setFormData(device);
  }, [device, isOpen]); // Reset form if device changes or dialog re-opens

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };
  
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    // ✨ Use Dialog instead of Sheet
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {device.name}</DialogTitle>
          <DialogDescription>
            Make changes to your device details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
        <DialogClose onClick={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}