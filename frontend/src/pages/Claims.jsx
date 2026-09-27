import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardList, FileText, Plus, ShieldCheck, Wrench } from 'lucide-react';
import { useClaimsQuery, useCreateClaim, useUpdateClaimStatus } from '../hooks/useClaims';
import { useDevicesQuery } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';

const steps = ['Problem', 'Documents', 'Review'];
const claimStatus = {
  DRAFT: { label: 'Draft', color: 'secondary' },
  SUBMITTED: { label: 'Submitted', color: 'info' },
  WAITING_FOR_RESPONSE: { label: 'Waiting for response', color: 'warning' },
  REPAIR_SCHEDULED: { label: 'Repair scheduled', color: 'info' },
  RESOLVED: { label: 'Resolved', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'danger' },
  CANCELLED: { label: 'Cancelled', color: 'secondary' },
};

export function Claims() {
  const { data: claims = [], isLoading } = useClaimsQuery();
  const { data: devices = [] } = useDevicesQuery();
  const createClaim = useCreateClaim();
  const updateClaim = useUpdateClaimStatus();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ deviceId: '', issue: '', details: '', document: false });

  const selectedDevice = useMemo(() => devices.find(device => device.id === form.deviceId), [devices, form.deviceId]);
  const canContinue = step === 0 ? form.deviceId && form.issue.trim().length >= 8 : step === 1 ? form.document : true;

  const submit = async () => {
    await createClaim.mutateAsync({ deviceId: Number(form.deviceId), issue: form.issue, details: form.details });
    setOpen(false);
    setStep(0);
    setForm({ deviceId: '', issue: '', details: '', document: false });
  };

  return (
      <div className="min-h-screen bg-slate-50 px-4 py-5 transition-colors duration-300 dark:bg-slate-900 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-6">

          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <Wrench className="h-4 w-4" /> Claim assistant
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                Get support without hunting for paperwork
              </h1>
              <p className="mt-1 max-w-2xl text-slate-500 dark:text-slate-400">
                Create a clear claim record with the device details, coverage, and documents a provider needs.
              </p>
            </div>
            <Button onClick={() => setOpen(true)} className="dark:bg-blue-600 dark:hover:bg-blue-500">
              <Plus className="mr-2 h-4 w-4" />
              Start a claim
            </Button>
          </header>

          <Card className="border-blue-100 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex gap-4">
              <div className="rounded-xl bg-white p-3 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">A complete claim is easier to resolve</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  WarrantyHub keeps the issue, serial number, dates, provider, and proof of purchase together.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">

            {/* Claims List */}
            <Card className="border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Your claims</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track every request from draft to resolution.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {claims.length} total
              </span>
              </div>
              <div className="mt-5 space-y-3">
                {isLoading ? (
                    <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-700" />
                ) : claims.map(claim => (
                    <div key={claim.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100">{claim.deviceName || 'Device claim'}</h3>
                            <Badge color={claimStatus[claim.status]?.color || 'secondary'} size="sm">
                              {claimStatus[claim.status]?.label || claim.status}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{claim.issue}</p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                            Updated {new Date(claim.updatedAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        {claim.status !== 'RESOLVED' && claim.status !== 'REJECTED' && claim.status !== 'CANCELLED' && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateClaim.mutate({ id: claim.id, status: claim.status === 'DRAFT' ? 'SUBMITTED' : 'WAITING_FOR_RESPONSE' })}
                                className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              {claim.status === 'DRAFT' ? 'Submit claim' : 'Update status'}
                            </Button>
                        )}
                      </div>
                    </div>
                ))}
                {!claims.length && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-600">
                      <ClipboardList className="mx-auto h-8 w-8 text-slate-400 dark:text-slate-500" />
                      <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">No claims yet</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start one when a device needs support.</p>
                    </div>
                )}
              </div>
            </Card>

            {/* Claim Checklist */}
            <Card className="border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-100">Claim checklist</h2>
              <div className="mt-5 space-y-4">
                {['Device model and serial number', 'Purchase date and warranty end date', 'Proof of purchase', 'Clear issue description'].map((item) => (
                    <div key={item} className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
                    </div>
                ))}
              </div>
              <Link to="/reports" className="mt-6 flex items-center text-sm font-medium text-blue-700 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Export a claim packet <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Card>
          </div>

          {/* Create Claim Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <DialogHeader>
                <DialogTitle className="dark:text-slate-100">Start a claim</DialogTitle>
                <DialogDescription className="dark:text-slate-400">Build a claim packet in three short steps.</DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-5">
                <div className="mb-6 flex items-center gap-2">
                  {steps.map((label, index) => (
                      <div key={label} className="flex flex-1 items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${index <= step ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {index + 1}
                        </div>
                        <span className={`hidden text-xs sm:block ${index <= step ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {label}
                    </span>
                        {index < steps.length - 1 && <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />}
                      </div>
                  ))}
                </div>

                {step === 0 && (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Which device needs support?
                        <select
                            value={form.deviceId}
                            onChange={event => setForm({ ...form, deviceId: event.target.value })}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        >
                          <option value="">Select a device</option>
                          {devices.map(device => (
                              <option key={device.id} value={device.id}>
                                {device.name} · {device.manufacturer}
                              </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        What is the problem?
                        <textarea
                            value={form.issue}
                            onChange={event => setForm({ ...form, issue: event.target.value })}
                            rows="3"
                            placeholder="Describe what happened in at least 8 characters"
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                        />
                      </label>
                    </div>
                )}

                {step === 1 && (
                    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                      <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">Proof of purchase</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {selectedDevice?.documents?.length
                                ? 'A document is already attached to this device.'
                                : 'This device does not have a receipt attached yet.'}
                          </p>
                          <label className="mt-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input
                                type="checkbox"
                                checked={form.document}
                                onChange={event => setForm({ ...form, document: event.target.checked })}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                            />
                            I confirm the available document is ready
                          </label>
                        </div>
                      </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                      <p><b className="text-slate-900 dark:text-slate-100">Device:</b> {selectedDevice?.name}</p>
                      <p><b className="text-slate-900 dark:text-slate-100">Provider:</b> {selectedDevice?.warrantyProvider}</p>
                      <p><b className="text-slate-900 dark:text-slate-100">Issue:</b> {form.issue}</p>
                      <p><b className="text-slate-900 dark:text-slate-100">Next:</b> Submit this claim for follow-up.</p>
                    </div>
                )}
              </div>

              <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => step ? setStep(step - 1) : setOpen(false)}
                    className="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {step ? 'Back' : 'Cancel'}
                </Button>
                {step < 2 ? (
                    <Button disabled={!canContinue} onClick={() => setStep(step + 1)} className="dark:bg-blue-600 dark:hover:bg-blue-500">
                      Continue
                    </Button>
                ) : (
                    <Button isLoading={createClaim.isPending} onClick={submit} className="dark:bg-blue-600 dark:hover:bg-blue-500">
                      Create claim
                    </Button>
                )}
              </DialogFooter>
              <DialogClose onClick={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
  );
}