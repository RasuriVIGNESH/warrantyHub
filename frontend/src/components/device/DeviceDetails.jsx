import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { 
  Package, 
  Calendar, 
  Building, 
  Hash, 
  Edit2, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FileUploadZone } from './FileUploadZone';

export function DeviceDetails({ 
  device, 
  onUpdate, 
  onDelete,
  onUploadFiles,
  onDeleteFile,
  isEditing,
  setIsEditing 
}) {
  const [editedDevice, setEditedDevice] = useState(device);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(editedDevice);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDevice(device);
    setIsEditing(false);
  };

  const warrantyStatusColors = {
    'active': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    'expiring-soon': 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    'expired': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    'unknown': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
  };

  return (
    <div className="space-y-6">
      {/* Device Information */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <Card.Title>Device Information</Card.Title>
              <Card.Description>Basic device and warranty details</Card.Description>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Device Name
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={editedDevice.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    {device.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Manufacturer
                </label>
                {isEditing ? (
                  <Input
                    name="manufacturer"
                    value={editedDevice.manufacturer}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    {device.manufacturer}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Model
                </label>
                {isEditing ? (
                  <Input
                    name="model"
                    value={editedDevice.model}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Hash className="h-4 w-4 mr-2 text-gray-400" />
                    {device.model}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Warranty Status
                </label>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${warrantyStatusColors[device.warrantyStatus]}`}>
                  {device.warrantyStatus.replace('-', ' ')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Warranty End Date
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    name="warrantyEndDate"
                    value={editedDevice.warrantyEndDate?.split('T')[0]}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {device.warrantyEndDate
                      ? format(new Date(device.warrantyEndDate), 'MMM d, yyyy')
                      : 'Not specified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serial Number
                </label>
                {isEditing ? (
                  <Input
                    name="serialNumber"
                    value={editedDevice.serialNumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="flex items-center text-gray-900 dark:text-gray-100">
                    <Hash className="h-4 w-4 mr-2 text-gray-400" />
                    {device.serialNumber || 'Not specified'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Documents */}
      <Card>
        <Card.Header>
          <Card.Title>Documents</Card.Title>
          <Card.Description>
            Upload and manage warranty documents, receipts, and manuals
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <FileUploadZone onUpload={onUploadFiles} />

          {device.documents?.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Uploaded Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {device.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {doc.type.startsWith('image/') ? (
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => onDeleteFile(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete document</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

DeviceDetails.propTypes = {
  device: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    manufacturer: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    warrantyStatus: PropTypes.oneOf(['active', 'expiring-soon', 'expired', 'unknown']).isRequired,
    warrantyEndDate: PropTypes.string,
    serialNumber: PropTypes.string,
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUploadFiles: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
}; 