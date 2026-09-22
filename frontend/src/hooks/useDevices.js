import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import deviceService from '../services/deviceService';

// ============================================================================
// Single source of truth for all device/document/maintenance data-fetching.
// Everything goes through React Query so that:
//   - the same query key = one shared cache entry, read by every page that
//     needs it (Dashboard + Devices both read ['devices'], nothing here ever
//     fires two independent network calls for the same data)
//   - staleTime/gcTime (configured in App.jsx: 60s / 5min) means revisiting
//     a page you were just on serves cached data instantly, no refetch
//   - past staleTime, React Query serves the cached (stale) data immediately
//     AND refetches in the background, swapping in fresh data if it changed
//     - this *is* the "show cached data now, update if backend has changed
//       it" behavior, for free
//   - mutations (create/update/delete) patch the cache directly instead of
//     forcing a full list refetch, so the UI updates instantly
// ============================================================================

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
      return Array.isArray(data) ? data : (Array.isArray(data?.devices) ? data.devices : []);
    },
    enabled: isAuthenticated,
  });
}

export function useDeviceQuery(deviceId) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: deviceKeys.detail(deviceId),
    queryFn: () => deviceService.getDeviceById(deviceId),
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
      const newDevice = await deviceService.createDevice(deviceData);
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
    mutationFn: (deviceData) => deviceService.updateDevice(deviceId, deviceData),
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