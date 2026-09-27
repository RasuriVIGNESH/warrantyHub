import { useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle2, ClipboardCopy, Download, FileText, FolderOpen, HeartPulse, MoreHorizontal, Plus, ShieldAlert, ShieldCheck, Upload, Wrench } from 'lucide-react';
import { useDeviceQuery, useDocumentsQuery, useAddMaintenanceRecord, useUploadDocuments, useDeleteDocument, openDocument } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';

const date = value => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not recorded';
const status = {
  active: { label: 'Protected', color: 'success' },
  'expiring-soon': { label: 'Expiring soon', color: 'warning' },
  expired: { label: 'Expired', color: 'danger' },
  pending: { label: 'Pending', color: 'secondary' },
};
export function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: device, isLoading } = useDeviceQuery(id);
  const { data: docs = [] } = useDocumentsQuery(id);
  const addMaintenance = useAddMaintenanceRecord(id);
  const uploadDocuments = useUploadDocuments(id);
  const deleteDocument = useDeleteDocument(id);
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState('overview');
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [record, setRecord] = useState({ type: 'Maintenance', description: '', date: new Date().toISOString().slice(0, 10), cost: '', serviceProvider: '', nextScheduledDate: '' });

  if (isLoading) {
    return (
        <div className="p-8">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
    );
  }

  if (!device) {
    return (
        <div className="p-8">
          <Card className="border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h1 className="font-semibold text-slate-950 dark:text-slate-100">Device not found</h1>
            <Link to="/devices" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Back to devices
            </Link>
          </Card>
        </div>
    );
  }

  const saveMaintenance = async () => {
    await addMaintenance.mutateAsync(record);
    setMaintenanceOpen(false);
    setRecord({ type: 'Maintenance', description: '', date: new Date().toISOString().slice(0, 10), cost: '', serviceProvider: '', nextScheduledDate: '' });
  };

  const handleFileSelected = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) await uploadDocuments.mutateAsync([file]);
  };

  return (
      <div className="min-h-screen bg-slate-50 px-4 py-5 transition-colors duration-300 dark:bg-slate-900 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <button
              onClick={() => navigate('/devices')}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to devices
          </button>

          <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex gap-4">
                <div className="rounded-2xl bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{device.name}</h1>
                    <Badge color={status[device.warrantyStatus]?.color}>{status[device.warrantyStatus]?.label}</Badge>
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">{device.manufacturer} · {device.model}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                    Coverage ends {date(device.warrantyEndDate)}{' '}
                    {device.daysRemaining >= 0 && `· ${device.daysRemaining} days remaining`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard?.writeText(`${device.name} · ${device.manufacturer} ${device.model} · Serial ${device.serialNumber}`)}
                    className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Copy details
                </Button>
                <Link
                    to="/claims"
                    className="inline-flex items-center justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Start claim
                </Link>
              </div>
            </div>
          </Card>

          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setTab('overview')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    tab === 'overview'
                        ? 'border-blue-700 text-blue-800 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              Overview
            </button>
            <button
                onClick={() => setTab('documents')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    tab === 'documents'
                        ? 'border-blue-700 text-blue-800 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              Documents{' '}
              <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
              {docs.length}
            </span>
            </button>
            <button
                onClick={() => setTab('maintenance')}
                className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    tab === 'maintenance'
                        ? 'border-blue-700 text-blue-800 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              Service history
            </button>
          </div>

          {tab === 'overview' && (
              <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-6">
                  <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Coverage health</h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          An action indicator based on your record quality and coverage.
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                            className={`text-3xl font-semibold ${
                                device.healthScore >= 80
                                    ? 'text-green-700 dark:text-green-400'
                                    : device.healthScore >= 60
                                        ? 'text-amber-700 dark:text-amber-400'
                                        : 'text-red-700 dark:text-red-400'
                            }`}
                        >
                          {device.healthScore}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">health score</p>
                      </div>
                    </div>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                      <div
                          className={`h-full rounded-full transition-all duration-500 ${
                              device.healthScore >= 80
                                  ? 'bg-green-600'
                                  : device.healthScore >= 60
                                      ? 'bg-amber-500'
                                      : 'bg-red-600'
                          }`}
                          style={{ width: `${device.healthScore}%` }}
                      />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Warranty provider</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{device.warrantyProvider}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Purchase price</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          ₹{Number(device.purchasePrice).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Serial number</p>
                        <p className="mt-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                          {device.serialNumber || 'Missing'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <HeartPulse className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                      <div>
                        <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">What to do next</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Keep this device claim-ready.</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-3">
                      {[
                        { done: Boolean(device.serialNumber), label: 'Serial number recorded' },
                        { done: Boolean(docs.length), label: 'Proof of purchase attached' },
                        { done: device.daysRemaining >= 0, label: 'Warranty is currently active' },
                      ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 text-sm">
                            <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                    item.done
                                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}
                            >
                              {item.done ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                            </div>
                            <span className={item.done ? 'text-slate-700 dark:text-slate-300' : 'font-medium text-amber-800 dark:text-amber-400'}>
                        {item.label}
                      </span>
                          </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Device details</h2>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Purchase date</dt>
                      <dd className="font-medium text-slate-900 dark:text-slate-100">{date(device.purchaseDate)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Warranty length</dt>
                      <dd className="font-medium text-slate-900 dark:text-slate-100">{device.warrantyDuration} months</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Category</dt>
                      <dd className="font-medium text-slate-900 dark:text-slate-100">{device.category}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-slate-500 dark:text-slate-400">Documents</dt>
                      <dd className="font-medium text-slate-900 dark:text-slate-100">{docs.length} attached</dd>
                    </div>
                  </dl>
                  <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Notes</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {device.notes || 'No notes added yet.'}
                    </p>
                  </div>
                </Card>
              </div>
          )}

          {tab === 'documents' && (
              <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Documents</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Keep the evidence you need in the same place as the device.
                    </p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelected} accept="image/*,.pdf" />
                  <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={uploadDocuments.isPending}
                      className="dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload document
                  </Button>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {docs.map(document => (
                      <div
                          key={document.id}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                      >
                        <div className="rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{document.name}</p>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {document.fileType} · {(document.fileSize / 1024).toFixed(0)} KB · Uploaded {date(document.uploadDate)}
                          </p>
                        </div>
                        <button
                            onClick={() => openDocument(document)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                            aria-label="Download document"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => deleteDocument.mutate(document.id)}
                            disabled={deleteDocument.isPending}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                            aria-label="Delete document"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                  ))}
                  {!docs.length && (
                      <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
                        <FolderOpen className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                        <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">No documents yet</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Upload the receipt or warranty card to complete this record.
                        </p>
                      </div>
                  )}
                </div>
              </Card>
          )}

          {tab === 'maintenance' && (
              <Card className="border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Service history</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Repairs and maintenance help tell the full ownership story.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setMaintenanceOpen(true)} className="dark:bg-blue-600 dark:hover:bg-blue-500">
                    <Plus className="mr-2 h-4 w-4" />
                    Add service record
                  </Button>
                </div>
                <div className="mt-6 space-y-5">
                  {device.maintenanceHistory?.map(item => (
                      <div key={item.id} className="flex gap-4">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="flex-1 border-b border-slate-100 pb-5 dark:border-slate-700">
                          <div className="flex flex-wrap justify-between gap-2">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">{item.type}</h3>
                            <time className="text-sm text-slate-500 dark:text-slate-400">{date(item.date)}</time>
                          </div>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {item.serviceProvider || 'No service provider'} · ₹{Number(item.cost || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                  ))}
                  {!device.maintenanceHistory?.length && (
                      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
                        <Wrench className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                        <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">No service history yet</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Add repairs, service visits, or scheduled maintenance.
                        </p>
                      </div>
                  )}
                </div>
              </Card>
          )}

          <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
            <DialogContent className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <DialogHeader>
                <DialogTitle className="dark:text-slate-100">Add service record</DialogTitle>
                <DialogDescription className="dark:text-slate-400">
                  Record a repair, maintenance visit, or scheduled service.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 px-6 pb-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Type
                  <select
                      value={record.type}
                      onChange={event => setRecord({ ...record, type: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option>Maintenance</option>
                    <option>Repair</option>
                    <option>Inspection</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                  <input
                      type="date"
                      value={record.date}
                      onChange={event => setRecord({ ...record, date: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 sm:col-span-2">
                  Description
                  <textarea
                      required
                      value={record.description}
                      onChange={event => setRecord({ ...record, description: event.target.value })}
                      rows="3"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      placeholder="What was done?"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cost
                  <input
                      type="number"
                      min="0"
                      value={record.cost}
                      onChange={event => setRecord({ ...record, cost: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Service provider
                  <input
                      value={record.serviceProvider}
                      onChange={event => setRecord({ ...record, serviceProvider: event.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMaintenanceOpen(false)} className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                  Cancel
                </Button>
                <Button onClick={saveMaintenance} disabled={!record.description.trim()} isLoading={addMaintenance.isPending} className="dark:bg-blue-600 dark:hover:bg-blue-500">
                  Save record
                </Button>
              </DialogFooter>
              <DialogClose onClick={() => setMaintenanceOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
  );
}