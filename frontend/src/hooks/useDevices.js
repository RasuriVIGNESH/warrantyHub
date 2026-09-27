import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import deviceService from '../services/deviceService';


const STATUS_MAP = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  EXPIRING_SOON: 'expiring-soon',
  PENDING: 'pending',
};

function normalizeDevice(device) {
  if (!device) return device;
  return {
    ...device,
    warrantyStatus: STATUS_MAP[device.warrantyStatus] || device.warrantyStatus,
    documents: device.documents || [],
    maintenanceHistory: device.maintenanceHistory || [],
  };
}
const deviceKeys = {
  all: ['devices'],
  detail: (id) => ['devices', id],
  documents: (id) => ['devices', id, 'documents'],
};

// ---- Queries --------------------------------------------------------------

export function useDevicesQuery() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: async () => {
      const data = await deviceService.getAllDevices();
      const list = Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
      return list.map(normalizeDevice);
    },
    enabled: isAuthenticated,
  });
}

export function useDeviceQuery(deviceId) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: async () => normalizeDevice(await deviceService.getDeviceById(deviceId)),
    enabled: isAuthenticated && !!deviceId,
    // Paint instantly with whatever we already have for this device from the
    // devices-list cache (e.g. the user just came from /devices), while this
    // query fetches the authoritative single-device record in the background.
    initialData: () => {
      const list = queryClient.getQueryData(deviceKeys.all);
      return list?.find((d) => d.id === deviceId);
    },
    initialDataUpdatedAt: () => queryClient.getQueryState(deviceKeys.all)?.dataUpdatedAt,
  });
}

export function useDocumentsQuery(deviceId) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: deviceKeys.documents(deviceId),
    queryFn: async () => {
      const docs = await deviceService.getDocuments(deviceId);
      return Array.isArray(docs) ? docs : [];
    },
    enabled: isAuthenticated && !!deviceId,
  });
}

// ---- Mutations --------------------------------------------------------------
// Each one updates the relevant cache entries directly on success, so every
// page reading that data re-renders with the fresh value with no extra
// network round-trip.

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ deviceData, file }) => {
      const newDevice = normalizeDevice(await deviceService.createDevice(deviceData));
      if (file && newDevice.id) {
        await deviceService.uploadDocument(newDevice.id, file);
      }
      return newDevice;
    },
    onSuccess: (newDevice) => {
      queryClient.setQueryData(deviceKeys.all, (old = []) => [...old, newDevice]);
    },
  });
}

export function useUpdateDevice(deviceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deviceData) => normalizeDevice(await deviceService.updateDevice(deviceId, deviceData)),
    onSuccess: (updated) => {
      queryClient.setQueryData(deviceKeys.detail(deviceId), (old) => ({ ...old, ...updated }));
      queryClient.setQueryData(deviceKeys.all, (old = []) =>
        old.map((d) => (d.id === deviceId ? { ...d, ...updated } : d))
      );
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId) => deviceService.deleteDevice(deviceId),
    onSuccess: (_result, deviceId) => {
      queryClient.setQueryData(deviceKeys.all, (old = []) => old.filter((d) => d.id !== deviceId));
      queryClient.removeQueries({ queryKey: deviceKeys.detail(deviceId) });
      queryClient.removeQueries({ queryKey: deviceKeys.documents(deviceId) });
    },
  });
}

export function useUploadDocuments(deviceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (files) => {
      await Promise.all(files.map((file) => deviceService.uploadDocument(deviceId, file)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.documents(deviceId) });
    },
  });
}

export function useDeleteDocument(deviceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => deviceService.deleteDocument(deviceId, documentId),
    onSuccess: (_result, documentId) => {
      queryClient.setQueryData(deviceKeys.documents(deviceId), (old = []) =>
        old.filter((doc) => doc.id !== documentId)
      );
    },
  });
}

export function useAddMaintenanceRecord(deviceId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (record) => deviceService.addMaintenanceRecord(deviceId, record),
    onSuccess: (updatedDevice) => {
      queryClient.setQueryData(deviceKeys.detail(deviceId), updatedDevice);
      queryClient.setQueryData(deviceKeys.all, (old = []) =>
        old.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
    },
  });
}

// Opens a document's external fileUrl - not a backend call, just a helper
// kept alongside the rest of the device data logic.
export function openDocument(document) {
  if (document?.fileUrl) {
    window.open(document.fileUrl, '_blank', 'noopener,noreferrer');
  } else {
    console.warn('Document has no fileUrl to open:', document);
  }
}