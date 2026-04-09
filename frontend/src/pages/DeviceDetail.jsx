import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceDetail } from '../hooks/useDeviceData'; 

// Components
import { DeviceHeader } from '../components/device/DeviceHeader';
import { EditDeviceDialog } from '../components/device/EditDeviceDialog';
import { DocumentPreview } from '../components/devices/DocumentPreview';
import { FileUploadZone } from '../components/device/FileUploadZone';
import { MaintenanceHistory } from '../components/maintenance/MaintenanceHistory';
import { WarrantyStatusPanel } from '../components/device/WarrantyStatusPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';


// Icons
import { ArrowLeft } from 'lucide-react';

const TABS = ['Overview', 'Documents', 'Maintenance'];

export function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✨ FIX: Changed 'devices' to 'device' (singular)
  const { 
    device, 
    documents, 
    loading, 
    error, 
    updateDevice, 
    uploadDocuments, 
    downloadDocument,
    // addMaintenanceRecord, // Assuming these will be added to the hook later
  } = useDeviceDetail(id);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleSave = async (editedData) => {
    // ✨ FIX: The hook already knows the ID, so we only pass the new data
    await updateDevice(editedData);
  };
  
  const handleUpload = async (files) => {
    if (!id || files.length === 0) return;
    // ✨ FIX: The hook already knows the ID
    await uploadDocuments(files);
  };

  // Placeholder functions until they are moved into the hook
  const addMaintenanceRecord = () => console.log("Add maintenance logic placeholder");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Error</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{error || "Could not find the requested device."}</p>
        <Button onClick={() => navigate('/devices')} className="mt-4">Back to Devices</Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <Button variant="ghost" className="text-gray-900 dark:text-white -ml-4" onClick={() => navigate('/devices')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Devices
      </Button>

      <DeviceHeader device={device} onEditClick={() => setIsEditDialogOpen(true)} />

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <Card.Header><Card.Title className="text-gray-900 dark:text-white">Device Details</Card.Title></Card.Header>
                <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</h4>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">{device.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Warranty Provider</h4>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">{device.warrantyProvider || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Purchase Price</h4>
                    <p className="mt-1 font-semibold text-gray-800 dark:text-white">{device.purchasePrice ? `₹${Number(device.purchasePrice).toLocaleString('en-IN')}` : 'N/A'}</p>
                  </div>
                </Card.Content>
              </Card>
               <Card>
                <Card.Header><Card.Title className="text-gray-900 dark:text-white">Notes</Card.Title></Card.Header>
                <Card.Content>
                  <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-300">{device.notes || 'No notes provided.'}</p>
                </Card.Content>
              </Card>
            </div>
            <div className="space-y-6">
              <WarrantyStatusPanel device={device} />
              <Card>
                <Card.Header><Card.Title className="text-gray-900 dark:text-white">Warranty Timeline</Card.Title></Card.Header>
                <Card.Content>
                  <div className="relative pl-6">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-200 dark:border-gray-700"></div>
                    <div className="space-y-8">
                      <div className="relative flex items-center">
                        <div className="absolute -left-5 h-5 w-5 rounded-full bg-green-500 border-4 border-white dark:border-gray-900"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">Purchase Date</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(device.purchaseDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute -left-5 h-5 w-5 rounded-full bg-red-500 border-4 border-white dark:border-gray-900"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-white">Warranty Expires</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(device.warrantyEndDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <Card>
            <Card.Header><Card.Title className="text-gray-900 dark:text-white">Manage Documents</Card.Title></Card.Header>
            <Card.Content className="space-y-6">
              <DocumentPreview documents={documents} onDocumentClick={downloadDocument} />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Add More Documents</h4>
                <FileUploadZone onUpload={handleUpload} maxFiles={5} />
              </div>
            </Card.Content>
          </Card>
        )}

        {activeTab === 'Maintenance' && (
          <MaintenanceHistory device={device} onAddRecord={addMaintenanceRecord} />
        )}
      </div>

      <EditDeviceDialog 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen} 
        device={device}
        onSave={handleSave}
      />
    </div>
  );
}