import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MaintenanceRecord, Device } from '../../types/device';
import { Plus, Wrench as Tool, Calendar, DollarSign } from 'lucide-react';

interface MaintenanceHistoryProps {
  device: Device;
  onAddRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
}

export function MaintenanceHistory({ device, onAddRecord }: MaintenanceHistoryProps) {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'maintenance' as const,
    description: '',
    cost: '',
    serviceProvider: '',
    partsReplaced: '',
    nextScheduledDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      ...newRecord,
      cost: newRecord.cost ? parseFloat(newRecord.cost) : undefined,
      partsReplaced: newRecord.partsReplaced ? newRecord.partsReplaced.split(',').map(p => p.trim()) : undefined
    });
    setIsAddingRecord(false);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'maintenance',
      description: '',
      cost: '',
      serviceProvider: '',
      partsReplaced: '',
      nextScheduledDate: ''
    });
  };

  const formInputClasses = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Maintenance History
        </h2>
        <Button
          onClick={() => setIsAddingRecord(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </Button>
      </div>

      {isAddingRecord && (
        <Card 
          className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          onClick={() => {}}
          clickable={false}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className={formInputClasses}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
                  className={formInputClasses}
                  required
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  className={formInputClasses}
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost
                </label>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service Provider
                </label>
                <input
                  type="text"
                  value={newRecord.serviceProvider}
                  onChange={(e) => setNewRecord({ ...newRecord, serviceProvider: e.target.value })}
                  className={formInputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Parts Replaced
                </label>
                <input
                  type="text"
                  value={newRecord.partsReplaced}
                  onChange={(e) => setNewRecord({ ...newRecord, partsReplaced: e.target.value })}
                  className={formInputClasses}
                  placeholder="Comma separated list"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Next Scheduled Date
                </label>
                <input
                  type="date"
                  value={newRecord.nextScheduledDate}
                  onChange={(e) => setNewRecord({ ...newRecord, nextScheduledDate: e.target.value })}
                  className={formInputClasses}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddingRecord(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={() => {}}
              >
                Save Record
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {device.maintenanceHistory.map((record) => (
          <Card 
            key={record.id} 
            className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            onClick={() => {}}
            clickable={false}
          >
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
                <p className="mt-1 text-gray-600 dark:text-gray-300">
                  {record.description}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {record.cost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        ₹{record.cost.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {record.serviceProvider && (
                    <div className="flex items-center gap-2">
                      <Tool className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {record.serviceProvider}
                      </span>
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