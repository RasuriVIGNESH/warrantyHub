import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, ChevronRight, ClipboardCheck, FileText, Plus, ShieldCheck, Wrench } from 'lucide-react';
import { useDashboardQuery } from '../hooks/useDashboard';
import { useDevicesQuery } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getDeviceIcon } from '../utils/getDeviceIcon';

function getAccent() {
  // 2. Royal Navy — trustworthy, Harvard, Ralph Lauren
  // return '#1B3A5C';

  // 6. Deep Teal — refined modern, coastal luxury
  return '#1A4D5C';
}

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const date = value => new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const status = {
  active: { label: 'Protected', color: 'success' },
  'expiring-soon': { label: 'Expiring soon', color: 'warning' },
  expired: { label: 'Expired', color: 'danger' }
};

// ✅ FIXED: Added dark mode classes to all tone variants
function Metric({ label, value, detail, icon: Icon, tone = 'blue', accent }) {
  const tones = {
    blue: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
    green: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
    amber: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
    slate: 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
  };

  return (
      <div className={`border rounded-2xl p-5 transition-all duration-300 hover:shadow-md ${tones[tone]}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-2">{label}</p>
            <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
          </div>
          <div
              className="rounded-xl border p-3 transition-colors"
              style={{
                borderColor: `${accent}30`,
                backgroundColor: `${accent}08`
              }}
          >
            <Icon
                className="h-5 w-5 transition-colors"
                style={{ color: accent }}
            />
          </div>
        </div>
      </div>
  );
}

function AttentionRow({ device, message, action, accent }) {
  const Icon = getDeviceIcon(device);
  const isExpired = device.warrantyStatus === 'expired';

  return (
      <Link
          to={`/devices/${device.id}`}
          className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-sm"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.backgroundColor = `${accent}08`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.backgroundColor = '';
          }}
      >
        <div
            className="rounded-xl p-3 transition-colors"
            style={{
              backgroundColor: isExpired ? '#fef2f2' : '#fffbeb',
              color: isExpired ? '#dc2626' : '#d97706'
            }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">{device.name}</p>
            <Badge color={isExpired ? 'danger' : 'warning'} size="sm">
              {status[device.warrantyStatus]?.label}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
        </div>
        <span
            className="hidden text-sm font-medium transition-colors sm:block"
            style={{ color: accent }}
        >
        {action}
      </span>
        <ChevronRight
            className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-0.5"
            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
        />
      </Link>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading: isDashboardLoading } = useDashboardQuery();
  const { data: devices = [], isLoading: isDevicesLoading } = useDevicesQuery();
  const isLoading = isDashboardLoading || isDevicesLoading;

  const accent = getAccent();

  const upcoming = useMemo(
      () =>
          devices
              .filter(device => device.daysRemaining != null && device.daysRemaining >= 0)
              .sort((a, b) => a.daysRemaining - b.daysRemaining),
      [devices]
  );

  const attention = useMemo(
      () =>
          devices
              .filter(device =>
                  device.daysRemaining < 0 ||
                  device.warrantyStatus === 'expiring-soon' ||
                  device.documents.length === 0
              )
              .sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0)),
      [devices]
  );

  if (isLoading) {
    return (
        <div className="space-y-6 p-5 sm:p-8">
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(item => (
                <div key={item} className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
    );
  }

  const nextDevice = upcoming[0];

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:px-8 sm:py-8 transition-colors duration-300">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Hero Card - Next Important Date */}
          {nextDevice ? (
              <div
                  className="rounded-3xl p-6 sm:p-8 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  style={{ backgroundColor: accent }}
              >
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-3">
                      <CalendarClock className="h-4 w-4" />
                      Next Important Date
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                      {nextDevice.name} needs a review
                    </h2>
                    <p className="opacity-80 max-w-xl text-sm sm:text-base">
                      Warranty ends on {date(nextDevice.warrantyEndDate)}. Check your documents or start a claim.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-sm p-5">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{Math.max(nextDevice.daysRemaining, 0)}</p>
                      <p className="text-xs uppercase tracking-wide opacity-80 mt-1">days left</p>
                    </div>
                    <Link
                        to={`/devices/${nextDevice.id}`}
                        className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105"
                        style={{ color: accent }}
                    >
                      Review Device
                    </Link>
                  </div>
                </div>
              </div>
          ) : (
              <div className="rounded-3xl border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-8">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-800 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-1">
                      You're all set
                    </h2>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      No warranties expiring in the next 90 days.
                    </p>
                  </div>
                </div>
              </div>
          )}

          {/* Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
                label="Protected Value"
                value={currency.format(dashboard?.stats.protectedValue || 0)}
                detail={`${dashboard?.stats.totalDevices || 0} tracked items`}
                icon={ShieldCheck}
                tone="blue"
                accent={accent}
            />
            <Metric
                label="Active Coverage"
                value={dashboard?.stats.activeCoverage || 0}
                detail="Devices currently protected"
                icon={CheckCircle2}
                tone="green"
                accent={accent}
            />
            <Metric
                label="Needs Attention"
                value={(dashboard?.stats.expiringSoon || 0) + (dashboard?.stats.expired || 0)}
                detail="Expiring or expired"
                icon={AlertTriangle}
                tone="amber"
                accent={accent}
            />
            <Metric
                label="Record Completeness"
                value={`${dashboard?.stats.recordCompleteness || 0}%`}
                detail={`${dashboard?.stats.missingDocuments || 0} missing documents`}
                icon={ClipboardCheck}
                tone="slate"
                accent={accent}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">

            {/* Needs Attention */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-colors duration-300">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Needs Your Attention
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Small actions now prevent expensive surprises later.
                  </p>
                </div>
                <Link
                    to="/devices"
                    className="text-sm font-medium transition-colors hover:underline underline-offset-4"
                    style={{ color: accent }}
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {attention.length ? (
                    attention.slice(0, 4).map(device => (
                        <AttentionRow
                            key={device.id}
                            device={device}
                            message={
                              device.daysRemaining < 0
                                  ? `Coverage expired ${Math.abs(device.daysRemaining)} days ago`
                                  : device.documents.length === 0
                                      ? 'Attach proof of purchase to complete this record'
                                      : 'Review device health and coverage'
                            }
                            action={device.daysRemaining < 0 ? 'Review options' : 'Take action'}
                            accent={accent}
                        />
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
                      <CheckCircle2 className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
                      <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">
                        Nothing needs attention
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Your records are in good shape.
                      </p>
                    </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-colors duration-300">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Quick Actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Keep your records useful and up to date.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <Link
                    to="/devices/new"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-sm group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = `${accent}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                >
                  <div
                      className="rounded-lg p-2 transition-colors"
                      style={{ backgroundColor: `${accent}10` }}
                  >
                    <Plus className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <span className="flex-1">
                  <b className="block text-sm text-slate-900 dark:text-slate-100">Add a device</b>
                  <small className="text-xs text-slate-500 dark:text-slate-400">Start with a receipt or manual entry</small>
                </span>
                  <ArrowRight
                      className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1"
                      onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  />
                </Link>

                <Link
                    to="/claims"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-sm group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = `${accent}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                >
                  <div
                      className="rounded-lg p-2 transition-colors"
                      style={{ backgroundColor: `${accent}10` }}
                  >
                    <Wrench className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <span className="flex-1">
                  <b className="block text-sm text-slate-900 dark:text-slate-100">Start a claim</b>
                  <small className="text-xs text-slate-500 dark:text-slate-400">Prepare the right information</small>
                </span>
                  <ArrowRight
                      className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1"
                      onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  />
                </Link>

                <Link
                    to="/reports"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-sm group"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.backgroundColor = `${accent}08`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                >
                  <div
                      className="rounded-lg p-2 transition-colors"
                      style={{ backgroundColor: `${accent}10` }}
                  >
                    <FileText className="h-5 w-5" style={{ color: accent }} />
                  </div>
                  <span className="flex-1">
                  <b className="block text-sm text-slate-900 dark:text-slate-100">Create a report</b>
                  <small className="text-xs text-slate-500 dark:text-slate-400">For insurance, moving, or resale</small>
                </span>
                  <ArrowRight
                      className="h-4 w-4 text-slate-400 transition-all group-hover:translate-x-1"
                      onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Coverage */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 transition-colors duration-300">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Upcoming Coverage
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your next 90 days at a glance.
                </p>
              </div>
              <Link
                  to="/devices"
                  className="text-sm font-medium transition-colors hover:underline underline-offset-4"
                  style={{ color: accent }}
              >
                Manage devices
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {upcoming.slice(0, 3).map(device => (
                  <Link
                      key={device.id}
                      to={`/devices/${device.id}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-md group"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '';
                      }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">{device.name}</p>
                      <Badge
                          color={device.daysRemaining <= 30 ? 'warning' : 'success'}
                          size="sm"
                      >
                        {device.daysRemaining} days
                      </Badge>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700 mb-3">
                      <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(8, Math.min(100, 100 - device.daysRemaining))}%`,
                            backgroundColor: device.daysRemaining <= 30 ? '#f59e0b' : accent
                          }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Expires {date(device.warrantyEndDate)}
                    </p>
                  </Link>
              ))}
              {!upcoming.length && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 md:col-span-3 text-center py-8">
                    No upcoming expiries.
                  </p>
              )}
            </div>
          </div>

        </div>
      </div>
  );
}