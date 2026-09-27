import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CalendarClock, CheckCircle2, Filter, Package, Plus, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useDevicesQuery } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getDeviceIcon } from '../utils/getDeviceIcon';

/* ═══════════════════════════════════════════════════════════════════════════
   🎨  COLOR FUNCTION — CHANGE THE COLOR HERE
   ─────────────────────────────────────────────────────────────────────────
   Just return the color you want. Pick one from the presets below, or
   enter any hex code. The entire page will update automatically.
   ═══════════════════════════════════════════════════════════════════════════ */
function getAccent() {
  return '#1A4D5C'; // Deep Teal
}
/* ═══════════════════════════════════════════════════════════════════════════ */
const status = {
    active: { label: 'Protected', color: 'success' },
    'expiring-soon': { label: 'Expiring soon', color: 'warning' },
    expired: { label: 'Expired', color: 'danger' },
    pending: { label: 'Pending', color: 'secondary' },
};

const formatDate = value =>
    new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

function DeviceCard({ device, accent }) {
  const Icon = getDeviceIcon(device);
  const complete =
      device.documents.length > 0 && device.serialNumber && device.warrantyEndDate;

  const isExpired = device.daysRemaining < 0;
  const isExpiringSoon = device.daysRemaining >= 0 && device.daysRemaining <= 45;

  // Progress bar color: red for expired, amber for expiring soon, accent otherwise
  const barColor = isExpired ? '#dc2626' : isExpiringSoon ? '#d97706' : accent;
  const daysColor = isExpired
      ? '#dc2626'
      : isExpiringSoon
          ? '#d97706'
          : '#0f172a'; // slate-900

  return (
      <Link
          to={`/devices/${device.id}`}
          className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
          }}
      >
        {/* Top row: Icon + Status */}
        <div className="flex items-start justify-between gap-3">
          <div
              className="rounded-xl p-3 transition-colors"
              style={{
                backgroundColor: `${accent}10`,
                color: accent,
              }}
          >
            <Icon className="h-6 w-6" />
          </div>
          <Badge
              color={status[device.warrantyStatus]?.color || 'secondary'}
              size="sm"
          >
            {status[device.warrantyStatus]?.label}
          </Badge>
        </div>

        {/* Title + Manufacturer */}
        <div className="mt-5">
          <h2 className="truncate text-lg font-semibold text-slate-950 dark:text-slate-100">
            {device.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {device.manufacturer} · {device.model}
          </p>
        </div>

        {/* Warranty info */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <CalendarClock className="h-4 w-4" />
            Warranty
          </span>
            <span className="font-medium" style={{ color: isExpired || isExpiringSoon ? daysColor : (document.documentElement.classList.contains('dark') ? '#7FB8A0' : '#0f172a') }}>
            {isExpired
                ? `${Math.abs(device.daysRemaining)} days ago`
                : `${device.daysRemaining} days left`}
          </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(
                      6,
                      Math.min(100, isExpired ? 100 : 100 - device.daysRemaining)
                  )}%`,
                  backgroundColor: barColor,
                }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">
            Ends {formatDate(device.warrantyEndDate)}
          </span>
            <span
                className="flex items-center gap-1"
                style={{ color: complete ? '#16a34a' : '#d97706' }}
            >
            {complete ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
                <AlertCircle className="h-3.5 w-3.5" />
            )}
              {complete ? 'Complete record' : 'Needs details'}
          </span>
          </div>
        </div>
      </Link>
  );
}

export function Devices() {
  const navigate = useNavigate();
    const { data: devices = [], isLoading } = useDevicesQuery();
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [category, setCategory] = useState('all');

    const accent = getAccent();
  const categories = [...new Set(devices.map((device) => device.category))];

  const filtered = useMemo(
      () =>
          devices.filter((device) => {
            const term = query.toLowerCase();
            const matchesQuery = [
              device.name,
              device.manufacturer,
              device.model,
              device.serialNumber,
            ].some((value) => value?.toLowerCase().includes(term));
            return (
                matchesQuery &&
                (filter === 'all' || device.warrantyStatus === filter) &&
                (category === 'all' || device.category === category)
            );
          }),
      [devices, query, filter, category]
  );

  const hasActiveFilters = query || filter !== 'all' || category !== 'all';

  return (
      <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-8 sm:py-8 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: accent }}
              >
                <Package className="h-4 w-4" />
                Your inventory
              </div>
              {/*<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">*/}
              {/*  Devices*/}
              {/*</h1>*/}
              {/*<p className="mt-1 text-slate-500 dark:text-slate-400">*/}
              {/*  One reliable record for every important purchase.*/}
              {/*</p>*/}
            </div>
            <button
                onClick={() => navigate('/devices/new')}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: accent }}
            >
              <Plus className="h-4 w-4" />
              Add device
            </button>
          </header>

          {/* Search + Filters */}
          <Card className="border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, brand, model, or serial number"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = accent;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${accent}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                />
              </div>

              {/* Filter dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                <div
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: accent }}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </div>
                <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <option value="all">All statuses</option>
                  <option value="active">Protected</option>
                  <option value="expiring-soon">Expiring soon</option>
                  <option value="expired">Expired</option>
                </select>
                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                >
                  <option value="all">All categories</option>
                  {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {hasActiveFilters && (
                  <button
                      onClick={() => {
                        setQuery('');
                        setFilter('all');
                        setCategory('all');
                      }}
                      className="inline-flex items-center gap-1 font-medium transition-colors hover:underline"
                      style={{ color: accent }}
                  >
                    <X className="h-3 w-3" />
                    Clear filters
                  </button>
              )}
            </div>
          </Card>

          {/* Content */}
          {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700"
                    />
                ))}
              </div>
          ) : filtered.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((device) => (
                    <DeviceCard key={device.id} device={device} accent={accent} />
                ))}
              </div>
          ) : (
              <Card className="border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-600 dark:bg-slate-800">
                <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${accent}15` }}
                >
                  <Filter className="h-6 w-6" style={{ color: accent }} />
                </div>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
                  No devices match these filters
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try a different search or add a new device.
                </p>
                <button
                    onClick={() => navigate('/devices/new')}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
                    style={{ backgroundColor: accent }}
                >
                  <Plus className="h-4 w-4" />
                  Add a device
                </button>
              </Card>
          )}
        </div>
      </div>
  );
}