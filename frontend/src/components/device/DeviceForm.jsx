import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { DEVICE_TYPES, WARRANTY_UNITS } from '../../utils/warrantyUtils';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function DeviceForm({ device, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      brand: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyDuration: '',
      warrantyUnit: WARRANTY_UNITS.YEARS,
      ...device,
    },
  });

  useEffect(() => {
    if (device) {
      reset(device);
    }
  }, [device, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Device Name"
          error={errors.name?.message}
          {...register('name', {
            required: 'Device name is required',
          })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Device Type
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            {...register('type', {
              required: 'Device type is required',
            })}
          >
            <option value="">Select a type</option>
            {Object.entries(DEVICE_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <Input
          label="Brand"
          error={errors.brand?.message}
          {...register('brand', {
            required: 'Brand is required',
          })}
        />

        <Input
          label="Model"
          error={errors.model?.message}
          {...register('model')}
        />

        <Input
          label="Serial Number"
          error={errors.serialNumber?.message}
          {...register('serialNumber')}
        />

        <Input
          type="date"
          label="Purchase Date"
          error={errors.purchaseDate?.message}
          {...register('purchaseDate', {
            required: 'Purchase date is required',
          })}
        />

        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Warranty Duration"
            min="1"
            error={errors.warrantyDuration?.message}
            {...register('warrantyDuration', {
              required: 'Warranty duration is required',
              min: {
                value: 1,
                message: 'Duration must be at least 1',
              },
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Duration Unit
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              {...register('warrantyUnit')}
            >
              <option value={WARRANTY_UNITS.YEARS}>Years</option>
              <option value={WARRANTY_UNITS.MONTHS}>Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" isLoading={isSubmitting}>
          {device ? 'Update Device' : 'Add Device'}
        </Button>
      </div>
    </form>
  );
}

DeviceForm.propTypes = {
  device: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    serialNumber: PropTypes.string,
    purchaseDate: PropTypes.string,
    warrantyDuration: PropTypes.number,
    warrantyUnit: PropTypes.oneOf(Object.values(WARRANTY_UNITS)),
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
}; 