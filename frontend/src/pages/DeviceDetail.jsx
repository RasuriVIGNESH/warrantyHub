import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceDetail } from '../hooks/useDeviceData';
import { useFileUpload } from '../hooks/useFileUpload';

// UI
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../components/ui/Dialog';

// Icons
import {
  ArrowLeft, Package, Edit, Trash2, Upload, X, FileText, Image as ImageIcon,
  Download, ShieldCheck, Clock, ShieldOff, Wrench, ShoppingCart, ExternalLink,
  Plus, Wrench as Tool, Calendar, DollarSign,
} from 'lucide-react';

import { useDevices } from '../hooks/useDevices';

const TABS = ['Overview', 'Documents', 'Maintenance'];

const statusConfig = {
  active: { label: 'Active', color: 'success' },
  'expiring-soon': { label: 'Expiring Soon', color: 'warning' },
  expired: { label: 'Expired', color: 'error' },
};

// ============================================================================
// 🔽 Local sub-components below: all of these were only ever used on this
// page (DeviceDetail), so instead of separate files each one lives here.
// ============================================================================

function DeviceHeader({ device, onEditClick }) {
  const navigate = useNavigate();
  const { deleteDevice } = useDevices();
  const normalizedStatusKey = (device.warrantyStatus || '').toLowerCase().replace(' ', '-');
  const status = statusConfig[normalizedStatusKey] || { label: 'Unknown', color: 'default' };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${device.name}? This action is irreversible.`)) {
      try {
        await deleteDevice(device.id);
        navigate('/devices');
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Package className="w-8 h-8 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge color={status.color}>{status.label}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              • Warranty ends {new Date(device.warrantyEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </Button>
        <Button variant="outline" onClick={onEditClick}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Device
        </Button>
      </div>
    </div>
  );
}

function EditFormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function EditDeviceDialog({ isOpen, setIsOpen, device, onSave }) {
  const [formData, setFormData] = useState(device);

  useEffect(() => {
    setFormData(device);
  }, [device, isOpen]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {device.name}</DialogTitle>
          <DialogDescription>
            Make changes to your device details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <EditFormField label="Device Name">
            <Input name="name" value={formData.name || ''} onChange={handleChange} />
          </EditFormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditFormField label="Manufacturer">
              <Input name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} />
            </EditFormField>
            <EditFormField label="Model">
              <Input name="model" value={formData.model || ''} onChange={handleChange} />
            </EditFormField>
          </div>

          <EditFormField label="Serial Number">
            <Input name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} />
          </EditFormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditFormField label="Purchase Date">
              <Input type="date" name="purchaseDate" value={formatDateForInput(formData.purchaseDate)} onChange={handleChange} />
            </EditFormField>
            <EditFormField label="Warranty End Date">
              <Input type="date" name="warrantyEndDate" value={formatDateForInput(formData.warrantyEndDate)} onChange={handleChange} />
            </EditFormField>
          </div>

          <EditFormField label="Purchase Price">
            <Input type="number" name="purchasePrice" value={formData.purchasePrice || ''} onChange={handleChange} />
          </EditFormField>

          <EditFormField label="Notes">
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md bg-transparent dark:border-gray-600 focus:border-primary focus:ring-primary"
            />
          </EditFormField>
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

function FilePreview({ file, progress, onRemove, uploading }) {
  const isImage = file.file.type.startsWith('image/');
  const isPDF = file.file.type === 'application/pdf';
  const uploadProgress = progress?.[file.id] || 0;

  return (
    <div className="relative group">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
          {isImage && file.preview ? (
            <img src={file.preview} alt={file.file.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              {isPDF ? (
                <FileText className="h-12 w-12 text-gray-400" />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-16 h-16 relative">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#E5E7EB" strokeWidth="3"
                    className="stroke-current text-gray-200 dark:text-gray-600"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#3B82F6" strokeWidth="3"
                    strokeDasharray={`${uploadProgress}, 100`}
                    className="stroke-current text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {`${uploadProgress}%`}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.file.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>

        {!uploading && (
          <button
            onClick={() => onRemove(file.id)}
            className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </button>
        )}
      </div>
    </div>
  );
}

function FileUploadZone({ onUpload, maxFiles = 5 }) {
  const dropZoneRef = { current: null };
  const {
    files, uploading, error, progress, handleFiles, uploadFiles, removeFile, clearFiles,
  } = useFileUpload({ onUpload, maxFiles });

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); };

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-colors duration-150 ease-in-out"
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF, JPG, JPEG, PNG up to 5MB</p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Maximum {maxFiles} files</p>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">{error}</div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <FilePreview key={file.id} file={file} progress={progress} onRemove={removeFile} uploading={uploading} />
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={clearFiles} disabled={uploading}>Clear All</Button>
            <Button onClick={uploadFiles} isLoading={uploading} disabled={files.length === 0}>
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WarrantyStatusPanel({ device }) {
  const panelConfig = {
    active: {
      Icon: ShieldCheck,
      title: 'Warranty Active',
      description: "Your device is fully covered under the manufacturer's warranty. No action is needed at this time.",
      colorClasses: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      iconColor: 'text-green-600',
    },
    'expiring-soon': {
      Icon: Clock,
      title: 'Warranty Expiring Soon',
      description: 'Your warranty is ending soon. Review your options to ensure continued protection for your device.',
      colorClasses: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      iconColor: 'text-yellow-600',
    },
    expired: {
      Icon: ShieldOff,
      title: 'Warranty Expired',
      description: 'This device is no longer covered by its warranty. You are now responsible for the full cost of any repairs.',
      colorClasses: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300',
      iconColor: 'text-red-600',
    },
  };

  const normalizedStatus = (device.warrantyStatus || '').toLowerCase().replace(' ', '-');
  const config = panelConfig[normalizedStatus] || panelConfig.active;

  return (
    <Card className={`border-none ${config.colorClasses}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <config.Icon className={`w-8 h-8 flex-shrink-0 ${config.iconColor}`} />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{config.title}</h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{config.description}</p>
          </div>
        </div>

        {normalizedStatus === 'expiring-soon' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              Check for Extended Warranty
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <Wrench className="w-4 h-4 mr-2" />
              Schedule Final Check-up
            </Button>
          </div>
        )}

        {normalizedStatus === 'expired' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <Wrench className="w-4 h-4 mr-2" />
              Find a Repair Shop
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Look for Replacement
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function DocumentPreview({ documents, onDocumentClick }) {
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  if (!documents || documents.length === 0) return null;

  const handleDocumentClick = async (doc) => {
    const docId = doc?.id;
    if (docId) setDownloadingIds(prev => new Set([...prev, docId]));
    try {
      await onDocumentClick(doc);
    } finally {
      if (docId) setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Documents</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map((doc) => {
          const isDownloading = downloadingIds.has(doc.id);
          return (
            <div
              key={doc.id}
              onClick={() => !isDownloading && handleDocumentClick(doc)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 text-center transition-all hover:shadow-md hover:border-primary/50 ${
                isDownloading ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center h-24">
                {isDownloading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : (
                  <>
                    {(doc.name && (doc.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) ||
                      (doc.fileType && doc.fileType.startsWith('image/')))) ? (
                      doc.fileUrl ? (
                        <div className="w-full h-full p-2">
                          <img src={doc.fileUrl} alt={doc.name} loading="lazy" className="object-cover h-full w-full rounded-md" />
                        </div>
                      ) : (
                        <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-primary" />
                      )
                    ) : (
                      <FileText className="w-10 h-10 text-gray-400 group-hover:text-primary" />
                    )}
                  </>
                )}
              </div>
              <p className="mt-2 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                {isDownloading ? 'Downloading...' : doc.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MaintenanceHistory({ device, onAddRecord }) {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'maintenance',
    description: '',
    cost: '',
    serviceProvider: '',
    partsReplaced: '',
    nextScheduledDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecord({
      ...newRecord,
      cost: newRecord.cost ? parseFloat(newRecord.cost) : undefined,
      partsReplaced: newRecord.partsReplaced ? newRecord.partsReplaced.split(',').map(p => p.trim()) : undefined,
    });
    setIsAddingRecord(false);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'maintenance',
      description: '',
      cost: '',
      serviceProvider: '',
      partsReplaced: '',
      nextScheduledDate: '',
    });
  };

  const formInputClasses = 'mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Maintenance History</h2>
        <Button onClick={() => setIsAddingRecord(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Record
        </Button>
      </div>

      {isAddingRecord && (
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className={formInputClasses}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                  className={formInputClasses}
                  required
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  className={formInputClasses}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost</label>
                <input
                  type="number"
                  value={newRecord.cost}
                  onChange={(e) => setNewRecord({ ...newRecord, cost: e.target.value })}
                  className={formInputClasses}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Provider</label>
                <input
                  type="text"
                  value={newRecord.serviceProvider}
                  onChange={(e) => setNewRecord({ ...newRecord, serviceProvider: e.target.value })}
                  className={formInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parts Replaced</label>
                <input
                  type="text"
                  value={newRecord.partsReplaced}
                  onChange={(e) => setNewRecord({ ...newRecord, partsReplaced: e.target.value })}
                  className={formInputClasses}
                  placeholder="Comma separated list"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Scheduled Date</label>
                <input
                  type="date"
                  value={newRecord.nextScheduledDate}
                  onChange={(e) => setNewRecord({ ...newRecord, nextScheduledDate: e.target.value })}
                  className={formInputClasses}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsAddingRecord(false)}>Cancel</Button>
              <Button type="submit">Save Record</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {(device.maintenanceHistory || []).map((record) => (
          <Card key={record.id} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Tool className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-300">{record.description}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {record.cost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">₹{Number(record.cost).toFixed(2)}</span>
                    </div>
                  )}
                  {record.serviceProvider && (
                    <div className="flex items-center gap-2">
                      <Tool className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{record.serviceProvider}</span>
                    </div>
                  )}
                  {record.nextScheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Next: {new Date(record.nextScheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {record.partsReplaced && record.partsReplaced.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Parts replaced: {record.partsReplaced.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 🔼 End of local sub-components. The page itself starts here.
// ============================================================================

export function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    device,
    documents,
    loading,
    error,
    updateDevice,
    uploadDocuments,
    downloadDocument,
  } = useDeviceDetail(id);

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSave = async (editedData) => {
    await updateDevice(editedData);
  };

  const handleUpload = async (files) => {
    if (!id || files.length === 0) return;
    await uploadDocuments(files);
  };

  // Placeholder until this is wired up in the hook
  const addMaintenanceRecord = () => console.log('Add maintenance logic placeholder');

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
        <p className="text-gray-600 dark:text-gray-300 mt-2">{error || 'Could not find the requested device.'}</p>
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
