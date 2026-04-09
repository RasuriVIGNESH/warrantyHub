import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useDevices } from '../../hooks/useDevices';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { DeviceTypeSelector } from '../../components/devices/DeviceTypeSelector';

// Utility to format date as YYYY-MM-DD
function formatDateForBackend(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function AddDevice() {
  const navigate = useNavigate();
  const { createDevice } = useDevices();
  const [loading, setLoading] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    purchaseDate: '',
    warrantyPeriod: '',
    purchasePrice: '',
    warrantyDocument: null,
    notes: '',
  });

  const handleDeviceTypeSelect = (deviceType) => {
    setSelectedDeviceType(deviceType);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('warrantyDocument', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Calculate warranty end date based on warranty period
      const purchaseDate = new Date(formData.purchaseDate);
      const warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setMonth(purchaseDate.getMonth() + parseInt(formData.warrantyPeriod));

      const deviceData = {
        ...formData,
        type: selectedDeviceType.id,
        purchaseDate: formatDateForBackend(formData.purchaseDate),
        warrantyEndDate: formatDateForBackend(warrantyEndDate),
        warrantyStatus: 'active',
      };

      await createDevice(deviceData);
      navigate('/devices');
    } catch (error) {
      console.error('Failed to create device:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] relative bg-white dark:bg-gray-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] overflow-y-auto">
        <button
          onClick={() => navigate('/devices')}
          className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add New Device
          </h1>

          {!selectedDeviceType ? (
            <div className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
              <DeviceTypeSelector onSelect={handleDeviceTypeSelect} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device Name*
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={`e.g., My ${selectedDeviceType.name}`}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Brand*
                  </label>
                  <Input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    placeholder="e.g., Samsung"
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date*
                  </label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Period (months)*
                  </label>
                  <Input
                    type="number"
                    value={formData.warrantyPeriod}
                    onChange={(e) => handleChange('warrantyPeriod', e.target.value)}
                    placeholder="e.g., 12"
                    required
                    min="1"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Price
                  </label>
                  <Input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleChange('purchasePrice', e.target.value)}
                    placeholder="e.g., 499.99"
                    step="0.01"
                    min="0"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Document
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-white
                      hover:file:cursor-pointer hover:file:bg-primary/90
                      dark:file:bg-primary dark:file:text-white
                      dark:hover:file:bg-primary/90
                      py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional notes about the device..."
                  className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-gray-900 dark:text-white py-2.5 px-4"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDeviceType(null)}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                >
                  Add Device
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
} 